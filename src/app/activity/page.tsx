import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { wasteCategories } from "@/lib/data";
import { format } from 'date-fns';

// Mock data for recent activity
const activityLog = [
  { id: 1, item: "Plastic Bottle", category: "plastic", confidence: 98.2, date: new Date() },
  { id: 2, item: "Newspaper", category: "paper", confidence: 95.5, date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 3, item: "Aluminum Can", category: "metal", confidence: 99.1, date: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 4, item: "Glass Jar", category: "glass", confidence: 97.8, date: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: 5, item: "Cardboard Box", category: "cardboard", confidence: 94.0, date: new Date(Date.now() - 1000 * 60 * 60 * 72) },
  { id: 6, item: "Used Napkin", category: "trash", confidence: 91.2, date: new Date(Date.now() - 1000 * 60 * 60 * 96) },
];

export default function ActivityPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl font-headline">
          Activity History
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 md:text-xl">
          Review your recent waste classification history.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Classifications</CardTitle>
          <CardDescription>A log of items you've recently classified.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLog.map((activity) => {
                const categoryInfo = wasteCategories[activity.category];
                return (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.item}</TableCell>
                    <TableCell>
                      {categoryInfo && (
                        <Badge variant="outline" className="flex w-fit items-center gap-2">
                           <categoryInfo.Icon className="h-4 w-4" />
                           {categoryInfo.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{activity.confidence.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{format(activity.date, "PPP p")}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
