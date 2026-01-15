import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Gem, Leaf, Recycle, RefreshCw, Percent } from 'lucide-react';
import { type ClassificationResult } from '@/app/actions';
import { wasteCategories } from '@/lib/data';
import Image from 'next/image';

type Props = {
  result: ClassificationResult;
  onTryAgain: () => void;
  imagePreview: string | null;
};

export default function ClassificationResultComponent({ result, onTryAgain, imagePreview }: Props) {
  const categoryInfo = wasteCategories[result.category];
  const Icon = categoryInfo?.Icon || Recycle;

  return (
    <Card className="mx-auto mt-8 max-w-2xl animate-in fade-in-0 zoom-in-95 duration-500 shadow-lg">
       <CardHeader className="text-center pb-0">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-headline">
          It's {categoryInfo ? categoryInfo.name : result.category}!
        </CardTitle>
        <CardDescription className="text-lg">
          Here is your classification result.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {result.isImage && imagePreview && (
          <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-md border">
            <Image src={imagePreview} alt="Uploaded item" fill className="object-cover" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                <p className="flex items-center justify-center text-2xl font-bold text-primary">
                    <Percent className="mr-1 h-5 w-5"/>
                    {result.confidence.toFixed(1)}
                </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium text-muted-foreground">Points Earned</p>
                <p className="flex items-center justify-center text-2xl font-bold text-accent">
                    <Gem className="mr-1 h-5 w-5"/>
                    {result.points}
                </p>
            </div>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="item-2">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Leaf className="mr-2 h-4 w-4" /> Environmental Impact
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {result.summary}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Recycle className="mr-2 h-4 w-4" /> Disposal Instructions
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {result.disposalTips}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Save to History</Button>
        <Button onClick={onTryAgain} className="w-full" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Classify Another Item
        </Button>
      </CardFooter>
    </Card>
  );
}
