import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST - Guardar resultado de un examen
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { usuario_id, area, preguntas, respuestas_usuario, puntaje } = body;

        const examen = await prisma.examen.create({
            data: { usuario_id, area, preguntas, respuestas_usuario, puntaje }
        });

        return NextResponse.json(examen, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al guardar examen" }, { status: 500 });
    }
}