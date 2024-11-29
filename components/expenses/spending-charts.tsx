"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart } from "lucide-react";
import type { Expense } from "@/lib/storage";

interface SpendingChartsProps {
  expenses: Array<Expense & { groupName: string }>;
}

export function SpendingCharts({ expenses }: SpendingChartsProps) {
  // Calculate spending by category (using groups as categories)
  const spendingByGroup = expenses.reduce((acc, expense) => {
    acc[expense.groupName] = (acc[expense.groupName] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate spending by payer
  const spendingByPayer = expenses.reduce((acc, expense) => {
    acc[expense.paidBy] = (acc[expense.paidBy] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate spending over time (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const spendingByDay = last7Days.reduce((acc, date) => {
    acc[date] = expenses
      .filter(e => e.date.startsWith(date))
      .reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  // Calculate percentages for pie charts
  const totalSpending = Object.values(spendingByGroup).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-6">
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="distribution" className="space-x-2">
            <PieChart className="h-4 w-4" />
            <span>Spending Distribution</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="space-x-2">
            <BarChart className="h-4 w-4" />
            <span>Spending Timeline</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium">Spending by Group</h3>
              <div className="relative aspect-square">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {Object.entries(spendingByGroup).map(([group, amount], index) => {
                      const percentage = (amount / totalSpending) * 100;
                      const offset = Object.entries(spendingByGroup)
                        .slice(0, index)
                        .reduce((sum, [_, value]) => sum + (value / totalSpending) * 100, 0);
                      
                      return (
                        <circle
                          key={group}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                          strokeWidth="20"
                          strokeDasharray={`${percentage} 100`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-300"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(spendingByGroup).map(([group, amount], index) => (
                  <div key={group} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                      />
                      <span className="text-sm">{group}</span>
                    </div>
                    <span className="text-sm font-medium">
                      R{amount.toFixed(2)} ({((amount / totalSpending) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-medium">Spending by Payer</h3>
              <div className="relative aspect-square">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {Object.entries(spendingByPayer).map(([payer, amount], index) => {
                      const percentage = (amount / totalSpending) * 100;
                      const offset = Object.entries(spendingByPayer)
                        .slice(0, index)
                        .reduce((sum, [_, value]) => sum + (value / totalSpending) * 100, 0);
                      
                      return (
                        <circle
                          key={payer}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                          strokeWidth="20"
                          strokeDasharray={`${percentage} 100`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-300"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(spendingByPayer).map(([payer, amount], index) => (
                  <div key={payer} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                      />
                      <span className="text-sm">{payer}</span>
                    </div>
                    <span className="text-sm font-medium">
                      R{amount.toFixed(2)} ({((amount / totalSpending) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div>
            <h3 className="mb-4 text-sm font-medium">Daily Spending (Last 7 Days)</h3>
            <div className="h-[300px] flex items-end justify-between gap-2">
              {Object.entries(spendingByDay).map(([date, amount]) => {
                const maxAmount = Math.max(...Object.values(spendingByDay));
                const height = maxAmount ? (amount / maxAmount) * 100 : 0;
                
                return (
                  <div
                    key={date}
                    className="flex-1 flex flex-col items-center justify-end"
                  >
                    <div
                      className="w-full bg-primary/20 rounded-t transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                    <div className="mt-2 text-xs text-muted-foreground rotate-45 origin-left">
                      {new Date(date).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="mt-1 text-xs font-medium">
                      R{amount.toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}