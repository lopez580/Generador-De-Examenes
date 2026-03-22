"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Bienvenido, {usuario.nombre}</h1>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Cerrar sesión
                    </button>
                </div>

                {/* Puntaje */}
                <div className="bg-white p-6 rounded shadow">
                    <p className="text-gray-500">Puntaje total</p>
                    <p className="text-4xl font-bold">{usuario.puntaje_total}</p>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push("/generar")}
                        className="bg-blue-600 text-white p-6 rounded shadow hover:bg-blue-700 text-lg font-semibold"
                    >
                        Generar Examen
                    </button>
                    <button
                        onClick={() => router.push("/historial")}
                        className="bg-green-600 text-white p-6 rounded shadow hover:bg-green-700 text-lg font-semibold"
                    >
                        Ver Historial
                    </button>
                    <button
                        onClick={() => router.push("/preguntas")}
                        className="bg-purple-600 text-white p-6 rounded shadow hover:bg-purple-700 text-lg font-semibold"
                    >
                        Banco de Preguntas
                    </button>
                </div>

            </div>
        </div>
    );
}