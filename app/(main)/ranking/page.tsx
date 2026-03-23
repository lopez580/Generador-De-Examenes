"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Usuario {
    id: string;
    nombre: string;
    correo: string;
    puntaje_total: number;
}

export default function RankingPage() {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nuevoPuntaje, setNuevoPuntaje] = useState<number>(0);

    useEffect(() => {
        fetch("/api/usuarios")
            .then((r) => r.json())
            .then((data) => {
                const ordenados = data.sort((a: Usuario, b: Usuario) => b.puntaje_total - a.puntaje_total);
                setUsuarios(ordenados);
            })
            .finally(() => setCargando(false));
    }, []);

    async function handleEliminar(id: string) {
        if (!confirm("¿Eliminar este usuario?")) return;
        await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        setUsuarios(usuarios.filter((u) => u.id !== id));
    }

    async function handleEditarPuntaje(id: string) {
        await fetch(`/api/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ puntaje_total: nuevoPuntaje })
        });
        setUsuarios(usuarios.map((u) => u.id === id ? { ...u, puntaje_total: nuevoPuntaje } : u));
        setEditandoId(null);
    }

    return (
        <div className="min-h-screen bg-base p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-text-primary">Ranking de Usuarios</h1>
                    <Button variant="outline" onClick={() => router.push("/dashboard")} className="border-border-default text-text-secondary">
                        ← Volver
                    </Button>
                </div>

                {cargando && <p className="text-text-muted">Cargando...</p>}

                {!cargando && usuarios.map((usuario, index) => (
                    <div key={usuario.id} className="bg-surface border border-border-default rounded-lg p-5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className={`text-2xl font-bold w-10 text-center ${index === 0 ? "text-yellow-400" :
                                    index === 1 ? "text-gray-400" :
                                        index === 2 ? "text-amber-600" : "text-text-muted"
                                }`}>
                                #{index + 1}
                            </span>
                            <div>
                                <p className="text-text-primary font-semibold">{usuario.nombre}</p>
                                <p className="text-text-muted text-sm">{usuario.correo}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {editandoId === usuario.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={nuevoPuntaje}
                                        onChange={(e) => setNuevoPuntaje(Number(e.target.value))}
                                        className="w-24 bg-base border border-border-default rounded px-2 py-1 text-text-primary text-sm"
                                    />
                                    <Button onClick={() => handleEditarPuntaje(usuario.id)} className="bg-purple hover:bg-purple-hover text-white text-sm px-3">
                                        Guardar
                                    </Button>
                                    <Button variant="outline" onClick={() => setEditandoId(null)} className="border-border-default text-text-secondary text-sm px-3">
                                        Cancelar
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-text-primary font-bold text-lg">{usuario.puntaje_total} pts</span>
                                    <button
                                        onClick={() => { setEditandoId(usuario.id); setNuevoPuntaje(usuario.puntaje_total); }}
                                        className="text-text-muted hover:text-text-primary p-1"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(usuario.id)}
                                        className="text-text-muted hover:text-red-400 p-1"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}