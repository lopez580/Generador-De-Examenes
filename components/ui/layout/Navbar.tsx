"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Preguntas", href: "/preguntas" },
    { label: "Exámenes", href: "/examenes" },
    { label: "Analytics", href: "/analytics" },
]

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav className="w-full border-b border-border-default bg-base px-6 py-3 flex items-center justify-between">

            {/* Logo */}
            <span className="text-sm font-bold tracking-widest uppercase text-text-primary">
                Generador de Exámenes
            </span>

            {/* Links */}
            <div className="flex items-center gap-6">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm transition-colors",
                                isActive
                                    ? "text-text-primary border-b-2 border-purple pb-1"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-3 text-text-secondary">
                <Bell size={18} className="cursor-pointer hover:text-text-primary transition-colors" />
                <Settings size={18} className="cursor-pointer hover:text-text-primary transition-colors" />
                <div className="w-8 h-8 rounded-full bg-elevated border border-border-default flex items-center justify-center text-xs text-text-primary cursor-pointer">
                    U
                </div>
            </div>

        </nav>
    )
}