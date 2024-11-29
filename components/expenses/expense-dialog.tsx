"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";

const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  description: z.string().optional(),
  paidBy: z.string().min(1, "Payer is required"),
  splitType: z.enum(["EQUAL", "PERCENTAGE", "EXACT"]),
  isIndividual: z.boolean().default(false),
});

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: Array<{ id: string; name: string; budget: number }>;
  onExpenseAdded?: () => void;
}

export function ExpenseDialog({ 
  open, 
  onOpenChange, 
  groupId, 
  members,
  onExpenseAdded 
}: ExpenseDialogProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      splitType: "EQUAL",
      isIndividual: false,
    },
  });

  const amount = watch("amount");
  const isIndividual = watch("isIndividual");
  const paidBy = watch("paidBy");
  const splitAmount = amount && !isIndividual ? Number(amount) / members.length : Number(amount);

  async function onSubmit(data: z.infer<typeof expenseSchema>) {
    try {
      const numericAmount = Number(data.amount);
      
      // For individual expenses, only check the payer's budget
      if (data.isIndividual) {
        const payer = members.find(member => member.name === data.paidBy);
        if (payer && payer.budget < numericAmount) {
          toast({
            title: "Warning",
            description: `${payer.name} doesn't have enough budget for this expense`,
            variant: "destructive",
          });
          return;
        }
      } else {
        // Check if any member exceeds their budget for split expenses
        const splitAmount = numericAmount / members.length;
        const memberOverBudget = members.find(member => member.budget < splitAmount);
        
        if (memberOverBudget) {
          toast({
            title: "Warning",
            description: `${memberOverBudget.name} doesn't have enough budget for this expense`,
            variant: "destructive",
          });
          return;
        }
      }

      const success = storage.addExpense(groupId, {
        title: data.title,
        amount: numericAmount,
        description: data.description,
        paidBy: data.paidBy,
        date: new Date().toISOString(),
        splitType: data.splitType,
        participants: data.isIndividual 
          ? [{ 
              userId: members.find(m => m.name === data.paidBy)!.id,
              amount: numericAmount,
              isPaid: true
            }]
          : members.map((member) => ({
              userId: member.id,
              amount: splitAmount,
              isPaid: member.name === data.paidBy,
            })),
      });

      if (!success) {
        throw new Error("Failed to add expense");
      }

      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      
      reset();
      onOpenChange(false);
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to track spending.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Dinner, Drinks, etc."
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (R)</Label>
              <Input
                id="amount"
                {...register("amount")}
                placeholder="0.00"
                type="number"
                step="0.01"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
              {!isIndividual && splitAmount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Split amount: R{splitAmount.toFixed(2)} per person
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select onValueChange={(value) => setValue("paidBy", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name} (R{member.budget.toFixed(2)} remaining)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paidBy && (
                <p className="text-sm text-destructive">{errors.paidBy.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isIndividual"
                checked={isIndividual}
                onCheckedChange={(checked) => setValue("isIndividual", checked)}
              />
              <Label htmlFor="isIndividual">Individual expense (not split with group)</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Add details about the expense"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}