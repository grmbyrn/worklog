import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function GET(){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const userEmail = session.user?.email;

    if(!userEmail){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const user = await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
            email: userEmail,
            name: session.user?.name ?? null,
        },
    });

    if(!user){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const clients = await prisma.client.findMany({
        where: {
            userId: user.id
        }
    });

    return NextResponse.json({clients});
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user?.email;

    if (!userEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
            email: userEmail,
            name: session.user?.name ?? null,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, hourlyRate } = await request.json();

    if(!name || !email || !hourlyRate){
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newClient = await prisma.client.create({
        data: {
            name,
            email,
            hourlyRate: Number(hourlyRate),
            userId: user.id,
        },
    });

    return NextResponse.json({ client: newClient }, { status: 201 });
}