'use server';

/**
 * @fileOverview Summarizes the environmental impact and common uses of a given waste category.
 *
 * - summarizeWasteCategory - A function that handles the waste category summarization.
 * - SummarizeWasteCategoryInput - The input type for the summarizeWasteCategory function.
 * - SummarizeWasteCategoryOutput - The return type for the summarizeWasteCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWasteCategoryInputSchema = z.object({
  category: z
    .string()
    .describe('The waste category to summarize (e.g., paper, plastic, metal).'),
});
export type SummarizeWasteCategoryInput = z.infer<typeof SummarizeWasteCategoryInputSchema>;

const SummarizeWasteCategoryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the environmental impact and common uses for the given waste category.'
    ),
});
export type SummarizeWasteCategoryOutput = z.infer<typeof SummarizeWasteCategoryOutputSchema>;

export async function summarizeWasteCategory(
  input: SummarizeWasteCategoryInput
): Promise<SummarizeWasteCategoryOutput> {
  return summarizeWasteCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWasteCategoryPrompt',
  input: {schema: SummarizeWasteCategoryInputSchema},
  output: {schema: SummarizeWasteCategoryOutputSchema},
  prompt: `You are an expert in waste management and environmental science.  Provide a concise summary of the environmental impact and common uses for the following waste category:

  Category: {{{category}}}
  `,
});

const summarizeWasteCategoryFlow = ai.defineFlow(
  {
    name: 'summarizeWasteCategoryFlow',
    inputSchema: SummarizeWasteCategoryInputSchema,
    outputSchema: SummarizeWasteCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
