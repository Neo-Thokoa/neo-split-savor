import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import * as z from "zod";

const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().optional(),
  paidBy: z.string(),
  splitType: z.enum(["EQUAL", "PERCENTAGE", "EXACT"]),
  participants: z.array(z.object({
    userId: z.string(),
    amount: z.number(),
    isPaid: z.boolean().optional(),
  })),
});

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  const group = storage.getGroup(params.groupId);
  if (!group) {
    return new NextResponse("Group not found", { status: 404 });
  }
  return NextResponse.json(group.expenses);
}

export async function POST(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const json = await req.json();
    const body = expenseSchema.parse(json);

    const success = storage.addExpense(params.groupId, {
      ...body,
      date: new Date().toISOString(),
    });

    if (!success) {
      return new NextResponse("Group not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}