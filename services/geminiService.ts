import { KnowledgeChunk } from "../types";

export const generateSectionContent = async (
  sectionTitle: string,
  systemPrompt: string,
  userNotes: string,
  knowledgeContext: KnowledgeChunk[]
): Promise<{ text: string; sources: string[] }> => {
  const response = await fetch("/api/generate-section", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sectionTitle,
      systemPrompt,
      userNotes,
      knowledgeContext,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "Failed to generate content.");
  }

  return response.json();
};
