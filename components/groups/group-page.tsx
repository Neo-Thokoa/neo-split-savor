"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { ExpenseList } from "@/components/expenses/expense-list";
import { ExpenseSummaryDialog } from "@/components/expenses/expense-summary-dialog";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Plus } from "lucide-react";
import { storage } from "@/lib/storage";

interface GroupPageProps {
  groupId: string;
}

export function GroupPage({ groupId }: GroupPageProps) {
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [group, setGroup] = useState<any>(null);

  useEffect(() => {
    const groupData = storage.getGroup(groupId);
    if (groupData) {
      setGroup(groupData);
    }
  }, [groupId]);

  const handleExpenseAdded = () => {
    const updatedGroup = storage.getGroup(groupId);
    if (updatedGroup) {
      setGroup(updatedGroup);
    }
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={group.name}
        text="Track and manage group expenses."
      >
        <div className="flex gap-2">
          <ExpenseSummaryDialog 
            groupId={group.id}
            members={group.members}
            expenses={group.expenses}
          />
          <Button onClick={() => setShowExpenseDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-8">
        <ExpenseList 
          groupId={group.id} 
          members={group.members}
        />
      </div>

      <ExpenseDialog
        open={showExpenseDialog}
        onOpenChange={setShowExpenseDialog}
        groupId={group.id}
        members={group.members}
        onExpenseAdded={handleExpenseAdded}
      />
    </DashboardShell>
  );
}