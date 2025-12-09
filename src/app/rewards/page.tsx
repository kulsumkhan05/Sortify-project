import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem, Gift } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const userPoints = 150; // This would come from a database

const rewards = [
  {
    title: "Free Coffee",
    description: "Get a free coffee at your local eco-friendly cafe.",
    points: 100,
    image: PlaceHolderImages.find(p => p.id === 'reward-coffee')
  },
  {
    title: "Potted Plant",
    description: "A small succulent to brighten up your space.",
    points: 250,
    image: PlaceHolderImages.find(p => p.id === 'reward-plant')
  },
  {
    title: "Reusable Tote Bag",
    description: "A stylish and sturdy tote bag for your groceries.",
    points: 400,
    image: PlaceHolderImages.find(p => p.id === 'reward-tote')
  },
];

export default function RewardsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl font-headline">
          Your Rewards
        </h1>
        <p className="mt-4 flex items-center justify-center gap-2 text-2xl font-semibold text-accent">
          <Gem className="h-7 w-7" />
          You have {userPoints} points
        </p>
      </section>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <Card key={reward.title} className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
            <div className="relative aspect-[4/3]">
              {reward.image && (
                <Image
                  src={reward.image.imageUrl}
                  alt={reward.image.description}
                  fill
                  className="object-cover"
                  data-ai-hint={reward.image.imageHint}
                />
              )}
            </div>
            <CardHeader>
              <CardTitle>{reward.title}</CardTitle>
              <CardDescription>{reward.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="flex items-center font-semibold text-accent">
                <Gem className="mr-2 h-4 w-4" /> {reward.points} Points
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={userPoints < reward.points}>
                <Gift className="mr-2 h-4 w-4" />
                {userPoints >= reward.points ? "Redeem" : "Not enough points"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
