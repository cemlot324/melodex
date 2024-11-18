'use server'

import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Your Prisma operations with userId
  const result = await prisma.song.create({
    data: {
      // ... other fields
      userId: userId,
    }
  });

  return NextResponse.json(result);
}