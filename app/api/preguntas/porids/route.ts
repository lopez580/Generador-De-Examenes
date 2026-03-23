import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { ids } = await request.json();
        const preguntas = await prisma.pregunta.findMany({
            where: { id: { in: ids } }
        });
        return NextResponse.json(preguntas);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener preguntas" }, { status: 500 });
    }
}