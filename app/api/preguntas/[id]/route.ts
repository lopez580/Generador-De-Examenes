import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.pregunta.delete({ where: { id } });
        return NextResponse.json({ message: "Pregunta eliminada" });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar pregunta" }, { status: 500 });
    }
}