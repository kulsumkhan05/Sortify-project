'use server';
/**
 * @fileOverview A waste classification AI agent.
 *
 * - classifyWasteFromImage - A function that handles the waste classification from an image.
 * - ClassifyWasteFromImageInput - The input type for the classifyWasteFromImage function.
 * - ClassifyWasteFromImageOutput - The return type for the classifyWasteFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyWasteFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a waste item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyWasteFromImageInput = z.infer<typeof ClassifyWasteFromImageInputSchema>;

const ClassifyWasteFromImageOutputSchema = z.object({
  wasteType: z.enum(['paper', 'plastic', 'metal', 'glass', 'biodegradable', 'e-waste', 'hazardous']).describe("The type of waste identified in the image."),
  confidence: z.number().min(0).max(100).describe("The confidence score of the classification, from 0 to 100."),
});
export type ClassifyWasteFromImageOutput = z.infer<typeof ClassifyWasteFromImageOutputSchema>;

export async function classifyWasteFromImage(input: ClassifyWasteFromImageInput): Promise<ClassifyWasteFromImageOutput> {
  return classifyWasteFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyWasteFromImagePrompt',
  input: {schema: ClassifyWasteFromImageInputSchema},
  output: {schema: ClassifyWasteFromImageOutputSchema},
  prompt: `You are an expert in waste classification. Analyze the provided image and classify the primary waste item into one of the following categories: paper, plastic, metal, glass, biodegradable, e-waste, hazardous.

Provide a confidence score for your classification.

Photo: {{media url=photoDataUri}}`,
});

const classifyWasteFromImageFlow = ai.defineFlow(
  {
    name: 'classifyWasteFromImageFlow',
    inputSchema: ClassifyWasteFromImageInputSchema,
    outputSchema: ClassifyWasteFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
