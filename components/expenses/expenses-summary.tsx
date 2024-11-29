import { Card } from "@/components/ui/card";
import { Receipt, PiggyBank, Users, CreditCard } from "lucide-react";

interface ExpensesSummaryProps {
  totalSpent: number;
  totalBudget: number;
  expenseCount: number;
  groupCount: number;
}

export function ExpensesSummary({
  totalSpent,
  totalBudget,
  expenseCount,
  groupCount,
}: ExpensesSummaryProps) {
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <PiggyBank className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">Total Budget</p>
              <p className="text-2xl font-bold">R{totalBudget.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Receipt className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">Total Spent</p>
              <p className="text-2xl font-bold">R{totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 bg-muted rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all" 
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {budgetPercentage.toFixed(1)}% of budget used
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">Expenses</p>
              <p className="text-2xl font-bold">{expenseCount}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Users className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">Active Groups</p>
              <p className="text-2xl font-bold">{groupCount}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}