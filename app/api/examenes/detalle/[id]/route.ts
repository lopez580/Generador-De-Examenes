import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const examen = await prisma.examen.findUnique({ where: { id } });
        if (!examen) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
        return NextResponse.json(examen);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener examen" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const examen = await prisma.examen.update({
            where: { id },
            data: body
        });
        return NextResponse.json(examen);
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar examen" }, { status: 500 });
    }
}