"use client";

import { useEffect, useState, useRef } from "react";
import { Lock, Zap, Check, Bot, Timer, ArrowUpRight, Loader2, ShieldCheck, ExternalLink } from "lucide-react";
import Turnstile from "react-turnstile";

export default function RedirectEngine({ target }: { target: string }) {
    const [step, setStep] = useState<"loading" | "intent" | "verifying" | "countdown" | "redirecting">("loading");
    const [countdown, setCountdown] = useState(3);
    const [displayTarget, setDisplayTarget] = useState("Protected Destination");
    const [realUrl, setRealUrl] = useState<string | null>(null);

    // 1. Cloudflare Verification
    const handleVerify = async (token: string) => {
        try {
            const res = await fetch("/api/verify-turnstile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Send BOTH token and base64 target to the server
                body: JSON.stringify({ token, target }), 
            });

            const data = await res.json();

            if (data.success && data.url) {
                setRealUrl(data.url);
                try {
                    const urlObj = new URL(data.url);
                    setDisplayTarget(urlObj.hostname.replace(/^www\./, ''));
                } catch {
                    setDisplayTarget(data.url.split('/')[0]);
                }
                startCountdown(data.url);
            } else {
                console.error("Turnstile verification failed:", data);
            }
        } catch (error) {
            console.error("Error during Turnstile verification:", error);
        }
    };

    const startCountdown = (finalUrl: string) => {
        setStep("countdown");
        let timeLeft = 3;
        setCountdown(timeLeft);

        const timer = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                setStep("redirecting");
                window.location.replace(finalUrl);
            }
        }, 1000);
    };

    // 2. Initial Routing & Android Escape
    useEffect(() => {
        if (typeof window === "undefined") return;

        const ua = navigator.userAgent.toLowerCase();
        const isAndroid = /android/.test(ua);
        const forceChrome = new URLSearchParams(window.location.search).get('browser') === 'chrome';

        if (isAndroid && !forceChrome) {
            setStep("intent");
            
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('browser', 'chrome');
            const intentTarget = currentUrl.toString().replace(/^https?:\/\//, '');
            const intentUrl = `intent://${intentTarget}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl.toString())};end;`;

            // Auto-breakout attempt
            setTimeout(() => window.location.replace(intentUrl), 100);

            // Invisible Tap fallback
            const tapHandler = () => window.location.replace(intentUrl);
            document.addEventListener('click', tapHandler, { once: true });
            document.addEventListener('touchstart', tapHandler, { once: true });

            return () => {
                document.removeEventListener('click', tapHandler);
                document.removeEventListener('touchstart', tapHandler);
            };
        } else {
            setStep("verifying");
        }
    }, [target]);

    // 3. UI Display Logic
    const getIconAndText = () => {
        switch (step) {
            case "loading": return { icon: <Zap className="w-10 h-10 text-blue-400 animate-pulse" />, title: "Initializing...", description: "Preparing your secure connection." };
            case "intent": return { icon: <ArrowUpRight className="w-10 h-10 text-green-400 animate-bounce" />, title: "Opening External Browser...", description: "Please confirm to open in your default browser for a secure experience. Tap anywhere if stuck." };
            case "verifying": return { icon: <Bot className="w-10 h-10 text-purple-400 animate-bounce" />, title: "Verifying Access...", description: "Please complete the security check to proceed." };
            case "countdown": return { icon: <Timer className="w-10 h-10 text-yellow-400 animate-pulse" />, title: "Redirecting Soon...", description: "Your secure redirect will begin shortly." };
            case "redirecting": return { icon: <Check className="w-10 h-10 text-green-400" />, title: "Redirecting...", description: "You are being securely redirected." };
            default: return { icon: <Lock className="w-10 h-10 text-gray-400" />, title: "Secure Redirect", description: "Ensuring a safe journey to your destination." };
        }
    };

    const { icon, title, description } = getIconAndText();

    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full px-4 min-h-[80vh]">
            <div className="glass-card rounded-3xl p-8 max-w-md w-full relative overflow-hidden bg-gray-900/50 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border border-blue-500/30 relative z-10 shadow-lg">
                            {step === "verifying" || step === "countdown" ? icon : <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-2 tracking-tight text-white">{title}</h2>
                    <p className="text-gray-400 mb-8 max-w-sm">{description}</p>

                    {/* TURNSTILE WIDGET (Only shows during verification step) */}
                    {step === "verifying" && (
                        <div className="mb-6 flex justify-center w-full min-h-[65px]">
                            <Turnstile 
                                sitekey="NEXT_PUBLIC_TURNSTILE_SITE_KEY" // PASTE SITE KEY HERE
                                onVerify={handleVerify}
                                theme="dark"
                            />
                        </div>
                    )}

                    <div className="w-full bg-gray-950/80 rounded-xl p-4 border border-white/10 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden w-full">
                            {realUrl ? <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" /> : <Lock className="w-5 h-5 text-orange-400 flex-shrink-0" />}
                            <span className="text-sm text-gray-300 truncate font-mono">
                                {displayTarget}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                        <span>Redirecting in</span>
                        <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold">
                            {step === "verifying" || step === "intent" ? "..." : countdown}
                        </span>
                        <span>seconds</span>
                    </div>

                    {realUrl && step !== "verifying" && (
                        <a href={realUrl} className="mt-6 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer">
                            Click here if not redirected
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}