import WasteClassifier from '@/components/waste-classifier';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl font-headline">
          Sort Smart, Live Green
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 md:text-xl">
          Use the power of AI to classify your waste, learn how to dispose of it
          responsibly, and earn rewards for your eco-friendly habits.
        </p>
      </section>

      <WasteClassifier />
    </div>
  );
}
