"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, ExternalLink } from "lucide-react";

export default function RedirectEngine({ target }: { target: string }) {
    const [countdown, setCountdown] = useState(3);
    const [status, setStatus] = useState("Analyzing request...");

    useEffect(() => {
        let isAndroid = false;

        if (typeof window !== "undefined") {
            const ua = navigator.userAgent.toLowerCase();
            isAndroid = /android/.test(ua);
        }

        const decodedTarget = decodeURIComponent(target);
        const parsedUrl = decodedTarget.replace(/^https?:\/\//, '');

        const tick = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(tick);
                    setStatus("Redirecting...");

                    if (isAndroid) {
                        // Android intent fallback to force native browser instead of webview
                        const intentUrl = `intent://${parsedUrl}#Intent;scheme=https;package=com.android.chrome;end`;
                        window.location.href = intentUrl;

                        // Fallback if intent fails
                        setTimeout(() => {
                            window.location.href = decodedTarget;
                        }, 1000);
                    } else {
                        window.location.href = decodedTarget;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(tick);
    }, [target]);

    const decodedTarget = typeof window !== "undefined" ? decodeURIComponent(target) : target;

    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full px-4 min-h-[80vh]">
            <div className="glass-card rounded-3xl p-8 max-w-md w-full relative overflow-hidden bg-gray-900/50 border border-white/10 shadow-2xl backdrop-blur-xl">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border border-blue-500/30 relative z-10 shadow-lg">
                            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-2 tracking-tight text-white">{status}</h2>
                    <p className="text-gray-400 mb-8 max-w-sm">
                        Please wait while we verify the destination and secure your connection.
                    </p>

                    <div className="w-full bg-gray-950/80 rounded-xl p-4 border border-white/10 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden w-full">
                            <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-300 truncate font-mono">
                                {decodedTarget}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                        <span>Redirecting in</span>
                        <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold">
                            {countdown}
                        </span>
                        <span>seconds</span>
                    </div>

                    <a
                        href={decodedTarget}
                        className="mt-6 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                    >
                        Click here if not redirected
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
