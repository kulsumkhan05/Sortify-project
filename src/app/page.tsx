import WasteClassifier from '@/components/waste-classifier';
import { Button } from '@/components/ui/button';
import { wasteCategoryList } from '@/lib/data';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl font-headline">
          SORTIFY – Where Smartness Turns Trash into Treasure
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 md:text-xl">
          Use the power of AI to classify your waste, learn how to dispose of it
          responsibly, and earn rewards for your eco-friendly habits.
        </p>
      </section>

      <WasteClassifier />

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-primary font-headline">
          Supported Waste Categories
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-foreground/80">
          Our AI can classify waste into the following categories.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {wasteCategoryList.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-card-foreground"
            >
              <category.Icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{category.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-8">
            <Button asChild>
                <Link href="#">Classify Waste</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
