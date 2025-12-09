'use server';
/**
 * @fileOverview Waste disposal tips generator.
 *
 * - generateDisposalTips - A function that generates disposal tips for a given waste item.
 * - GenerateDisposalTipsInput - The input type for the generateDisposalTips function.
 * - GenerateDisposalTipsOutput - The return type for the generateDisposalTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDisposalTipsInputSchema = z.object({
  wasteType: z
    .string()
    .describe('The type of waste to generate disposal tips for.'),
});
export type GenerateDisposalTipsInput = z.infer<typeof GenerateDisposalTipsInputSchema>;

const GenerateDisposalTipsOutputSchema = z.object({
  disposalTips: z
    .string()
    .describe('The generated disposal tips for the given waste type.'),
});
export type GenerateDisposalTipsOutput = z.infer<typeof GenerateDisposalTipsOutputSchema>;

export async function generateDisposalTips(
  input: GenerateDisposalTipsInput
): Promise<GenerateDisposalTipsOutput> {
  return generateDisposalTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDisposalTipsPrompt',
  input: {schema: GenerateDisposalTipsInputSchema},
  output: {schema: GenerateDisposalTipsOutputSchema},
  prompt: `You are an expert in waste disposal and recycling.

  Generate disposal tips for the following type of waste:

  {{wasteType}}

  Provide clear and concise instructions on how to properly dispose of this waste, including whether it can be recycled, composted, or requires special handling.  Consider local recycling guidelines where applicable.
  `,
});

const generateDisposalTipsFlow = ai.defineFlow(
  {
    name: 'generateDisposalTipsFlow',
    inputSchema: GenerateDisposalTipsInputSchema,
    outputSchema: GenerateDisposalTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
