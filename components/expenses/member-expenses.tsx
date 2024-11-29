"use client";

import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Receipt, User, DollarSign, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Expense } from "@/lib/storage";

interface Member {
  id: string;
  name: string;
  budget: number;
}

interface MemberExpensesProps {
  members: Member[];
  expenses: Expense[];
}

export function MemberExpenses({ members, expenses }: MemberExpensesProps) {
  // Group expenses by member
  const memberExpenses = members.map(member => {
    const memberExpenseList = expenses.filter(expense => 
      expense.participants.some(p => p.userId === member.id)
    );
    
    const totalSpent = memberExpenseList.reduce((sum, expense) => {
      const participation = expense.participants.find(p => p.userId === member.id);
      return sum + (participation?.amount || 0);
    }, 0);

    const paidExpenses = expenses.filter(expense => expense.paidBy === member.name);
    const totalPaid = paidExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      member,
      expenses: memberExpenseList,
      totalSpent,
      totalPaid,
      balance: totalPaid - totalSpent,
    };
  });

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {memberExpenses.map(({ member, expenses, totalSpent, totalPaid, balance }) => (
        <AccordionItem key={member.id} value={member.id} className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{member.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Spent: </span>
                  <span>R{totalSpent.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Paid: </span>
                  <span>R{totalPaid.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Balance: </span>
                  <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>
                    R{Math.abs(balance).toFixed(2)} {balance >= 0 ? "to receive" : "to pay"}
                  </span>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 py-2 space-y-4">
              {expenses.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No expenses recorded
                </p>
              ) : (
                expenses.map((expense) => {
                  const participation = expense.participants.find(p => p.userId === member.id);
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
                        <div className="text-right">
                          <div className="font-medium">
                            {expense.paidBy === member.name ? (
                              <span className="text-green-600">+R{expense.amount.toFixed(2)}</span>
                            ) : (
                              <span className="text-red-600">-R{participation?.amount.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(expense.date), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}