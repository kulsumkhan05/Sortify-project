'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { wasteCategories } from "@/lib/data";

const totalWasteClassified = 125;
const averageConfidence = 94.2;
const categoryData = [
    { name: 'Plastic', count: 45 },
    { name: 'Paper', count: 30 },
    { name: 'Metal', count: 15 },
    { name: 'Glass', count: 20 },
    { name: 'Biodegradable', count: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <section className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl font-headline">
                    Dashboard
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 md:text-xl">
                    Analytics and insights into your waste classification activities.
                </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Classified</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalWasteClassified}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Avg. Confidence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{averageConfidence.toFixed(1)}%</p>
                    </CardContent>
                </Card>
                {Object.values(wasteCategories).map(cat => {
                    const data = categoryData.find(d => d.name === cat.name || (cat.id === 'biodegradable' && d.name === 'Biodegradable'));
                    return (
                         <Card key={cat.id}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">{cat.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{data?.count || 0}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                        <CardDescription>Count of items per waste category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Waste Proportions</CardTitle>
                        <CardDescription>Percentage share of each category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                             <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
