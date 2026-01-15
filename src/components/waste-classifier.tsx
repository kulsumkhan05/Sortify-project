'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { classifyWaste, type FormState } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, FileText, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import ClassificationResult from './classification-result';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Classifying...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Classify Waste
        </>
      )}
    </Button>
  );
}

export default function WasteClassifier() {
  const [state, formAction] = useFormState(classifyWaste, initialState);
  const [activeTab, setActiveTab] = useState('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const resultKey = useMemo(() => state.timestamp, [state.timestamp]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (state.timestamp) {
      setShowResult(true);
    }
  }, [state.timestamp]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setTimeout(() => {
            if (formRef.current) {
                const submitButton = formRef.current.querySelector('button[type="submit"]');
                if (submitButton instanceof HTMLElement) {
                    submitButton.click();
                }
            }
        }, 100)
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  
  const handleTryAgain = () => {
    setShowResult(false);
    formRef.current?.reset();
    if(imageInputRef.current) {
        imageInputRef.current.value = '';
    }
    setImagePreview(null);
  };

  if (showResult && state.result) {
    return <ClassificationResult key={resultKey} result={state.result} onTryAgain={handleTryAgain} imagePreview={imagePreview} />;
  }

  return (
    <Card className="mx-auto mt-8 max-w-2xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">What are you throwing away?</CardTitle>
        <CardDescription>Upload a photo or describe the item to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">
              <FileText className="mr-2 h-4 w-4" />
              Describe Item
            </TabsTrigger>
            <TabsTrigger value="image">
              <Camera className="mr-2 h-4 w-4" />
              Upload Image
            </TabsTrigger>
          </TabsList>
          <form ref={formRef} action={formAction}>
            <TabsContent value="text" className="mt-4">
              <input type="hidden" name="submissionType" value="text" />
              <div className="space-y-4">
                <div>
                    <Label htmlFor="query">Item Description</Label>
                    <Textarea
                    id="query"
                    name="query"
                    placeholder="e.g., 'plastic water bottle', 'used pizza box', 'old t-shirt'"
                    className="mt-1"
                    />
                </div>
                 <SubmitButton />
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-4">
              <input type="hidden" name="submissionType" value="image" />
              <div className="space-y-2 text-center">
                <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:bg-gray-50">
                        <Camera className="h-10 w-10 text-gray-400"/>
                        <p className="mt-2 text-sm font-medium text-gray-600">Click to upload an image</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </Label>
                <Input ref={imageInputRef} id="image-upload" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
              </div>
              {imagePreview && (
                <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-md border">
                  <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                </div>
              )}
               <div className="mt-6 hidden">
                 <SubmitButton />
               </div>
            </TabsContent>
           
          </form>
        </Tabs>
        {showResult && state.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
