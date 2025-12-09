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
import { Gem, Leaf, Recycle, RefreshCw } from 'lucide-react';
import { type ClassificationResult } from '@/app/actions';
import { wasteCategories } from '@/lib/data';

type Props = {
  result: ClassificationResult;
  onTryAgain: () => void;
};

export default function ClassificationResultComponent({ result, onTryAgain }: Props) {
  const categoryInfo = wasteCategories[result.category];
  const Icon = categoryInfo?.Icon || Recycle;

  return (
    <Card className="mx-auto mt-8 max-w-2xl animate-in fade-in-0 zoom-in-95 duration-500 shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-headline">
          It's {categoryInfo ? categoryInfo.name : result.category}!
        </CardTitle>
        <CardDescription className="text-lg">
          You've earned <span className="font-bold text-accent">{result.points} points!</span>
        </CardDescription>
        <div className="flex justify-center items-center text-accent font-bold text-2xl pt-2">
            <Gem className="mr-2 h-6 w-6" />
            <span>{result.points}</span>
        </div>
      </CardHeader>
      <CardContent>
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
      <CardFooter>
        <Button onClick={onTryAgain} className="w-full" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Classify Another Item
        </Button>
      </CardFooter>
    </Card>
  );
}
