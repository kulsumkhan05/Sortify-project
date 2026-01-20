'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem, Award, Target, LogOut } from "lucide-react";

export default function ProfilePage({ searchParams }: { searchParams: { name?: string, email?: string } }) {
  const router = useRouter();

  const email = searchParams?.email || "user@example.com";
  
  const getDisplayNameFromEmail = (email: string) => {
    if (!email || !email.includes('@')) {
        return "User";
    }
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  }

  const name = searchParams?.name || getDisplayNameFromEmail(email);

  // Mock user data for a new user
  const userData = {
    name: name,
    email: email,
    avatarUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '-')}/200/200`,
    points: 0,
    classifiedItems: 0,
    averageConfidence: 0,
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="mb-8 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary">
          <AvatarImage src={userData.avatarUrl} alt={userData.name} />
          <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary md:text-5xl font-headline">
                {userData.name}
            </h1>
            <p className="text-lg text-foreground/80 md:text-xl">
                {userData.email}
            </p>
        </div>
      </section>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Gem className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-accent">{userData.points}</div>
                <p className="text-xs text-muted-foreground">Start classifying to earn points!</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Items Classified</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{userData.classifiedItems}</div>
                <p className="text-xs text-muted-foreground">No items classified yet</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{userData.averageConfidence.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">N/A</p>
            </CardContent>
        </Card>
      </div>

       <Card className="mt-6">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
