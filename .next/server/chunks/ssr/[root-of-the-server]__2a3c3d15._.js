module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70864,a=>{a.n(a.i(33290))},43619,a=>{a.n(a.i(79962))},13718,a=>{a.n(a.i(85523))},18198,a=>{a.n(a.i(45518))},62212,a=>{a.n(a.i(66114))},29844,a=>{"use strict";var b=a.i(7997),c=a.i(1269);let d=(0,c.default)("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]),e=(0,c.default)("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]),f=(0,c.default)("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);function g(){return(0,b.jsxs)("div",{className:"container mx-auto max-w-4xl py-12 px-4 flex-1",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-8",children:[(0,b.jsx)("div",{className:"p-2 bg-blue-500/10 rounded-lg",children:(0,b.jsx)(f,{className:"w-6 h-6 text-blue-400"})}),(0,b.jsx)("h1",{className:"text-4xl font-bold",children:"Integration Guide"})]}),(0,b.jsxs)("div",{className:"prose prose-invert max-w-none",children:[(0,b.jsx)("p",{className:"text-gray-400 text-lg mb-8 leading-relaxed",children:"Welcome to the sukuna.site integration documentation. Here you will learn how to integrate our high-speed, secure redirect logic into your applications specifically to break users out of in-app browsers like Telegram."}),(0,b.jsxs)("h2",{className:"text-2xl font-semibold mb-4 text-white border-b border-white/10 pb-2 flex items-center gap-2 mt-12",children:[(0,b.jsx)(d,{className:"w-5 h-5 text-blue-400"}),"Telegram Bot Integration"]}),(0,b.jsxs)("p",{className:"text-gray-400 mb-6",children:["If you are running a Telegram bot, you can easily implement the secure redirect by modifying your short URL generation logic. Our service expects a base64 encoded destination URL passed as the ",(0,b.jsx)("code",{children:"to"})," query parameter."]}),(0,b.jsxs)("div",{className:"mb-8 glass-card rounded-xl overflow-hidden border border-white/5",children:[(0,b.jsxs)("div",{className:"bg-surface border-b border-white/5 px-4 py-3 flex items-center justify-between",children:[(0,b.jsxs)("span",{className:"text-sm font-mono text-gray-300 flex items-center gap-2",children:[(0,b.jsx)(e,{className:"w-4 h-4"})," config.py"]}),(0,b.jsx)("span",{className:"text-xs text-gray-500 uppercase font-bold tracking-wider",children:"Python"})]}),(0,b.jsx)("div",{className:"p-4 bg-[#0d1117] overflow-x-auto text-sm",children:(0,b.jsx)("pre",{className:"text-blue-300 font-mono leading-relaxed",children:`# Define your Next.js redirect app URL
REDIRECT_SERVICE_URL = "https://sukuna.site/api/redirect"
`})})]}),(0,b.jsxs)("div",{className:"mb-8 glass-card rounded-xl overflow-hidden border border-white/5",children:[(0,b.jsxs)("div",{className:"bg-surface border-b border-white/5 px-4 py-3 flex items-center justify-between",children:[(0,b.jsxs)("span",{className:"text-sm font-mono text-gray-300 flex items-center gap-2",children:[(0,b.jsx)(e,{className:"w-4 h-4"})," shorturl.py"]}),(0,b.jsx)("span",{className:"text-xs text-gray-500 uppercase font-bold tracking-wider",children:"Python"})]}),(0,b.jsx)("div",{className:"p-4 bg-[#0d1117] overflow-x-auto text-sm",children:(0,b.jsx)("pre",{className:"text-gray-300 font-mono leading-relaxed",children:`import base64
from config import REDIRECT_SERVICE_URL
import urllib.parse

def generate_secure_redirect(target_url: str) -> str:
    """
    Generates a secure redirect URL for sukuna.site
    which handles the Telegram in-app browser breakout.
    """
    # Encode the destination URL in base64
    encoded_bytes = base64.b64encode(target_url.encode("utf-8"))
    encoded_target = encoded_bytes.decode("utf-8")
    
    # URL encode the base64 string just to be safe with query params
    safe_target = urllib.parse.quote(encoded_target)
    
    # Construct the final URL
    final_url = f"{REDIRECT_SERVICE_URL}?to={safe_target}"
    
    return final_url

# Example Usage
if __name__ == "__main__":
    destination = "https://example.com/secret-file-download"
    secure_link = generate_secure_redirect(destination)
    print(f"Send this link to users: {secure_link}")
`})})]}),(0,b.jsxs)("div",{className:"bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mt-8 flex gap-4 items-start",children:[(0,b.jsx)("div",{className:"bg-blue-500/20 p-2 rounded-full shrink-0",children:(0,b.jsx)(d,{className:"w-5 h-5 text-blue-400"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h4",{className:"font-semibold text-blue-100 mb-1",children:"How it works"}),(0,b.jsx)("p",{className:"text-sm text-blue-200/70 leading-relaxed",children:"When a user clicks this link in Telegram, the Telegram WebView will open `sukuna.site`. Our Next.js backend detects the custom user-agent from Telegram and instantly returns an HTML page containing an Android Intent (`intent://`) or iOS Custom Scheme (`googlechromes://`) payload, forcing the native Chrome browser to open and load your original target URL dynamically."})]})]})]})]})}a.s(["default",()=>g],29844)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__2a3c3d15._.js.map