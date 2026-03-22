import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Listar todos los usuarios
export async function GET() {
    try {
        const usuarios = await prisma.usuario.findMany();
        return NextResponse.json(usuarios);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
    }
}

// POST - Crear usuario
export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Body recibido:", body);
        const { nombre, correo, password } = body;

        const usuario = await prisma.usuario.create({
            data: { nombre, correo, password }
        });
        console.log("Usuario creado:", usuario);
        return NextResponse.json(usuario, { status: 201 });
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
    }
}