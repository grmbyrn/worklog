import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateEnv } from "@/lib/env";

validateEnv();
export async function PUT(
    req: Request,
    {params}: {params: Promise<{id: string}>}
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return Response.json({error: "Unauthorized"}, {status: 401});
    }

    const {id} = await params;

    const {endTime} = await req.json();

    if (!endTime) {
        return Response.json(
            {error: "Missing required field: endTime"},
            {status: 400}
        );
    }

    try {
        const user = await prisma.user.upsert({
            where: {email: session.user.email},
            update: {},
            create: {
                email: session.user.email,
                name: session.user.name || "",
            },
        })

        const updatedEntry = await prisma.timeEntry.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                endTime: new Date(endTime),
            },
        })
        return Response.json({timeEntry: updatedEntry});
    } catch(error) {
        console.error("Error updating time entry:", error);
        return Response.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}