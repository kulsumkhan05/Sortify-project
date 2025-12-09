'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
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
          Classify Item
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
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (state.timestamp) { // New result or error from server
      setShowResult(true);
    }
  }, [state.timestamp]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  
  const handleTryAgain = () => {
    setShowResult(false);
    formRef.current?.reset();
    setImagePreview(null);
  };

  if (showResult && state.result) {
    return <ClassificationResult result={state.result} onTryAgain={handleTryAgain} />;
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
              Scan with Camera
            </TabsTrigger>
          </TabsList>
          <form ref={formRef} action={formAction}>
            <TabsContent value="text" className="mt-4">
              <input type="hidden" name="submissionType" value="text" />
              <div className="space-y-2">
                <Label htmlFor="query">Item Description</Label>
                <Textarea
                  id="query"
                  name="query"
                  placeholder="e.g., 'plastic water bottle', 'used pizza box', 'old t-shirt'"
                />
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-4">
              <input type="hidden" name="submissionType" value="image" />
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              {imagePreview && (
                <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-md border">
                  <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                </div>
              )}
            </TabsContent>
            <div className="mt-6">
              <SubmitButton />
            </div>
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
