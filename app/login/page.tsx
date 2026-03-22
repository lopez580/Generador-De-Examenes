"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {
        const res = await fetch("/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password })
        });

        const data = await res.json();

        if (!res.ok) {
            setError("Correo o contraseña incorrectos");
            return;
        }

        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        router.push("/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold">Iniciar sesión</h1>

                {error && <p className="text-red-500">{error}</p>}

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
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Entrar
                </button>
                <p className="text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{" "}
                    <a href="/registro" className="text-blue-600 hover:underline">
                        Crear cuenta
                    </a>
                </p>
            </div>
        </div>
    );
}