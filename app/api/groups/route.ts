import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import * as z from "zod";

const groupSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

export async function GET() {
  const groups = storage.getGroups();
  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = groupSchema.parse(json);
    
    const group = storage.createGroup({
      name: body.name,
      description: body.description,
      members: storage.getGroups()[0].members, // Use default members for now
    });

    return NextResponse.json(group);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}