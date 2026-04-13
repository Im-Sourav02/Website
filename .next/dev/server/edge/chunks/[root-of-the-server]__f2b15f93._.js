(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
function middleware(request) {
    // Only apply to /secure paths
    if (request.nextUrl.pathname.startsWith('/secure')) {
        const referer = request.headers.get('referer');
        // Check if there is an authorized shortener list in envy
        const authorizedStr = process.env.AUTHORIZED_SHORTENERS;
        // If we're not enforcing or no settings found, we might want to skip (or fail closed depending on your preference)
        if (!authorizedStr) {
            // Failing open for development safety if no env set, though in production you might want to fail closed
            console.warn('AUTHORIZED_SHORTENERS not set. Allow-listing all referers. Please set this in production.');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
        const authorizedDomains = authorizedStr.split(',').map((d)=>d.trim().toLowerCase());
        let isAuthorized = false;
        if (referer) {
            try {
                const refererUrl = new URL(referer);
                const refHostname = refererUrl.hostname.toLowerCase();
                // Allow localhost for testing purposes
                if (refHostname === 'localhost') {
                    isAuthorized = true;
                } else {
                    isAuthorized = authorizedDomains.some((domain)=>refHostname === domain || refHostname.endsWith(`.${domain}`));
                }
            } catch (e) {
                console.error('Invalid referer URL', referer, e);
            }
        }
        if (!isAuthorized) {
            // Rewrite the request to the error page so bypassers don't see the /secure UI
            const url = request.nextUrl.clone();
            url.pathname = '/error';
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(url);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/secure/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map