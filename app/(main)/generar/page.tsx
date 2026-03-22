"use client";

import { useState } from "react";
import { Download, Printer, Zap, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const areas = [
    "Historia Universal", "Matemáticas", "Ciencias Naturales",
    "Física", "Química", "Literatura",
];

const dificultades: Record<number, { label: string; tiempo: number }> = {
    10: { label: "Fácil", tiempo: 20 },
    20: { label: "Intermedia", tiempo: 45 },
    30: { label: "Difícil", tiempo: 75 },
    40: { label: "Avanzada", tiempo: 90 },
    50: { label: "Experto", tiempo: 120 },
};

function getDificultad(cantidad: number) {
    const keys = Object.keys(dificultades).map(Number).sort((a, b) => a - b);
    const key = keys.reduce((prev, curr) =>
        Math.abs(curr - cantidad) < Math.abs(prev - cantidad) ? curr : prev
    );
    return dificultades[key];
}

interface Pregunta {
    id?: string;
    texto: string;
    opciones: string[];
    respuesta_correcta: string;
    area?: string;
    origen?: string;
}

export default function GeneradorPage() {
    const router = useRouter();
    const [area, setArea] = useState("Historia Universal");
    const [cantidad, setCantidad] = useState(20);
    const [usarIA, setUsarIA] = useState(true);
    const [generando, setGenerando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

    // Modal agregar/editar
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
    const [form, setForm] = useState({
        texto: "",
        opcionA: "",
        opcionB: "",
        opcionC: "",
        opcionD: "",
        respuesta_correcta: "",
    });

    const { label: dificultad, tiempo } = getDificultad(cantidad);

    async function handleGenerar() {
        setGenerando(true);
        try {
            const res = await fetch("/api/preguntas/generar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ area, cantidad })
            });
            if (!res.ok) throw new Error("Error al generar");

            const res2 = await fetch(`/api/preguntas?area=${encodeURIComponent(area)}`);
            const data = await res2.json();
            setPreguntas(data);
        } catch (error) {
            console.error(error);
        } finally {
            setGenerando(false);
        }
    }

    function abrirModalNueva() {
        setEditandoIndex(null);
        setForm({ texto: "", opcionA: "", opcionB: "", opcionC: "", opcionD: "", respuesta_correcta: "" });
        setModalAbierto(true);
    }

    function abrirModalEditar(index: number) {
        const p = preguntas[index];
        setEditandoIndex(index);
        setForm({
            texto: p.texto,
            opcionA: p.opciones[0] || "",
            opcionB: p.opciones[1] || "",
            opcionC: p.opciones[2] || "",
            opcionD: p.opciones[3] || "",
            respuesta_correcta: p.respuesta_correcta,
        });
        setModalAbierto(true);
    }

    function guardarModal() {
        const nueva: Pregunta = {
            texto: form.texto,
            opciones: [form.opcionA, form.opcionB, form.opcionC, form.opcionD],
            respuesta_correcta: form.respuesta_correcta,
            area,
            origen: "manual",
        };

        if (editandoIndex !== null) {
            const copia = [...preguntas];
            copia[editandoIndex] = { ...copia[editandoIndex], ...nueva };
            setPreguntas(copia);
        } else {
            setPreguntas([...preguntas, nueva]);
        }
        setModalAbierto(false);
    }

    function eliminarPregunta(index: number) {
        setPreguntas(preguntas.filter((_, i) => i !== index));
    }

    async function handleGuardarExamen() {
        if (preguntas.length === 0) return;
        setGuardando(true);
        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

            // Guardar preguntas manuales en BD
            const ids: string[] = [];
            for (const p of preguntas) {
                if (p.id) {
                    ids.push(p.id);
                } else {
                    const res = await fetch("/api/preguntas", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(p)
                    });
                    const data = await res.json();
                    ids.push(data.id);
                }
            }

            // Crear examen
            await fetch("/api/examenes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    area,
                    preguntas: ids,
                    respuestas_usuario: [],
                    puntaje: 0
                })
            });

            router.push("/examenes");
        } catch (error) {
            console.error(error);
        } finally {
            setGuardando(false);
        }
    }

    return (
        <div className="min-h-screen bg-base flex">
            {/* Sidebar */}
            <aside className="w-72 border-r border-border-default bg-base flex flex-col justify-between p-5 shrink-0">
                <div>
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-widest text-text-muted">Exam Generator</p>
                        <p className="text-xs text-text-muted">The Digital Curator</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-widest text-text-muted">Área del conocimiento</p>
                            <Select value={area} onValueChange={setArea}>
                                <SelectTrigger className="w-full bg-elevated border-border-default text-text-primary">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-elevated border-border-default">
                                    {areas.map((a) => (
                                        <SelectItem key={a} value={a} className="text-text-primary hover:bg-surface">
                                            {a}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="text-xs uppercase tracking-widest text-text-muted">Cantidad de preguntas</p>
                                <span className="text-sm font-semibold text-text-primary bg-elevated px-2 py-0.5 rounded">{cantidad}</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={50}
                                step={5}
                                value={cantidad}
                                onChange={(e) => setCantidad(Number(e.target.value))}
                                className="w-full accent-purple"
                            />
                        </div>

                        <div className="bg-elevated border border-border-default rounded-lg p-4 flex items-start gap-3">
                            <Zap size={16} className="text-purple mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary">Usar IA (Gemini)</p>
                                <p className="text-xs text-text-muted">Generación automática optimizada</p>
                            </div>
                            <Switch checked={usarIA} onCheckedChange={setUsarIA} />
                        </div>

                        <Button onClick={handleGenerar} disabled={generando} className="w-full bg-purple hover:bg-purple-hover text-white font-bold tracking-wide">
                            <Zap size={16} className="mr-2" />
                            {generando ? "Generando..." : "Añadir preguntas con Gemini"}
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-elevated border border-border-default rounded-lg p-3">
                            <p className="text-xs uppercase tracking-widest text-text-muted">Dificultad</p>
                            <p className="text-base font-bold text-text-primary mt-1">{dificultad}</p>
                        </div>
                        <div className="bg-elevated border border-border-default rounded-lg p-3">
                            <p className="text-xs uppercase tracking-widest text-text-muted">Tiempo est.</p>
                            <p className="text-base font-bold text-text-primary mt-1">{tiempo} min</p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleGuardarExamen}
                    disabled={guardando || preguntas.length === 0}
                    className="w-full bg-purple hover:bg-purple-hover text-white font-bold"
                >
                    {guardando ? "Guardando..." : "Guardar Examen"}
                </Button>
            </aside>

            {/* Panel derecho */}
            <main className="flex-1 flex flex-col">
                <div className="border-b border-border-default px-6 py-3 flex items-center gap-4">
                    <span className="text-sm text-text-secondary">Drafts</span>
                    <span className="text-sm text-text-secondary">Templates</span>
                    <span className="text-sm text-text-secondary">Archive</span>
                    <div className="ml-auto flex items-center gap-3">
                        <Download size={16} className="text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
                        <Printer size={16} className="text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-text-primary">Vista previa de preguntas</h2>
                            <span className="text-xs bg-purple-alpha text-purple border border-purple/30 px-2 py-0.5 rounded-full">
                                {preguntas.length} preguntas
                            </span>
                        </div>
                        <Button onClick={abrirModalNueva} variant="outline" className="border-border-default text-text-secondary hover:text-text-primary gap-2">
                            <Plus size={14} /> Agregar pregunta
                        </Button>
                    </div>

                    {preguntas.map((pregunta, pi) => (
                        <div key={pi} className="bg-surface border border-border-default rounded-lg p-5 space-y-4">
                            <div className="flex justify-between items-start">
                                <p className="text-xs uppercase tracking-widest text-text-muted">Pregunta {pi + 1}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => abrirModalEditar(pi)} className="text-text-muted hover:text-text-primary">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => eliminarPregunta(pi)} className="text-text-muted hover:text-red-400">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-text-primary font-medium">{pregunta.texto}</p>
                            <div className="grid grid-cols-2 gap-3">
                                {pregunta.opciones.map((opcion, oi) => {
                                    const letra = ["A", "B", "C", "D"][oi];
                                    const isCorrect = opcion === pregunta.respuesta_correcta;
                                    return (
                                        <div key={oi} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isCorrect ? "border-purple bg-purple-alpha" : "border-border-default bg-elevated"}`}>
                                            <span className={`text-xs font-bold w-5 h-5 rounded flex items-center justify-center shrink-0 ${isCorrect ? "bg-purple text-white" : "bg-surface text-text-muted"}`}>
                                                {letra}
                                            </span>
                                            <span className="text-sm text-text-primary">{opcion}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {preguntas.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-text-muted">
                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-border-default flex items-center justify-center mb-2">
                                <span className="text-lg leading-none">+</span>
                            </div>
                            <p className="text-sm">Click "Añadir preguntas con Gemini" o agrega manualmente</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal agregar/editar pregunta */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-elevated border border-border-default rounded-lg p-6 w-full max-w-lg space-y-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-semibold text-text-primary">
                            {editandoIndex !== null ? "Editar pregunta" : "Nueva pregunta"}
                        </h3>

                        <input
                            placeholder="Texto de la pregunta"
                            value={form.texto}
                            onChange={(e) => setForm({ ...form, texto: e.target.value })}
                            className="w-full bg-base border border-border-default rounded-md px-3 py-2 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple transition-colors"
                        />
                        {["opcionA", "opcionB", "opcionC", "opcionD"].map((key, i) => (
                            <input
                                key={key}
                                placeholder={`Opción ${["A", "B", "C", "D"][i]}`}
                                value={form[key as keyof typeof form]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                className="w-full bg-surface border border-border-default rounded p-2 text-text-primary text-sm"
                            />
                        ))}

                        <select
                            value={form.respuesta_correcta}
                            onChange={(e) => setForm({ ...form, respuesta_correcta: e.target.value })}
                            className="w-full bg-base border border-border-default rounded-md px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-purple transition-colors"
                        >
                            <option value="">Selecciona respuesta correcta</option>
                            {[form.opcionA, form.opcionB, form.opcionC, form.opcionD].filter(Boolean).map((op, i) => (
                                <option key={i} value={op}>{op}</option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setModalAbierto(false)} className="border-border-default text-text-secondary">
                                Cancelar
                            </Button>
                            <Button onClick={guardarModal} className="bg-purple hover:bg-purple-hover text-white">
                                {editandoIndex !== null ? "Actualizar" : "Agregar"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}