'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-waste-category.ts';
import '@/ai/flows/generate-disposal-tips.ts';
import '@/ai/flows/classify-waste-from-image.ts';
