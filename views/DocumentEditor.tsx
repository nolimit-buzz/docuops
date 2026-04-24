"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '../hooks/useStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DocumentOutline, SectionCard, SourceViewerModal, StatusStepper } from '../components/document-editor/DocumentEditorParts';
import { generateSectionContent } from '../services/geminiService';
import { DocStatus, Document, DocumentSectionFeedback, TemplateSection, KnowledgeChunk, Comment, UserRole } from '../types';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import { createGeneratorPayload } from '../lib/payload-generator';
// --- Main Component ---

export const DocumentEditor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { documents, updateDocument, addDocument, templates, knowledgeBase, user, paperDrafts, clearPaperDraft } = useStore();

  const [doc, setDoc] = useState<Document | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'internal' | 'client' | null>(null);
  const [magicPrompt, setMagicPrompt] = useState('');
  
  // Title Editing State
  const [title, setTitle] = useState('');

  // Source Viewer State
  const [viewingSource, setViewingSource] = useState<KnowledgeChunk | null>(null);

  // Comment State
  const [newComment, setNewComment] = useState('');
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Collaborator State
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    const found = documents.find(d => d.id === id);
    if (found) {
      setDoc(found);
      setTitle(found.title);
      return;
    }

    // New draft — build local state only, don't touch the store
    // (keeps paperDraft alive so the list page shows it without duplicating)
    const draft = paperDrafts[id];
    if (draft) {
      const newDoc: Document = {
        id,
        title: `${draft.paperTypeName} - ${draft.clientName}`,
        templateId: draft.paperTypeId,
        status: DocStatus.DRAFT,
        organizationId: '',
        createdBy: user.id,
        createdAt: new Date(Number(id.replace('draft-', ''))).toISOString(),
        updatedAt: new Date(Number(id.replace('draft-', ''))).toISOString(),
        sections: [],
        projectContext: {
          clientName: draft.clientName,
          category: draft.category,
          budget: draft.budget,
          timeline: draft.timeline,
          processSummary: '',
        },
      };
      setDoc(newDoc);
      setTitle(newDoc.title);
    }
  }, [id, documents, paperDrafts]);

  // Ensures a paperDraft-backed doc is promoted to the documents store before saving.
  const persistDoc = (docToPersist: Document) => {
    const alreadyInStore = documents.some(d => d.id === docToPersist.id);
    if (!alreadyInStore) {
      addDocument(docToPersist);
      clearPaperDraft(docToPersist.id);
    } else {
      updateDocument(docToPersist);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (doc && title.trim() !== doc.title) {
        const updated = { ...doc, title, updatedAt: new Date().toISOString() };
        setDoc(updated);
        persistDoc(updated);
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setActiveSectionId(sectionId);
    }
  };

  const handleGenerate = async (sectionId: string, templateSection: any, customInstruction?: string) => {
    if (!doc) return;
    
    setIsGenerating(true);
    setActiveSectionId(sectionId);

    try {
        const sysPrompt = customInstruction 
            ? `${templateSection.systemPrompt}\n\nAdditional Instruction: ${customInstruction}`
            : templateSection.systemPrompt;
            
        // Include both project context AND any manual inputs from other sections as context
        const contextPayload = {
            project: doc.projectContext,
            inputs: doc.sections.reduce((acc, s) => {
                const sectionDef = templates.find(t => t.id === doc.templateId)?.sections.find(ts => ts.id === s.sectionId);
                // Only include sections that are specifically structured inputs
                if (sectionDef?.type.startsWith('input_')) {
                    acc[sectionDef.title] = s.content;
                }
                return acc;
            }, {} as Record<string, string>)
        };

        const userNotes = JSON.stringify(contextPayload, null, 2);
        
        const result = await generateSectionContent(
            templateSection.title,
            sysPrompt,
            userNotes,
            knowledgeBase
        );

        const newSectionContent = {
            sectionId: sectionId,
            content: result.text,
            isAiGenerated: true,
            ragSourcesUsed: result.sources,
            comments: []
        };

        const existingSectionIndex = doc.sections.findIndex(s => s.sectionId === sectionId);
        let newSections = [...doc.sections];
        
        if (existingSectionIndex >= 0) {
            newSections[existingSectionIndex] = newSectionContent;
        } else {
            newSections.push(newSectionContent);
        }

        const updatedDoc = { ...doc, sections: newSections, updatedAt: new Date().toISOString() };
        setDoc(updatedDoc);
        persistDoc(updatedDoc);
        setMagicPrompt('');

    } catch (e) {
        console.error(e);
        alert("Failed to generate content");
    } finally {
        setIsGenerating(false);
        setActiveSectionId(null);
    }
  };

  const handleContentUpdate = (sectionId: string, val: string) => {
    if (!doc) return;
    const existingSectionIndex = doc.sections.findIndex(s => s.sectionId === sectionId);
    let newSections = [...doc.sections];
    
    if (existingSectionIndex >= 0) {
        newSections[existingSectionIndex] = { ...newSections[existingSectionIndex], content: val };
    } else {
         newSections.push({
            sectionId: sectionId,
            content: val,
            isAiGenerated: false,
            ragSourcesUsed: [],
            comments: []
        });
    }

    const updatedDoc = { ...doc, sections: newSections };
    setDoc(updatedDoc);
    persistDoc(updatedDoc);
  };

  const handleFeedback = (sectionId: string, rating: 'positive' | 'negative' | null) => {
    if (!doc) return;
    const existingSectionIndex = doc.sections.findIndex(s => s.sectionId === sectionId);
    let newSections = [...doc.sections];

    if (existingSectionIndex >= 0) {
        const currentSection = newSections[existingSectionIndex];
        
        // If rating is null, we are clearing the feedback
        if (rating === null) {
            const { feedback, ...rest } = currentSection;
            newSections[existingSectionIndex] = rest;
        } else {
            const currentFeedback: Partial<DocumentSectionFeedback> = currentSection.feedback || {};
            newSections[existingSectionIndex] = { 
                ...currentSection, 
                feedback: { 
                    ...currentFeedback, 
                    rating,
                    // If switching to positive, clear comment. If negative, keep existing comment or allow new one.
                    comment: rating === 'positive' ? undefined : currentFeedback.comment 
                } 
            };
        }
        const updatedDoc = { ...doc, sections: newSections };
        setDoc(updatedDoc);
        persistDoc(updatedDoc);
    }
  };

  const handleFeedbackComment = (sectionId: string, comment: string) => {
    if (!doc) return;
    const existingSectionIndex = doc.sections.findIndex(s => s.sectionId === sectionId);
    let newSections = [...doc.sections];

    if (existingSectionIndex >= 0) {
        const currentSection = newSections[existingSectionIndex];
        const currentFeedback: DocumentSectionFeedback = currentSection.feedback || { rating: 'negative' };
        newSections[existingSectionIndex] = {
             ...currentSection,
             feedback: { ...currentFeedback, comment }
        };
        const updatedDoc = { ...doc, sections: newSections };
        setDoc(updatedDoc);
        persistDoc(updatedDoc);
    }
  };

  const handleMagicSubmit = (sectionId: string, section: TemplateSection) => {
      if (!magicPrompt.trim()) return;
      handleGenerate(sectionId, section, magicPrompt);
  };

  const handleGenerateAll = async () => {
    if (!doc || !template) return;
    
    // Find sections that are NOT input fields and are currently empty
    const sectionsToGenerate = template.sections.filter(ts => {
        const isInput = ts.type.startsWith('input_');
        const hasContent = doc.sections.some(ds => ds.sectionId === ts.id && ds.content.trim().length > 0);
        return !isInput && !hasContent;
    });

    if (sectionsToGenerate.length === 0) {
        alert("All sections already have content!");
        return;
    }

    for (const section of sectionsToGenerate) {
        await handleGenerate(section.id, section);
    }
  };
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setNewComment(val);
      
      const cursor = e.target.selectionStart || 0;
      const textBefore = val.slice(0, cursor);
      const lastAt = textBefore.lastIndexOf('@');
      
      if (lastAt !== -1) {
          const prefix = lastAt === 0 ? ' ' : textBefore[lastAt - 1];
          if (prefix === ' ' || prefix === '\n') {
              const query = textBefore.slice(lastAt + 1);
              if (!/[^\w\s]/.test(query) && query.length < 20) {
                   setMentionQuery(query);
                   setShowMentions(true);
                   return;
              }
          }
      }
      setShowMentions(false);
  };

  const handleMentionSelect = (name: string) => {
      const input = commentInputRef.current;
      if (!input) return;
      
      const cursor = input.selectionStart || 0;
      const textBefore = newComment.slice(0, cursor);
      const lastAt = textBefore.lastIndexOf('@');
      const textAfter = newComment.slice(cursor);
      
      const updatedText = textBefore.substring(0, lastAt) + `@${name} ` + textAfter;
      setNewComment(updatedText);
      setShowMentions(false);
      input.focus();
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !doc) return;
    
    const comment: Comment = {
        id: `c-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        text: newComment,
        timestamp: new Date().toISOString()
    };
    
    const updatedComments = [comment, ...(doc.globalComments || [])];
    const updatedDoc = { ...doc, globalComments: updatedComments };
    setDoc(updatedDoc);
    persistDoc(updatedDoc);
    setNewComment('');
    setShowMentions(false);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim() || !doc) return;
    
    const newCollaborator = {
        userId: `u-${Date.now()}`,
        name: inviteEmail.split('@')[0], 
        email: inviteEmail,
        role: UserRole.EDITOR,
        avatar: `https://placehold.co/100x100?text=${inviteEmail.charAt(0).toUpperCase()}`
    };

    const currentCollaborators = doc.collaborators || [];
    const updatedDoc = { ...doc, collaborators: [...currentCollaborators, newCollaborator] };
    
    setDoc(updatedDoc);
    persistDoc(updatedDoc);
    setInviteEmail('');
    setIsInviting(false);
  };

  if (!doc) return <div className="p-10 flex justify-center text-slate-500">Loading Document...</div>;

  const template = templates.find(t => t.id === doc.templateId);
  const projectContext = doc.projectContext;
  const filteredCollaborators = (doc.collaborators || []).filter(c => 
      c.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* ---------------------------
          LEFT COLUMN: GOVERNANCE
      ---------------------------- */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto hidden md:flex">
          <div className="p-6">
             <div className="flex items-center space-x-2 text-slate-500 mb-8 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => router.push('/documents')}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span className="text-xs font-bold uppercase tracking-wide">Back to Dashboard</span>
             </div>
             
             <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Governance Engine</h2>
             
             {projectContext ? (
                 <div className="space-y-6">
                     <div>
                         <label className="text-[11px] text-slate-400 font-bold uppercase block mb-1">Client</label>
                         <p className="font-bold text-slate-800 text-sm">{projectContext.clientName}</p>
                     </div>
                     <div>
                         <label className="text-[11px] text-slate-400 font-bold uppercase block mb-1">Category</label>
                         <Badge color="blue">{projectContext.category}</Badge>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-[11px] text-slate-400 font-bold uppercase block mb-1">Budget</label>
                             <p className="font-medium text-slate-700 text-sm">{projectContext.budget}</p>
                        </div>
                        <div>
                             <label className="text-[11px] text-slate-400 font-bold uppercase block mb-1">Timeline</label>
                             <p className="font-medium text-slate-700 text-sm">{projectContext.timeline}</p>
                        </div>
                     </div>
                     <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                         <label className="text-[10px] font-bold text-indigo-400 uppercase block mb-2">Process Protocol</label>
                         <p className="text-xs text-indigo-900 leading-relaxed font-medium">{projectContext.processSummary}</p>
                     </div>
                 </div>
             ) : (
                 <p className="text-sm text-slate-400 italic">No context defined.</p>
             )}

             {/* Document Outline */}
             {template && (
                <DocumentOutline 
                    sections={template.sections.map(s => ({ id: s.id, title: s.title }))}
                    activeSectionId={activeSectionId}
                    onNavigate={handleScrollToSection}
                />
             )}
          </div>
      </aside>

      {/* ---------------------------
          CENTER: PREMIUM EDITOR
      ---------------------------- */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 relative flex justify-center">
          <div className="w-full max-w-5xl py-12 px-12 pb-48">
              
              {/* Document Header */}
              <div className="mb-16">
                  <input 
                      type="text" 
                      value={title} 
                      onChange={handleTitleChange} 
                      onBlur={handleTitleBlur}
                      className="text-4xl font-extrabold text-slate-900 bg-transparent border-none focus:ring-0 p-0 w-full placeholder-slate-300 leading-tight"
                      placeholder="Untitled Document"
                  />
                  <div className="h-1.5 w-24 bg-blue-600 mt-6 rounded-full"></div>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                  {template?.sections.map((section, idx) => {
                      const docSection = doc.sections.find(s => s.sectionId === section.id);
                      const isActive = activeSectionId === section.id;
                      
                      return (
                        <SectionCard 
                          key={section.id}
                          idx={idx}
                          section={section}
                          docSection={docSection}
                          isActive={isActive}
                          isGenerating={isGenerating}
                          activeSectionId={activeSectionId}
                          magicPrompt={magicPrompt}
                          knowledgeBase={knowledgeBase}
                          onContentUpdate={handleContentUpdate}
                          onMagicSubmit={handleMagicSubmit}
                          onRegenerate={handleGenerate}
                          onFocus={setActiveSectionId}
                          onMagicPromptChange={(val) => {
                              setActiveSectionId(section.id);
                              setMagicPrompt(val);
                          }}
                          onViewSource={setViewingSource}
                          onFeedback={handleFeedback}
                          onFeedbackComment={handleFeedbackComment}
                        />
                      );
                  })}
              </div>

          </div>
      </main>

      {/* ---------------------------
          RIGHT: ACTIONS & COLLABORATION
      ---------------------------- */}
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto">
          
          {/* 1. Review and Approve Button */}
          <div className="p-6 border-b border-slate-100">
              <Button 
                className="w-full h-12 text-base font-bold shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
                onClick={async () => {
                  if (doc && template) {
                    const payload = createGeneratorPayload(doc, template);
                    console.log("%c🚀 GENERATOR PAYLOAD CAPTURED", "color: #8b5cf6; font-weight: bold; font-size: 14px;");
                    console.log(payload);

                    // Send to server console
                    try {
                      await fetch('/api/log-payload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                    } catch (e) {
                      console.error("Failed to send payload to server console:", e);
                    }
                  }
                  setPreviewMode('client');
                }}
              >
                  {doc.status === DocStatus.APPROVED ? 'View Signed Document' : 'Review & Approve'}
              </Button>
              
              {!doc.status || doc.status === DocStatus.DRAFT && (
                <Button 
                  variant="outline"
                  className="w-full h-12 text-sm font-bold mt-4 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
                  onClick={handleGenerateAll}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Generating Engine...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       Generate Missing Sections
                    </span>
                  )}
                </Button>
              )}
              <p className="text-[11px] text-center text-slate-400 mt-3 font-medium">Finalize and lock document</p>
          </div>

          {/* 2. Current Stage */}
          <div className="p-8 border-b border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Current Stage</h3>
              <StatusStepper status={doc.status} />
          </div>

          {/* 3. Owner */}
          <div className="p-6 border-b border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Owner</h3>
              <div className="flex items-center gap-3">
                  <img src={user.avatar} className="w-12 h-12 rounded-full border border-slate-200 shadow-sm" alt={user.name} />
                  <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium capitalize">{user.role}</p>
                  </div>
              </div>
          </div>

          {/* 4. Collaborators */}
          <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Collaborators</h3>
                  <Button size="sm" variant="ghost" onClick={() => setIsInviting(!isInviting)} className="text-blue-600 hover:text-blue-800 text-xs font-bold h-auto py-1 px-2 bg-blue-50">+ Invite</Button>
              </div>
              
              {isInviting && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                      <input 
                          type="email" 
                          placeholder="colleague@email.com" 
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg mb-2 focus:ring-1 focus:ring-blue-500 outline-none"
                          value={inviteEmail}
                          onChange={e => setInviteEmail(e.target.value)}
                      />
                      <Button size="sm" className="w-full text-xs h-8" onClick={handleInvite} disabled={!inviteEmail}>Send Invite</Button>
                  </div>
              )}

              <div className="flex -space-x-2 overflow-hidden mb-2 pl-1">
                 {/* Current User */}
                 <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white" src={user.avatar} alt={user.name} title={`${user.name} (You)`} />
                 {/* Other Collaborators */}
                 {doc.collaborators?.slice(0, 4).map(c => (
                     <img key={c.userId} className="inline-block h-9 w-9 rounded-full ring-2 ring-white" src={c.avatar} alt={c.name} title={c.name} />
                 ))}
                 {(doc.collaborators?.length || 0) > 4 && (
                     <div className="h-9 w-9 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                         +{doc.collaborators!.length - 4}
                     </div>
                 )}
              </div>
          </div>

          {/* 5. Discussion */}
          <div className="flex-1 flex flex-col border-b border-slate-100">
              <div className="p-6 pb-2">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Discussion</h3>
              </div>
              
              <div className="px-6 space-y-4 mb-4 max-h-80 overflow-y-auto custom-scrollbar">
                   {(doc.globalComments || []).length === 0 && (
                       <p className="text-xs text-slate-400 italic">No comments yet.</p>
                   )}
                   
                   {doc.globalComments?.map(comment => (
                       <div key={comment.id} className="flex gap-3">
                           <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${comment.userId === user.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                               {comment.userName.charAt(0)}
                           </div>
                           <div className="flex-1">
                               <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 text-xs">
                                   <div className="flex justify-between items-center mb-1">
                                       <span className="font-bold text-slate-700">{comment.userName}</span>
                                       <span className="text-[9px] text-slate-400">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                   </div>
                                   <p className="text-slate-600 leading-relaxed">{comment.text}</p>
                               </div>
                           </div>
                       </div>
                   ))}
              </div>

              <div className="px-6 pb-6 relative">
                  {/* Mentions Dropdown */}
                  {showMentions && filteredCollaborators.length > 0 && (
                      <div className="absolute bottom-full left-6 right-6 mb-2 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-20">
                           <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                               Mention...
                           </div>
                           {filteredCollaborators.map(c => (
                               <div 
                                 key={c.userId}
                                 className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors"
                                 onClick={() => handleMentionSelect(c.name)}
                               >
                                   <img src={c.avatar} className="w-5 h-5 rounded-full bg-slate-200" alt={c.name} />
                                   <span className="text-xs font-medium text-slate-700">{c.name}</span>
                               </div>
                           ))}
                      </div>
                  )}

                  <div className="relative">
                      <input
                          ref={commentInputRef}
                          className="w-full pl-3 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm text-xs"
                          placeholder="Type a comment... (@ to mention)"
                          value={newComment}
                          onChange={handleCommentChange}
                          onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment();
                          }}
                      />
                      <button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="absolute right-2 top-2 p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </button>
                  </div>
              </div>
          </div>

          {/* 6. Version History */}
          <div className="p-6">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Version History</h3>
              <div className="space-y-4">
                  <div>
                      <div className="flex justify-between items-baseline mb-1">
                          <span className="text-sm font-bold text-slate-800">v{((doc.versions?.length || 0) * 0.1 + 1.0).toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                      </div>
                      <p className="text-xs text-slate-500">Current working draft</p>
                  </div>
                  {doc.versions?.map(v => (
                      <div key={v.id} className="opacity-70 hover:opacity-100 transition-opacity">
                          <div className="flex justify-between items-baseline mb-1">
                              <span className="text-sm font-semibold text-slate-600">v{v.versionNumber}</span>
                              <span className="text-[10px] text-slate-400">{new Date(v.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{v.changesSummary}</p>
                          <div className="flex items-center gap-1 mt-1">
                              <img src={`https://placehold.co/20x20?text=${v.createdBy.charAt(0)}`} className="w-4 h-4 rounded-full" alt="" />
                              <span className="text-[10px] font-medium text-slate-600">{v.createdBy}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

      </aside>

      {/* Modals */}
      {viewingSource && <SourceViewerModal source={viewingSource} onClose={() => setViewingSource(null)} />}
      
      {previewMode && template && (
          <DocumentPreviewModal 
              doc={doc} 
              template={template} 
              mode={previewMode}
              onClose={() => setPreviewMode(null)} 
              onUpdate={(updated) => {
                  setDoc(updated);
                  persistDoc(updated);
              }}
          />
      )}
    </div>
  );
};