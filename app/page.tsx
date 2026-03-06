import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Shield } from 'lucide-react';


export default function Home() {
    return (
        <div className="flex flex-col items-center flex-1">
            {/* Hero Section */}
            <section className="w-full relative overflow-hidden pt-32 pb-20 px-4">
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 user-select-none pointer-events-none">
                    <div className="w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen absolute center" />
                </div>

                <div className="container mx-auto z-10 relative flex flex-col items-center text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        System Online & Guarded
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400">
                        Secure Redirect Services
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
                        Lightning fast, secure, and reliable URL redirection. Protect your traffic and seamlessly route your users to their destination.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            href="/docs"
                            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 group"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/docs"
                            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            Documentation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="w-full py-20 px-4 bg-gray-900/50 border-t border-white/5 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Enterprise-grade infrastructure</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Built to handle massive traffic with built-in security layers to prevent abuse and ensure smooth user flows.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card rounded-2xl p-8 flex flex-col items-start hover:border-blue-500/30 transition-colors group">
                            <div className="p-3 bg-blue-500/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Fast Redirection</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Optimized endpoints combined with Edge network infrastructure ensures users are redirected to their destination with zero noticeable latency.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card rounded-2xl p-8 flex flex-col items-start hover:border-green-500/30 transition-colors group">
                            <div className="p-3 bg-green-500/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure & Safe</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Built-in breakout mechanics for iOS and Android webviews, forcing links to open in the native Chrome browser for maximum safety.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card rounded-2xl p-8 flex flex-col items-start hover:border-blue-500/30 transition-colors group">
                            <div className="p-3 bg-blue-500/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">ReCaptcha Ready</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Integrations to block bot traffic before they hit your final destination, keeping your metrics clean and infrastructure costs low.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
