
'use server';
/**
 * @fileOverview Finds related content for a given section from a list of other sections.
 *
 * - findRelatedContent - A function that finds related content.
 * - FindRelatedContentInput - The input type for the findRelatedContent function.
 * - FindRelatedContentOutput - The return type for the findRelatedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SectionSchema = z.object({
  document: z.string(),
  page: z.number(),
  sectionTitle: z.string(),
  content: z.string(),
});

const FindRelatedContentInputSchema = z.object({
  section: SectionSchema.describe('The section to find related content for.'),
  allSections: z.array(SectionSchema).describe('All sections to search for related content.'),
});
export type FindRelatedContentInput = z.infer<typeof FindRelatedContentInputSchema>;

const RelatedContentSchema = z.object({
  document: z.string().describe('The name of the document.'),
  page: z.number().describe('The page number of the section.'),
  sectionTitle: z.string().describe('The title of the section.'),
  content: z.string().describe('The content of the section.'),
});

const FindRelatedContentOutputSchema = z.object({
    relatedContent: z.array(RelatedContentSchema).describe('The related content sections found.'),
});
export type FindRelatedContentOutput = z.infer<typeof FindRelatedContentOutputSchema>;


export async function findRelatedContent(input: FindRelatedContentInput): Promise<FindRelatedContentOutput> {
  return findRelatedContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findRelatedContentPrompt',
  input: {schema: FindRelatedContentInputSchema},
  output: {schema: FindRelatedContentOutputSchema},
  prompt: `You are an expert at finding related content.

You will be given a specific section and a list of all other sections from a set of documents.
Your task is to identify the top 3 most semantically related sections from the list.
Do not include the original section in the results.

Original Section:
Title: {{{section.sectionTitle}}}
Content: {{{section.content}}}

All Sections:
{{#each allSections}}
  Document: {{this.document}}
  Page: {{this.page}}
  Section Title: {{this.sectionTitle}}
  Content: {{this.content}}
  ---
{{/each}}

Identify the top 3 most related sections and return them.
`,
});

const findRelatedContentFlow = ai.defineFlow(
  {
    name: 'findRelatedContentFlow',
    inputSchema: FindRelatedContentInputSchema,
    outputSchema: FindRelatedContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
