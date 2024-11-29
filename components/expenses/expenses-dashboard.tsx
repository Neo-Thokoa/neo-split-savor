"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ExpensesSummary } from "./expenses-summary";
import { ExpensesTable } from "./expenses-table";
import { SpendingCharts } from "./spending-charts";
import { storage } from "@/lib/storage";
import type { Group } from "@/lib/storage";

export function ExpensesDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const loadedGroups = storage.getGroups();
    setGroups(loadedGroups);
  }, []);

  const allExpenses = groups.flatMap(group => 
    group.expenses.map(expense => ({
      ...expense,
      groupName: group.name,
      groupId: group.id
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSpent = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = groups.reduce((sum, group) => 
    sum + group.members.reduce((memberSum, member) => memberSum + member.budget, 0), 
    0
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Expenses"
        text="View and manage all your expenses across groups."
      />
      <div className="grid gap-8">
        <ExpensesSummary 
          totalSpent={totalSpent}
          totalBudget={totalBudget}
          expenseCount={allExpenses.length}
          groupCount={groups.length}
        />
        <SpendingCharts expenses={allExpenses} />
        <ExpensesTable expenses={allExpenses} />
      </div>
    </DashboardShell>
  );
}