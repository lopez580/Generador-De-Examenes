import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Obtener un usuario por ID
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const usuario = await prisma.usuario.findUnique({ where: { id } });

        if (!usuario) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json(usuario);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 });
    }
}

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