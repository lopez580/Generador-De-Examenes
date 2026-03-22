import Navbar from "@/components/ui/layout/Navbar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-base">
            <Navbar />
            <main>{children}</main>
        </div>
    )
}