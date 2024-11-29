"use client";

import { Card } from "@/components/ui/card";

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface SettlementListProps {
  settlements: Settlement[];
}

export function SettlementList({ settlements }: SettlementListProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2 text-sm">
        {settlements.map((settlement, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>
              {settlement.from} → {settlement.to}
            </span>
            <span className="font-medium">R{settlement.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}