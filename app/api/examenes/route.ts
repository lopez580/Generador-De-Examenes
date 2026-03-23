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

//DELETE
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Id requerido" }, { status: 400 });

        await prisma.examen.delete({ where: { id } });
        return NextResponse.json({ message: "Examen eliminado" });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
    }
}