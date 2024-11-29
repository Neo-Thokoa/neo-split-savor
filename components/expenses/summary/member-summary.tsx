"use client";

import { Card } from "@/components/ui/card";
import type { Member } from "@/lib/storage";

interface MemberSummaryProps {
  member: Member;
  totalSpent: number;
  totalPaid: number;
  balance: number;
}

export function MemberSummary({ member, totalSpent, totalPaid, balance }: MemberSummaryProps) {
  return (
    <Card className="p-4">
      <h4 className="font-medium">{member.name}</h4>
      <div className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Spent:</span>
          <span>R{totalSpent.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Paid:</span>
          <span>R{totalPaid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Balance:</span>
          <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>
            R{Math.abs(balance).toFixed(2)} {balance >= 0 ? "to receive" : "to pay"}
          </span>
        </div>
      </div>
    </Card>
  );
}