'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const totalWasteClassified = 125;
const categoryData = [
    { name: 'Paper', count: 30 },
    { name: 'Plastic', count: 45 },
    { name: 'Metal', count: 15 },
    { name: 'Glass', count: 20 },
    { name: 'Cardboard', count: 10 },
    { name: 'Trash', count: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6384'];

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <section className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-primary">
                    Dashboard
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 md:text-xl">
                    Analytics and insights into your waste classification activities.
                </p>
            </section>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Classified</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold">{totalWasteClassified}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Items This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold">32</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
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
