import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, startTime, endTime } = await req.json();

  if (!clientId || !startTime || !endTime) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Ensure user exists
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || "",
      },
    });

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id },
    });

    if (!client) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    // Create time entry
    const timeEntry = await prisma.timeEntry.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        clientId,
        userId: user.id,
      },
    });

    return Response.json({ timeEntry });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
