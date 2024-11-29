"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Expense {
  id: string;
  title: string;
  amount: number;
  description?: string;
  paidBy: string;
  date: string;
  groupName: string;
  groupId: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  const filteredExpenses = expenses
    .filter(expense => 
      expense.title.toLowerCase().includes(search.toLowerCase()) ||
      expense.groupName.toLowerCase().includes(search.toLowerCase()) ||
      expense.paidBy.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={(value: "date" | "amount") => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="amount">Sort by Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Paid By</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <Link 
                    href={`/groups/${expense.groupId}`}
                    className="font-medium hover:underline"
                  >
                    {expense.title}
                  </Link>
                  {expense.description && (
                    <p className="text-sm text-muted-foreground">
                      {expense.description}
                    </p>
                  )}
                </TableCell>
                <TableCell>{expense.groupName}</TableCell>
                <TableCell>{expense.paidBy}</TableCell>
                <TableCell>R{expense.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(expense.date), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
            {filteredExpenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No expenses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}