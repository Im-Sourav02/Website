"use client";

import { useEffect, useState, useRef } from "react";
import { Lock, Zap, Check, Bot, Timer, ArrowUpRight, Loader2, ShieldCheck, ExternalLink } from "lucide-react";
import Turnstile from "react-turnstile";

export default function RedirectEngine({ target }: { target: string }) {
    const [step, setStep] = useState<"loading" | "intent" | "verifying" | "countdown" | "redirecting">("loading");
    const [countdown, setCountdown] = useState(3);
    const [displayTarget, setDisplayTarget] = useState("");

    // React Turnstile configuration and verification
    const handleVerify = async (token: string) => {
        try {
            const res = await fetch("/api/verify-turnstile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (data.success) {
                startCountdown();
            } else {
                console.error("Turnstile verification failed:", data);
                // Handle failure (e.g., set step to an error state or reset Turnstile)
            }
        } catch (error) {
            console.error("Error during Turnstile verification:", error);
        }
    };

    const startCountdown = () => {
        if (stepRef.current !== "verifying" && stepRef.current !== "intent") return;
        setStep("countdown");

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.replace(atob(target));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        tickRef.current = timer;
    };

    const stepRef = useRef(step);
    useEffect(() => {
        stepRef.current = step;
    }, [step]);

    const tickRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let isAndroid = false;
        let isRealChrome = true;
        let forceChrome = false;

        if (typeof window !== "undefined") {
            const ua = navigator.userAgent.toLowerCase();
            isAndroid = /android/.test(ua);

            // Check for Brave and other webviews/non-chrome browsers
            const isBrave = (navigator as any).brave !== undefined;
            isRealChrome = /chrome/.test(ua) && !/wv|fbav|instagram|messenger|snapchat|line|viber|kakao|tiktok|edg|opr/.test(ua) && !isBrave;

            const params = new URLSearchParams(window.location.search);
            forceChrome = params.get('browser') === 'chrome';

            // Decode target payload
            let decoded = target;
            try {
                decoded = atob(target);
            } catch (e) {
                console.error("Failed to decode base64 target", e);
            }

            // Extract domain for display
            try {
                const urlObj = new URL(decoded);
                setDisplayTarget(urlObj.hostname.replace(/^www\./, ''));
            } catch {
                setDisplayTarget(decoded.replace(/^https?:\/\//, '').split('/')[0]);
            }

            // 1. & 2. The Intent Target & Breakout Check
            if (isAndroid && !isRealChrome && !forceChrome) {
                setStep("intent");

                // Append browser=chrome to current URL instead of final target
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('browser', 'chrome');

                // Construct the intent URL
                const intentTarget = currentUrl.toString().replace(/^https?:\/\//, '');
                const intentUrl = `intent://${intentTarget}#Intent;scheme=https;package=com.android.chrome;end;`;

                // Fire intent
                window.location.replace(intentUrl);

                // 3. Halt execution (Brave Fix)
                return;
            }

            // Normal flow starts at verifying, and now Turnstile component handles the delay/validation
            setStep("verifying");

            return () => {
                if (tickRef.current) clearInterval(tickRef.current);
            };
        }
    }, [target]);

    const getIconAndText = () => {
        switch (step) {
            case "loading":
                return {
                    icon: <Zap className="w-10 h-10 text-blue-400 animate-pulse" />,
                    title: "Initializing...",
                    description: "Preparing your secure connection.",
                };
            case "intent":
                return {
                    icon: <ArrowUpRight className="w-10 h-10 text-green-400 animate-bounce" />,
                    title: "Opening External Browser...",
                    description: "Please confirm to open in your default browser for a secure experience.",
                };
            case "verifying":
                return {
                    icon: <Bot className="w-10 h-10 text-purple-400 animate-bounce" />,
                    title: "Verifying Access...",
                    description: "Please complete the security check to proceed.",
                };
            case "countdown":
                return {
                    icon: <Timer className="w-10 h-10 text-yellow-400 animate-pulse" />,
                    title: "Redirecting Soon...",
                    description: "Your secure redirect will begin shortly.",
                };
            case "redirecting":
                return {
                    icon: <Check className="w-10 h-10 text-green-400" />,
                    title: "Redirecting...",
                    description: "You are being securely redirected.",
                };
            default:
                return {
                    icon: <Lock className="w-10 h-10 text-gray-400" />,
                    title: "Secure Redirect",
                    description: "Ensuring a safe journey to your destination.",
                };
        }
    };

    const { icon, title, description } = getIconAndText();

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
                                {displayTarget}
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
                        href={displayTarget}
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
