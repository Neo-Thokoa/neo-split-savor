"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Share2, Download, MessageCircle } from "lucide-react";
import { MemberSummary } from "./summary/member-summary";
import { SharedExpenses } from "./summary/shared-expenses";
import { SettlementList } from "./summary/settlement-list";
import { generateSettlements, generateSummaryText } from "@/lib/utils/settlements";
import type { Expense, Member } from "@/lib/storage";

interface ExpenseSummaryDialogProps {
  groupId: string;
  members: Member[];
  expenses: Expense[];
}

export function ExpenseSummaryDialog({ groupId, members, expenses }: ExpenseSummaryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate member summaries
  const memberSummaries = members.map(member => {
    const memberExpenses = expenses.filter(expense => 
      expense.participants.some(p => p.userId === member.id)
    );
    
    const totalSpent = memberExpenses.reduce((sum, expense) => {
      const participation = expense.participants.find(p => p.userId === member.id);
      return sum + (participation?.amount || 0);
    }, 0);

    const paidExpenses = expenses.filter(expense => expense.paidBy === member.name);
    const totalPaid = paidExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      member,
      totalSpent,
      totalPaid,
      balance: totalPaid - totalSpent,
    };
  });

  // Calculate shared expenses
  const sharedExpenses = expenses.filter(expense => expense.participants.length > 1);
  const settlements = generateSettlements(memberSummaries);

  const summaryText = generateSummaryText(
    memberSummaries,
    sharedExpenses,
    settlements
  );

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Expense Summary",
        text: summaryText,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(summaryText);
    }
  };

  const handleWhatsApp = () => {
    const encodedText = encodeURIComponent(summaryText);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
  };

  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expense-summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          View Night Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>End of Night Summary</DialogTitle>
          <DialogDescription>
            Review expenses and settle up with your group members.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Individual Summaries */}
            <div>
              <h3 className="font-semibold mb-3">Individual Summaries</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {memberSummaries.map(summary => (
                  <MemberSummary key={summary.member.id} {...summary} />
                ))}
              </div>
            </div>

            {/* Shared Expenses */}
            <div>
              <h3 className="font-semibold mb-3">Shared Expenses</h3>
              <SharedExpenses expenses={sharedExpenses} />
            </div>

            {/* Settlement Suggestions */}
            <div>
              <h3 className="font-semibold mb-3">Suggested Settlements</h3>
              <SettlementList settlements={settlements} />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleWhatsApp} className="w-full sm:w-auto">
            <MessageCircle className="mr-2 h-4 w-4" />
            Share via WhatsApp
          </Button>
          <Button variant="outline" onClick={handleShare} className="w-full sm:w-auto">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}