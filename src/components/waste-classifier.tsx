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
import { Camera, UploadCloud, Loader2, AlertCircle, Sparkles, X, VideoOff } from 'lucide-react';
import ClassificationResult from './classification-result';
import { useToast } from '@/hooks/use-toast';

const initialState: FormState = {};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-4" disabled={pending || disabled}>
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
  const [imageDataUri, setImageDataUri] = useState<string>(''); // For form submission
  const [showResult, setShowResult] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resultKey = useMemo(() => state.timestamp, [state.timestamp]);

  // Effect to handle showing results
  useEffect(() => {
    if (state.result && state.timestamp) {
      setShowResult(true);
    } else if (state.error) {
      setShowResult(false);
    }
  }, [state]);

  // Effect to handle camera stream
  useEffect(() => {
    async function getCameraStream() {
      if (showCamera) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
          setShowCamera(false);
        }
      } else {
        // Cleanup stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if(videoRef.current) {
            videoRef.current.srcObject = null;
        }
      }
    }
    getCameraStream();
    
    // Cleanup function
    return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
    }
  }, [showCamera, toast]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImageDataUri('');
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
      }
      setShowCamera(false); // Hide camera view after capture
    }
  };


  const resetImageSelection = () => {
    setImagePreview(null);
    setImageDataUri('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  const handleTryAgain = () => {
    setShowResult(false);
    resetImageSelection();
    if(formRef.current) {
        formRef.current.reset();
    }
  };

  if (showResult && state.result) {
    return <ClassificationResult key={resultKey} result={state.result} onTryAgain={handleTryAgain} imagePreview={imagePreview} />;
  }

  if (showCamera) {
    return (
        <Card className="mx-auto mt-8 max-w-2xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-500">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Live Camera</CardTitle>
                <CardDescription>Position the item in the frame and capture.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-black">
                   <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline></video>
                   {hasCameraPermission === false && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
                            <VideoOff className="h-12 w-12 text-destructive mb-4" />
                            <h3 className="text-lg font-semibold">Camera Access Denied</h3>
                            <p className="text-sm text-center text-muted-foreground">Please grant camera permission in your browser to use this feature.</p>
                       </div>
                   )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <Button onClick={handleCapture} disabled={hasCameraPermission !== true}>
                        <Camera className="mr-2 h-4 w-4" />
                        Capture
                    </Button>
                    <Button variant="outline" onClick={() => setShowCamera(false)}>
                         <X className="mr-2 h-4 w-4" />
                         Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="mx-auto mt-8 max-w-2xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">What are you throwing away?</CardTitle>
        <CardDescription>Upload a photo or use your camera to classify an item.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="submissionType" value={imageDataUri ? 'image' : ''} />
          <input type="hidden" name="imageDataUri" value={imageDataUri} />
          
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={resetImageSelection}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Label htmlFor="image-upload" className="cursor-pointer p-8 rounded-lg border bg-card hover:bg-muted transition-colors flex flex-col items-center justify-center text-center">
                   <UploadCloud className="h-10 w-10 text-primary" />
                   <span className="mt-2 font-medium">Upload Image</span>
                 </Label>
                 <Input ref={imageInputRef} id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
   
                 <Button type="button" onClick={() => setShowCamera(true)} className="p-8 h-auto rounded-lg border bg-card hover:bg-muted transition-colors flex flex-col items-center justify-center text-center text-card-foreground font-normal">
                   <Camera className="h-10 w-10 text-primary" />
                   <span className="mt-2 font-medium">Take Photo</span>
                 </Button>
               </div>
            )}
            
            <SubmitButton disabled={!imagePreview} />
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
