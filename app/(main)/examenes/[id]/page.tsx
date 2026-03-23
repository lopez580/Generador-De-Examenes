"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Pregunta {
    id: string;
    texto: string;
    opciones: string[];
    respuesta_correcta: string;
}

interface Examen {
    id: string;
    area: string;
    preguntas: string[];
}

export default function ResolverExamenPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [examen, setExamen] = useState<Examen | null>(null);
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
    const [respuestas, setRespuestas] = useState<Record<number, string>>({});
    const [terminado, setTerminado] = useState(false);
    const [puntaje, setPuntaje] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargar() {
            const { id } = await params;

            // Obtener examen
            const resExamen = await fetch(`/api/examenes/detalle/${id}`);
            const dataExamen = await resExamen.json();
            setExamen(dataExamen);

            // Obtener preguntas por sus IDs
            const resPreguntas = await fetch(`/api/preguntas/porids`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: dataExamen.preguntas })
            });
            const dataPreguntas = await resPreguntas.json();
            setPreguntas(dataPreguntas);
            setCargando(false);
        }
        cargar();
    }, []);

    function seleccionar(index: number, opcion: string) {
        if (terminado) return;
        setRespuestas({ ...respuestas, [index]: opcion });
    }

    async function finalizar() {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        const respuestasArray = preguntas.map((_, i) => respuestas[i] || "");
        const total = preguntas.reduce((acc, p, i) => acc + (respuestas[i] === p.respuesta_correcta ? 1 : 0), 0);

        setPuntaje(total);
        setTerminado(true);

        // Actualizar examen con respuestas y puntaje
        await fetch(`/api/examenes/detalle/${examen?.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ respuestas_usuario: respuestasArray, puntaje: total })
        });

        // Actualizar puntaje del usuario
        await fetch(`/api/usuarios/${usuario.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ puntaje_total: (usuario.puntaje_total || 0) + total })
        });

        // Actualizar localStorage
        localStorage.setItem("usuario", JSON.stringify({ ...usuario, puntaje_total: (usuario.puntaje_total || 0) + total }));
    }

    if (cargando) return <div className="min-h-screen bg-base flex items-center justify-center text-text-muted">Cargando examen...</div>;

    return (
        <div className="min-h-screen bg-base p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">{examen?.area}</h1>
                        <p className="text-text-muted text-sm">{preguntas.length} preguntas</p>
                    </div>
                    {!terminado && (
                        <Button
                            onClick={finalizar}
                            disabled={Object.keys(respuestas).length < preguntas.length}
                            className="bg-purple hover:bg-purple-hover text-white"
                        >
                            Finalizar Examen
                        </Button>
                    )}
                </div>

                {terminado && (
                    <div className="bg-surface border border-border-default rounded-lg p-6 text-center space-y-2">
                        <p className="text-text-muted text-sm">Resultado</p>
                        <p className="text-4xl font-bold text-text-primary">{puntaje} / {preguntas.length}</p>
                        <p className="text-text-muted text-sm">{Math.round((puntaje / preguntas.length) * 100)}% de aciertos</p>
                        <Button onClick={() => router.push("/examenes")} className="mt-4 bg-purple hover:bg-purple-hover text-white">
                            Ver mis exámenes
                        </Button>
                    </div>
                )}

                {preguntas.map((pregunta, pi) => (
                    <div key={pi} className="bg-surface border border-border-default rounded-lg p-5 space-y-4">
                        <p className="text-xs uppercase tracking-widest text-text-muted">Pregunta {pi + 1}</p>
                        <p className="text-text-primary font-medium">{pregunta.texto}</p>
                        <div className="grid grid-cols-2 gap-3">
                            {pregunta.opciones.map((opcion, oi) => {
                                const letra = ["A", "B", "C", "D"][oi];
                                const seleccionada = respuestas[pi] === opcion;
                                const correcta = terminado && opcion === pregunta.respuesta_correcta;
                                const incorrecta = terminado && seleccionada && opcion !== pregunta.respuesta_correcta;

                                return (
                                    <button
                                        key={oi}
                                        onClick={() => seleccionar(pi, opcion)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left
                      ${correcta ? "border-green-500 bg-green-900/20" : ""}
                      ${incorrecta ? "border-red-500 bg-red-900/20" : ""}
                      ${seleccionada && !terminado ? "border-purple bg-purple-alpha" : ""}
                      ${!seleccionada && !terminado ? "border-border-default bg-elevated hover:border-purple/50" : ""}
                    `}
                                    >
                                        <span className={`text-xs font-bold w-5 h-5 rounded flex items-center justify-center shrink-0
                      ${correcta ? "bg-green-500 text-white" : ""}
                      ${incorrecta ? "bg-red-500 text-white" : ""}
                      ${seleccionada && !terminado ? "bg-purple text-white" : ""}
                      ${!seleccionada && !terminado ? "bg-surface text-text-muted" : ""}
                    `}>
                                            {letra}
                                        </span>
                                        <span className="text-sm text-text-primary">{opcion}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}