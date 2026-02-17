import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateEnv } from "@/lib/env";

validateEnv();
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, startTime, endTime } = await req.json();

  if (!clientId || !startTime) {
    return Response.json(
      { error: "Missing required fields: clientId, startTime" },
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
        endTime: endTime ? new Date(endTime) : null,
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

export async function GET(){
  const session = await getServerSession(authOptions);

  if(!session || !session.user?.email){
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const user = await prisma.user.upsert({
      where: {email: session.user.email},
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || "",
      }
    })

    const inProgressEntries = await prisma.timeEntry.findMany({
      where: {
        userId: user.id,
        endTime: null,
      },
      include: {
        client: true,
      }
    });
      return Response.json({ inProgressEntries });
    } catch(error) {
      console.error("Error fetching in-progress time entries:", error);
      return Response.json(
        {error: "Internal server error"},
        {status: 500}
      )
  }
}