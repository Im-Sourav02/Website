import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react'; // We will use lucide-react for icons

export const metadata: Metadata = {
    title: 'sukuna.site | Secure Redirect Services',
    description: 'Lightning fast, secure, and reliable URL redirection.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-[#0b0f19] text-[#ffffff]">
                <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur-md">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-[#3b82f6] p-1.5 rounded-lg group-hover:bg-[#3b82f6]/80 transition-colors">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">sukuna.site</span>
                        </Link>

                        <nav className="flex items-center gap-6 text-sm font-medium">
                            <Link href="/" className="text-[#9ca3af] hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link href="/docs" className="text-[#9ca3af] hover:text-white transition-colors">
                                Docs
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="flex-1 flex flex-col">
                    {children}
                </main>

                <footer className="border-t border-white/10 py-8 bg-[#0b0f19]">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#9ca3af]">
                        <p>© {new Date().getFullYear()} sukuna.site. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                                System Operational
                            </span>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
