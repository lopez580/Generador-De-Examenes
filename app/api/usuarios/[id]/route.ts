import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT - Actualizar usuario o puntaje
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const usuario = await prisma.usuario.update({
            where: { id },
            data: body
        });

        return NextResponse.json(usuario);
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
    }
}

// DELETE - Eliminar usuario
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await prisma.usuario.delete({ where: { id } });

        return NextResponse.json({ message: "Usuario eliminado" });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 });
    }
}