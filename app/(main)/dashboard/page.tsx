"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Clock, BookOpen, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const actividadReciente = [
    { titulo: "Examen Final: Cálculo Avanzado", tiempo: "Hace 2 horas", calificacion: 46, total: 50, porcentaje: 92 },
    { titulo: "Parcial II: Termodinámica", tiempo: "Hace 5 horas", calificacion: 38, total: 50, porcentaje: 76 },
    { titulo: "Simulacro: Álgebra Lineal", tiempo: "Ayer", calificacion: 44, total: 50, porcentaje: 88 },
];

const acciones = [
    { label: "Generar Examen", descripcion: "Crea evaluaciones con IA en segundos", href: "/generar", icon: Zap },
    { label: "Ver Historial", descripcion: "Revisa resultados y métricas anteriores", href: "/historial", icon: Clock },
    { label: "Banco de Preguntas", descripcion: "Gestiona tu repositorio de reactivos", href: "/preguntas", icon: BookOpen },
];

export default function DashboardPage() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<{ nombre: string; puntaje_total: number } | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (!data) {
            router.push("/login");
            return;
        }
        setUsuario(JSON.parse(data));
    }, [router]);

    function handleLogout() {
        localStorage.removeItem("usuario");
        router.push("/login");
    }

    if (!usuario) return null;

    return (
        <div className="min-h-screen bg-base px-6 py-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">
                            ¡Hola, {usuario.nombre}!
                        </h1>
                        <p className="text-text-secondary mt-1">
                            Tu progreso académico está en niveles óptimos.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Puntaje */}
                        <div className="bg-surface border border-border-default rounded-lg px-6 py-4 text-right">
                            <p className="text-xs uppercase tracking-widest text-text-muted">Tu puntaje total</p>
                            <p className="text-4xl font-bold text-text-primary">{usuario.puntaje_total} pts</p>
                        </div>
                        {/* Logout */}
                        <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión">
                            <LogOut size={18} />
                        </Button>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div>
                    <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-widest">
                        Acciones rápidas
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {acciones.map((accion) => {
                            const Icon = accion.icon;
                            return (
                                <button
                                    key={accion.href}
                                    onClick={() => router.push(accion.href)}
                                    className="bg-surface border border-border-default rounded-lg p-6 text-left hover:border-purple transition-colors group"
                                >
                                    <Icon size={20} className="text-text-muted mb-3 group-hover:text-purple transition-colors" />
                                    <p className="font-semibold text-text-primary">{accion.label}</p>
                                    <p className="text-sm text-text-secondary mt-1">{accion.descripcion}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Actividad reciente */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-widest">
                            Actividad reciente
                        </h2>
                        <button className="text-sm text-purple hover:text-purple-hover transition-colors">
                            Ver todo →
                        </button>
                    </div>
                    <div className="bg-surface border border-border-default rounded-lg divide-y divide-border-default">
                        {actividadReciente.map((item, i) => (
                            <div key={i} className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-md bg-elevated flex items-center justify-center">
                                        <FileText size={16} className="text-text-muted" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{item.titulo}</p>
                                        <p className="text-xs text-text-muted">{item.tiempo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-text-muted uppercase tracking-widest">Calificación</p>
                                        <p className="text-sm font-semibold text-text-primary">{item.calificacion}/{item.total}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-elevated flex items-center justify-center text-sm font-bold text-purple border border-purple">
                                        {item.porcentaje}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}