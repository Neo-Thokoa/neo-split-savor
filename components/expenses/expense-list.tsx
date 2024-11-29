"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Receipt, User, DollarSign, AlertCircle, Trash2, Users, LayoutList, UserSquare2 } from "lucide-react";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { MemberExpenses } from "./member-expenses";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Participant {
  userId: string;
  amount: number;
  isPaid: boolean;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  description?: string;
  paidBy: string;
  splitType: string;
  participants: Participant[];
  date: string;
}

interface Member {
  id: string;
  name: string;
  budget: number;
}

interface ExpenseListProps {
  groupId: string;
  members: Member[];
}

type ViewMode = "list" | "members";

export function ExpenseList({ groupId, members }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { toast } = useToast();

  const loadExpenses = () => {
    const group = storage.getGroup(groupId);
    if (group) {
      setExpenses(group.expenses);
      setError(null);
    } else {
      setError("Failed to load group expenses");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, [groupId]);

  const handleDeleteExpense = (expenseId: string) => {
    const success = storage.deleteExpense(groupId, expenseId);
    if (success) {
      toast({
        title: "Expense deleted",
        description: "The expense has been deleted successfully.",
      });
      loadExpenses();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the expense.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const memberExpenses = expenses.flatMap(expense => 
            expense.participants
              .filter(p => p.userId === member.id)
              .map(p => ({ ...expense, memberShare: p.amount }))
          );
          const totalSpent = memberExpenses.reduce((sum, exp) => sum + exp.memberShare, 0);
          
          return (
            <Card key={member.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">{member.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Budget</div>
                  <div className="font-medium">R{member.budget.toFixed(2)}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent:</span>
                  <span>R{totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className={totalSpent > member.budget ? "text-destructive" : ""}>
                    R{(member.budget - totalSpent).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Recent Expenses</h3>
          <ToggleGroup type="single" value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <ToggleGroupItem value="list" aria-label="List view">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="members" aria-label="Members view">
              <UserSquare2 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {expenses.length === 0 ? (
          <Card className="p-8 text-center">
            <Receipt className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No expenses recorded yet.</p>
          </Card>
        ) : viewMode === "list" ? (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                members={members}
                onDelete={() => handleDeleteExpense(expense.id)}
              />
            ))}
          </div>
        ) : (
          <MemberExpenses members={members} expenses={expenses} />
        )}
      </div>
    </div>
  );
}

interface ExpenseCardProps {
  expense: Expense;
  members: Member[];
  onDelete: () => void;
}

function ExpenseCard({ expense, members, onDelete }: ExpenseCardProps) {
  const isIndividual = expense.participants.length === 1;

  return (
    <Card key={expense.id} className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">{expense.title}</h3>
            {isIndividual && (
              <Badge variant="secondary" className="ml-2">Individual</Badge>
            )}
          </div>
          {expense.description && (
            <p className="text-sm text-muted-foreground">
              {expense.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="font-medium">R{expense.amount.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(expense.date), {
                addSuffix: true,
              })}
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this expense? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <User className="mr-1 h-4 w-4" />
          <span>Paid by {expense.paidBy}</span>
        </div>
        <div className="flex items-center">
          {isIndividual ? (
            <User className="mr-1 h-4 w-4" />
          ) : (
            <Users className="mr-1 h-4 w-4" />
          )}
          <span>
            {isIndividual 
              ? "Individual expense" 
              : `R${(expense.amount / members.length).toFixed(2)} per person`}
          </span>
        </div>
      </div>
    </Card>
  );
}