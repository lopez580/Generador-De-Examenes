import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Historial de exámenes de un usuario
export async function GET(_request: Request, { params }: { params: Promise<{ usuario_id: string }> }) {
    try {
        const { usuario_id } = await params;

        const examenes = await prisma.examen.findMany({
            where: { usuario_id }
        });

        return NextResponse.json(examenes);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
    }
}