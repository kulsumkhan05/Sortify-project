import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, Award, Target } from "lucide-react";

// Mock user data
const userData = {
  name: "Eco Warrior",
  email: "eco.warrior@example.com",
  avatarUrl: "https://picsum.photos/seed/user-avatar/200/200",
  points: 150,
  classifiedItems: 5,
  averageConfidence: 96.58,
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="mb-8 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary">
          <AvatarImage src={userData.avatarUrl} alt={userData.name} />
          <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
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
                <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Items Classified</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{userData.classifiedItems}</div>
                <p className="text-xs text-muted-foreground">Making a difference</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{userData.averageConfidence.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Great accuracy!</p>
            </CardContent>
        </Card>
      </div>

       <Card className="mt-6">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Account settings will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
