
"use server";

import { z } from "zod";
import { analyzeDocuments } from "@/ai/flows/document-analysis";
import type { AIResponse, DocumentData, ExtractedSection } from "@/lib/types";
import { handlePdfParsing } from "./pdf-actions";
import { runChat } from "@/ai/flows/chatbot";

const analysisSchema = z.object({
  persona: z.string().min(1, "Persona is required."),
  jobToBeDone: z.string().min(1, "Job to be done is required."),
  tone: z.string(),
  includeContextualTags: z.boolean(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        buffer: z.any(), // Accept any type for the buffer initially
      })
    )
    .min(1, "At least one document is required."),
});

type AnalysisInput = z.infer<typeof analysisSchema>;

export async function handleAnalysis(
  input: AnalysisInput
): Promise<{ data: AIResponse | null; error: string | null }> {
  try {
    const validatedInput = analysisSchema.parse(input);

    const documentsWithContent = await Promise.all(
      validatedInput.documents.map(async (doc) => {
        const buffer = Buffer.from(doc.buffer);
        const textContent = await handlePdfParsing(buffer);
        return {
          name: doc.name,
          content: textContent,
        };
      })
    );

    const analysisResult = await analyzeDocuments({
      documents: documentsWithContent,
      persona: validatedInput.persona,
      jobToBeDone: validatedInput.jobToBeDone,
      tone: validatedInput.tone,
      includeContextualTags: validatedInput.includeContextualTags,
    });

    if (!analysisResult || !analysisResult.extractedSections) {
      return {
        data: null,
        error: "Document analysis failed to produce results.",
      };
    }

    return {
      data: {
        analysis: { extractedSections: analysisResult.extractedSections },
      },
      error: null,
    };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return {
        data: null,
        error: e.errors.map((err) => err.message).join(", "),
      };
    }
    const errorMessage =
      e instanceof Error
        ? e.message
        : "An unexpected error occurred during analysis.";
    return { data: null, error: errorMessage };
  }
}

const chatSchema = z.object({
  question: z.string(),
  section: z.object({
    sectionTitle: z.string(),
    content: z.string(),
  }),
});

export async function handleChat(
  input: z.infer<typeof chatSchema>
): Promise<{ response: string | null; error: string | null }> {
    try {
        const { question, section } = chatSchema.parse(input);
        const response = await runChat({
            question,
            sectionTitle: section.sectionTitle,
            sectionContent: section.content
        });

        return { response, error: null };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during chat.";
        return { response: null, error: errorMessage };
    }
}
