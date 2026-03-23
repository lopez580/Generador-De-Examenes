import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const area = searchParams.get("area");
        const preguntas = await prisma.pregunta.findMany({
            where: area ? { area } : {}
        });
        return NextResponse.json(preguntas);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener preguntas" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { texto, opciones, respuesta_correcta, area } = body;
        const pregunta = await prisma.pregunta.create({
            data: { texto, opciones, respuesta_correcta, area, origen: "manual" }
        });
        return NextResponse.json(pregunta, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear pregunta" }, { status: 500 });
    }
}