'use client';

import { useActionState, useEffect, useRef, useState, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { classifyWaste, type FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, UploadCloud, Loader2, AlertCircle, Sparkles, X } from 'lucide-react';
import ClassificationResult from './classification-result';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-4" disabled={pending}>
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
  const [state, formAction] = useActionState(classifyWaste, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resultKey = useMemo(() => state.timestamp, [state.timestamp]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (state.result && state.timestamp) {
      setShowResult(true);
    } else if (state.error) {
      setShowResult(false);
    }
  }, [state]);

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

  const resetImageSelection = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }

  const handleTryAgain = () => {
    setShowResult(false);
    setImagePreview(null);
    if(formRef.current) {
        formRef.current.reset();
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  if (showResult && state.result) {
    return <ClassificationResult key={resultKey} result={state.result} onTryAgain={handleTryAgain} imagePreview={imagePreview} />;
  }

  return (
    <Card className="mx-auto mt-8 max-w-2xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">What are you throwing away?</CardTitle>
        <CardDescription>Upload a photo or use your camera to classify an item.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="submissionType" value="image" />
          
          <div className="space-y-4">
            {imagePreview && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={resetImageSelection}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Label htmlFor="image-upload" className="cursor-pointer p-8 rounded-lg border bg-card hover:bg-muted transition-colors flex flex-col items-center justify-center text-center">
                <UploadCloud className="h-10 w-10 text-primary" />
                <span className="mt-2 font-medium">Upload Image</span>
              </Label>
              <Input ref={imageInputRef} id="image-upload" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />

              <Label htmlFor="camera-upload" className="cursor-pointer p-8 rounded-lg border bg-card hover:bg-muted transition-colors flex flex-col items-center justify-center text-center">
                <Camera className="h-10 w-10 text-primary" />
                <span className="mt-2 font-medium">Take Photo</span>
              </Label>
              <Input ref={cameraInputRef} id="camera-upload" name="image" type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="sr-only" />
            </div>
            
            <SubmitButton />
          </div>
        </form>
        {state.error && (
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
