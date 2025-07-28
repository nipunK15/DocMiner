/**
 * @fileOverview This file contains shared Zod schemas used across different AI flows.
 */

import {z} from 'genkit';

export const ExtractedSectionSchema = z.object({
  document: z.string().describe('The name of the document.'),
  page: z.number().describe('The page number of the section.'),
  sectionTitle: z.string().describe('The title of the section.'),
  importanceRank: z.number().describe('The importance rank of the section (1-10, 10 being the most important).'),
  content: z.string().describe('The content of the section.'),
  tags: z.array(z.string()).optional().describe('Contextual tags like "Key Takeaway", "Action Item", or "Insider Tip".'),
});
