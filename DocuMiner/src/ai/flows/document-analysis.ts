'use server';
/**
 * @fileOverview Analyzes documents and extracts relevant sections based on persona and job-to-be-done.
 *
 * - analyzeDocuments - A function that handles the document analysis process.
 * - AnalyzeDocumentsInput - The input type for the analyzeDocuments function.
 * - AnalyzeDocumentsOutput - The return type for the analyzeDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ExtractedSectionSchema } from '@/ai/schemas';

const AnalyzeDocumentsInputSchema = z.object({
  documents: z.array(
    z.object({
      name: z.string().describe('The name of the document.'),
      content: z.string().describe('The content of the document.'),
    })
  ).describe('An array of documents to analyze.'),
  persona: z.string().describe('The persona of the user.'),
  jobToBeDone: z.string().describe('The job to be done.'),
  tone: z.string().describe('The desired tone for the extracted content.'),
  includeContextualTags: z.boolean().describe('Whether to include contextual tags.'),
});
export type AnalyzeDocumentsInput = z.infer<typeof AnalyzeDocumentsInputSchema>;

const AnalyzeDocumentsOutputSchema = z.object({
  extractedSections: z.array(ExtractedSectionSchema).describe('The extracted sections from the documents.'),
});
export type AnalyzeDocumentsOutput = z.infer<typeof AnalyzeDocumentsOutputSchema>;

export async function analyzeDocuments(input: AnalyzeDocumentsInput): Promise<AnalyzeDocumentsOutput> {
  return analyzeDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentsPrompt',
  input: {schema: AnalyzeDocumentsInputSchema},
  output: {schema: AnalyzeDocumentsOutputSchema},
  prompt: `You are an expert document analyst.

You will analyze a collection of documents and extract the most relevant sections based on the persona and job-to-be-done provided.
When extracting the content, you must rewrite it in a {{tone}} tone.

Documents:
{{#each documents}}
  Document Name: {{this.name}}
  Content: {{this.content}}
{{/each}}

Persona: {{persona}}
Job to be done: {{jobToBeDone}}
Tone: {{tone}}

{{#if includeContextualTags}}
You must also add relevant contextual tags to each section. These tags should be things like "Key Takeaway", "Action Item", "Data Point", or "Insider Tip".
{{/if}}

Extract only the sections that are most relevant to the persona and job-to-be-done. For each section, provide the document name, page number, section title, importance rank (1-10), and content rewritten in the specified tone.

Output the extracted sections as a JSON array.

Format:
{
  "extractedSections": [
    {
      "document": "document name",
      "page": page number,
      "sectionTitle": "section title",
      "importanceRank": importance rank,
      "content": "content of the section rewritten in a {{tone}} tone",
      "tags": ["tag1", "tag2"]
    }
  ]
}`,
});

const analyzeDocumentsFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentsFlow',
    inputSchema: AnalyzeDocumentsInputSchema,
    outputSchema: AnalyzeDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
