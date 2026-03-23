"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Examen {
    id: string;
    area: string;
    preguntas: string[];
    puntaje: number;
    fecha: string;
    respuestas_usuario: string[];
}

export default function ExamenesPage() {
    const router = useRouter();
    const [examenes, setExamenes] = useState<Examen[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        if (!usuario.id) {
            router.push("/login");
            return;
        }
        fetch(`/api/examenes/${usuario.id}`)
            .then((r) => r.json())
            .then((data) => setExamenes(data))
            .finally(() => setCargando(false));
    }, [router]);

    async function handleEliminar(id: string) {
        if (!confirm("¿Eliminar este examen?")) return;
        await fetch(`/api/examenes/${id}`, { method: "DELETE" });
        setExamenes(examenes.filter((e) => e.id !== id));
    }

    return (
        <div className="min-h-screen bg-base p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-text-primary">Mis Exámenes</h1>
                    <Button onClick={() => router.push("/generar")} className="bg-purple hover:bg-purple-hover text-white">
                        + Nuevo Examen
                    </Button>
                </div>

                {cargando && (
                    <div className="flex justify-center py-16">
                        <p className="text-text-muted animate-pulse">Cargando exámenes...</p>
                    </div>
                )}

                {!cargando && examenes.length === 0 && (
                    <div className="text-center py-16 text-text-muted">
                        <p className="text-lg">No tienes exámenes todavía</p>
                        <p className="text-sm mt-1">Crea uno desde el generador</p>
                    </div>
                )}

                {examenes.map((examen) => {
                    const resuelto = examen.respuestas_usuario.length > 0;
                    return (
                        <div key={examen.id} className="bg-surface border border-border-default rounded-lg p-5 flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-text-primary font-semibold">{examen.area}</p>
                                <p className="text-text-muted text-sm">{examen.preguntas.length} preguntas</p>
                                <p className="text-text-muted text-xs">{new Date(examen.fecha).toLocaleDateString()}</p>
                                {resuelto && (
                                    <span className="text-xs bg-elevated text-text-secondary border border-border-default px-2 py-0.5 rounded-full">
                                        Puntaje: {examen.puntaje}/{examen.preguntas.length}
                                    </span>
                                )}
                                {!resuelto && (
                                    <span className="text-xs bg-purple-alpha text-purple border border-purple/30 px-2 py-0.5 rounded-full">
                                        Pendiente
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/generar?id=${examen.id}`)}
                                    className="text-text-muted hover:text-text-primary p-2"
                                    title="Editar"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => router.push(`/examenes/${examen.id}`)}
                                    className="text-text-muted hover:text-green-400 p-2"
                                    title="Resolver"
                                >
                                    <Play size={16} />
                                </button>
                                <button
                                    onClick={() => handleEliminar(examen.id)}
                                    className="text-text-muted hover:text-red-400 p-2"
                                    title="Eliminar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}