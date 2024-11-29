"use client";

import { Card } from "@/components/ui/card";
import type { Expense } from "@/lib/storage";

interface SharedExpensesProps {
  expenses: Expense[];
}

export function SharedExpenses({ expenses }: SharedExpensesProps) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Card className="p-4">
      <div className="space-y-2">
        {expenses.map(expense => (
          <div key={expense.id} className="flex justify-between text-sm">
            <span>{expense.title}</span>
            <span>R{expense.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="pt-2 border-t flex justify-between font-medium">
          <span>Total Shared:</span>
          <span>R{total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}