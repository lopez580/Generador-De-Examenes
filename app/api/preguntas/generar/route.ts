import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//const MODEL = "gemini-2.5-flash"; // o "gemini-1.5-pro"
const MODEL = "gemini-2.5-flash";
//const MODEL = "gemini-2.5-flash-lite";

// POST - Generar preguntas con Gemini y guardarlas
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { area, cantidad } = body;

        const model = genAI.getGenerativeModel({ model: MODEL });

        const prompt = `Genera ${cantidad} preguntas de opción múltiple sobre ${area}. 
    Responde SOLO con un JSON array con este formato exacto, sin texto adicional:
    [
      {
        "texto": "¿Pregunta aquí?",
        "opciones": ["opción A", "opción B", "opción C", "opción D"],
        "respuesta_correcta": "opción A"
      }
    ]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const clean = text.replace(/```json|```/g, "").trim();
        const preguntas = JSON.parse(clean);

        const guardadas = await prisma.pregunta.createMany({
            data: preguntas.map((p: { texto: string; opciones: string[]; respuesta_correcta: string }) => ({
                texto: p.texto,
                opciones: p.opciones,
                respuesta_correcta: p.respuesta_correcta,
                area,
                origen: "gemini"
            }))
        });

        return NextResponse.json({ message: `${guardadas.count} preguntas generadas`, count: guardadas.count }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al generar preguntas" }, { status: 500 });
    }
}