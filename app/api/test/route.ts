import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateEnv } from "@/lib/env";

validateEnv();
export async function GET() {
  try {
    // Try to query the database
    const userCount = await prisma.user.count();
    const clientCount = await prisma.client.count();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        users: userCount,
        clients: clientCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
