import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Listar preguntas (filtrable por área)
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

// POST - Crear pregunta manual
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


//PUT- actualizar pregunta 
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const pregunta = await prisma.pregunta.update({
            where: { id },
            data: body
        });

        return NextResponse.json(pregunta);
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar pregunta" }, { status: 500 });
    }
}

// DELETE - Eliminar pregunta
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await prisma.pregunta.delete({ where: { id } });

        return NextResponse.json({ message: "Pregunta eliminada" });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar pregunta" }, { status: 500 });
    }
}
