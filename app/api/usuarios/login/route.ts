import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST - Login
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { correo, password } = body;

        const usuario = await prisma.usuario.findUnique({
            where: { correo }
        });

        if (!usuario || usuario.password !== password) {
            return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
        }

        return NextResponse.json({ message: "Login exitoso", usuario });
    } catch (error) {
        return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
    }
}