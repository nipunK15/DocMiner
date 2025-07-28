
'use server';
/**
 * @fileOverview A chatbot flow to answer questions about a specific document section.
 *
 * - runChat - A function that handles the chatbot interaction.
 * - ChatbotInput - The input type for the chatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  question: z.string().describe('The question the user is asking.'),
  sectionTitle: z.string().describe('The title of the document section.'),
  sectionContent: z
    .string()
    .describe('The full content of the document section.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export async function runChat(input: ChatbotInput): Promise<string> {
    const prompt = ai.definePrompt({
        name: 'chatbotPrompt',
        input: { schema: ChatbotInputSchema },
        prompt: `You are a helpful and insightful AI assistant integrated into a chatbot.
Your primary role is to help users understand a specific section of a document.

When a user asks a question, you must follow these rules:
1.  **Use Only Provided Context**: Base your answer *only* on the provided context from the document section below. Do not use any outside knowledge or information from other sections.
2.  **Provide Precise Answers**: Answer the user's question with precise, section-specific detail.
3.  **Cite Your Source**: Always end your answer with a citation in brackets, like "[from {{{sectionTitle}}}]".
4.  **Elaborate Concisely**: If the user’s query requires a deeper explanation beyond the provided text, generate a concise summary or example, but do *not* reference other sections.
5.  **Handle Missing Information**: If the answer is not in the context, clearly state that you cannot find the answer in the provided section, but you can still discuss the existing content. Then, cite the source as usual.

CONTEXT FROM THE DOCUMENT SECTION:
Section Title: {{{sectionTitle}}}
Content:
{{{sectionContent}}}

---

USER'S QUESTION:
{{{question}}}
`
    });

    const chatbotFlow = ai.defineFlow(
        {
          name: 'chatbotFlow',
          inputSchema: ChatbotInputSchema,
          outputSchema: z.string(),
        },
        async (input) => {
          const { text } = await ai.generate({
            prompt: await prompt.render(input),
          });

          return text;
        }
      );

    return chatbotFlow(input);
}
