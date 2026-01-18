'use server';

import { summarizeWasteCategory } from '@/ai/flows/summarize-waste-category';
import { generateDisposalTips } from '@/ai/flows/generate-disposal-tips';
import { classifyWasteFromImage } from '@/ai/flows/classify-waste-from-image';
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

  let category: string;
  let isImage = false;
  let queryDisplay = '';
  let confidence = 0;

  if (submissionType === 'image') {
    const imageDataUri = formData.get('imageDataUri') as string;
    if (!imageDataUri) {
      return { error: 'Please upload or capture an image to classify.' };
    }
    
    isImage = true;
    queryDisplay = `Uploaded Image`;

    try {
        const result = await classifyWasteFromImage({ photoDataUri: imageDataUri });
        category = result.wasteType;
        confidence = result.confidence;
        queryDisplay = `Uploaded Image (classified as ${wasteCategories[category]?.name || category})`;

    } catch(e) {
        console.error(e);
        return { error: 'Failed to classify the image. Please try again.' };
    }
  
  } else if (submissionType === 'text' && !formData.get('imageDataUri')) {
     return { error: 'Please upload or capture an image to classify.' };
  }
  else {
    return { error: 'Invalid submission type.' };
  }

  if (!category) {
    return { error: 'Could not determine waste category.' };
  }

  try {
    const [tipsResult, summaryResult] = await Promise.all([
      generateDisposalTips({ wasteType: category }),
      summarizeWasteCategory({ category: category }),
    ]);

    const points = 10 + Math.floor(Math.random() * 11); // 10-20 points

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
    return { error: 'An error occurred while getting details for the waste. Please try again.' };
  }
}
