import type { Member } from "@/lib/storage";

interface MemberSummary {
  member: Member;
  balance: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export function generateSettlements(memberSummaries: MemberSummary[]): Settlement[] {
  const settlements: Settlement[] = [];
  const debtors = memberSummaries.filter(m => m.balance < 0)
    .sort((a, b) => a.balance - b.balance);
  const creditors = memberSummaries.filter(m => m.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debt = Math.abs(debtors[i].balance);
    const credit = creditors[j].balance;
    const amount = Math.min(debt, credit);

    if (amount > 0) {
      settlements.push({
        from: debtors[i].member.name,
        to: creditors[j].member.name,
        amount,
      });
    }

    if (debt === credit) {
      i++;
      j++;
    } else if (debt < credit) {
      creditors[j].balance -= debt;
      i++;
    } else {
      debtors[i].balance += credit;
      j++;
    }
  }

  return settlements;
}

export function generateSummaryText(
  memberSummaries: Array<{ member: Member; totalSpent: number; totalPaid: number; balance: number }>,
  sharedExpenses: Array<{ title: string; amount: number }>,
  settlements: Settlement[]
): string {
  let text = "📊 Expense Summary\n\n";

  // Individual Summaries
  text += "👥 Individual Summaries:\n";
  memberSummaries.forEach(({ member, totalSpent, totalPaid, balance }) => {
    text += `\n${member.name}:\n`;
    text += `- Total Spent: R${totalSpent.toFixed(2)}\n`;
    text += `- Total Paid: R${totalPaid.toFixed(2)}\n`;
    text += `- Balance: R${Math.abs(balance).toFixed(2)} ${balance >= 0 ? "to receive" : "to pay"}\n`;
  });

  // Shared Expenses
  text += "\n💰 Shared Expenses:\n";
  sharedExpenses.forEach(expense => {
    text += `- ${expense.title}: R${expense.amount.toFixed(2)}\n`;
  });
  text += `\nTotal Shared: R${sharedExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}\n`;

  // Settlement Suggestions
  text += "\n💸 Suggested Settlements:\n";
  settlements.forEach(settlement => {
    text += `- ${settlement.from} pays ${settlement.to}: R${settlement.amount.toFixed(2)}\n`;
  });

  return text;
}