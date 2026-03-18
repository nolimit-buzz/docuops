import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { KnowledgeChunk } from "@/types";

interface GenerateSectionBody {
  sectionTitle: string;
  systemPrompt: string;
  userNotes: string;
  knowledgeContext: KnowledgeChunk[];
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key is missing. Set GEMINI_API_KEY in .env.local." },
      { status: 500 },
    );
  }

  const { sectionTitle, systemPrompt, userNotes, knowledgeContext } =
    (await request.json()) as GenerateSectionBody;

  const ai = new GoogleGenAI({ apiKey });
  let contextString = "";
  const sourceIds: string[] = [];

  if (knowledgeContext.length > 0) {
    contextString += "\n\nRELEVANT KNOWLEDGE BASE CONTEXT:\n";
    for (const chunk of knowledgeContext) {
      contextString += `--- Source: ${chunk.title} ---\n${chunk.content}\n`;
      sourceIds.push(chunk.id);
    }
    contextString +=
      "\nUse the above context to ensure accuracy, but adapt it to the document structure.\n";
  }

  const prompt = `
TASK: Write a document section titled "${sectionTitle}".

GUIDELINES:
${systemPrompt}

USER SPECIFIC NOTES:
${userNotes || "No specific notes provided."}

${contextString}

Output only the content of the section. Do not include the title or markdown code blocks unless necessary for the content itself.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "No content generated.",
      sources: sourceIds,
    });
  } catch (error) {
    console.error("Gemini generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate section content." },
      { status: 500 },
    );
  }
}
