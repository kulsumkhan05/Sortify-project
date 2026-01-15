'use server';

import { summarizeWasteCategory } from '@/ai/flows/summarize-waste-category';
import { generateDisposalTips } from '@/ai/flows/generate-disposal-tips';
import { wasteCategories, wasteCategoryList } from '@/lib/data';
import { z } from 'zod';
import { ZodError } from 'zod';

// Define the shape of the result
export type ClassificationResult = {
  category: string;
  points: number;
  summary: string;
  disposalTips: string;
  isImage: boolean;
  query: string;
  confidence: number;
};

// Define the shape of the state for useFormState
export type FormState = {
  result?: ClassificationResult;
  error?: string;
  timestamp?: number;
};

// Input validation schema
const formSchema = z.object({
  query: z.string().min(3, 'Please describe the item in more detail.').max(100),
});

export async function classifyWaste(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const submissionType = formData.get('submissionType');

  let wasteType: string | undefined;
  let isImage = false;
  let queryDisplay = '';

  if (submissionType === 'text') {
    const query = formData.get('query');
    try {
      const validatedData = formSchema.parse({ query });
      wasteType = validatedData.query;
      queryDisplay = wasteType;
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          error: error.flatten().fieldErrors.query?.[0],
        };
      }
      return {
        error: 'Invalid input.',
      }
    }
  } else if (submissionType === 'image') {
    const image = formData.get('image') as File;
    if (!image || image.size === 0) {
      return { error: 'Please upload an image.' };
    }
    // MOCK: In a real app, you would send this image to a classification model.
    // Here, we'll just pick a random category.
    const randomCategory = wasteCategoryList[Math.floor(Math.random() * wasteCategoryList.length)];
    wasteType = randomCategory.id;
    queryDisplay = `Uploaded Image (classified as ${randomCategory.name})`;
    isImage = true;
  } else {
    return { error: 'Invalid submission type.' };
  }

  if (!wasteType) {
    return { error: 'Could not determine waste type.' };
  }

  const category = wasteType in wasteCategories ? wasteCategories[wasteType].id : wasteType;

  try {
    const [tipsResult, summaryResult] = await Promise.all([
      generateDisposalTips({ wasteType: category }),
      summarizeWasteCategory({ category: category }),
    ]);

    const points = 10 + Math.floor(Math.random() * 11); // 10-20 points
    const confidence = Math.random() * (99.9 - 85) + 85; // Mock confidence score between 85% and 99.9%

    return {
      result: {
        category,
        points,
        disposalTips: tipsResult.disposalTips,
        summary: summaryResult.summary,
        isImage,
        query: queryDisplay,
        confidence,
      },
      timestamp: Date.now(),
    };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while classifying the waste. Please try again.' };
  }
}
