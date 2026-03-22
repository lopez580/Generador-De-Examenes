"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleRegister() {
        const res = await fetch("/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, password })
        });

        if (!res.ok) {
            setError("Error al crear cuenta");
            return;
        }

        router.push("/login");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold">Crear cuenta</h1>

                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Crear cuenta
                </button>

                <p className="text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Iniciar sesión
                    </a>
                </p>
            </div>
        </div>
    );
}