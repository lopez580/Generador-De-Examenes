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
        <div className="min-h-screen bg-base flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl bg-elevated border border-border-default flex items-center justify-center mb-6">
                <span className="text-purple text-2xl">📖</span>
            </div>

            <h1 className="text-3xl font-bold text-text-primary mb-1">Generador de Exámenes</h1>
            <p className="text-text-secondary text-sm mb-8">Bienvenido de nuevo</p>

            {/* Card */}
            <div className="w-full max-w-md bg-surface border border-border-default rounded-xl p-8 space-y-5">

                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                        {error}
                    </p>
                )}

                <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-text-muted">Nombre</label>
                    <input
                        type="text"
                        placeholder="Tu nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-elevated border border-border-default rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple transition-colors"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-text-muted">Correo electrónico</label>
                    <input
                        type="email"
                        placeholder="nombre@academia.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full bg-elevated border border-border-default rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple transition-colors"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-text-muted">Contraseña</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-elevated border border-border-default rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-purple transition-colors"
                    />
                </div>

                <button
                    onClick={handleRegister}
                    className="w-full bg-purple hover:bg-purple-hover text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                    Registrarse
                </button>

                <div className="relative flex items-center gap-3">
                    <div className="flex-1 h-px bg-border-default" />
                    <span className="text-xs uppercase tracking-widest text-text-muted">o continúa con</span>
                    <div className="flex-1 h-px bg-border-default" />
                </div>

                <button className="w-full bg-elevated hover:bg-surface border border-border-default text-text-primary font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span className="text-sm">G</span>
                    Continuar con Google
                </button>

                <p className="text-center text-sm text-text-muted">
                    ¿Ya tienes cuenta?{" "}
                    <a href="/login" className="text-purple hover:text-purple-hover transition-colors font-medium">
                        Iniciar Sesion
                    </a>
                </p>
            </div>

            <p className="text-text-muted text-xs mt-8 tracking-widest uppercase">Curation Engine v2.4</p>
        </div>
    )
}