import { Terminal, Code, BookOpen } from 'lucide-react';

export default function DocsPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 flex-1">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-4xl font-bold">Integration Guide</h1>
            </div>

            <div className="prose prose-invert max-w-none">
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Welcome to the sukuna.site integration documentation. Here you will learn how to integrate our high-speed, secure redirect logic into your applications specifically to break users out of in-app browsers like Telegram.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-white border-b border-white/10 pb-2 flex items-center gap-2 mt-12">
                    <Terminal className="w-5 h-5 text-blue-400" />
                    Telegram Bot Integration
                </h2>

                <p className="text-gray-400 mb-6">
                    If you are running a Telegram bot, you can easily implement the secure redirect by modifying your short URL generation logic. Our service expects a base64 encoded destination URL passed as the <code>to</code> query parameter.
                </p>

                <div className="mb-8 glass-card rounded-xl overflow-hidden border border-white/5">
                    <div className="bg-surface border-b border-white/5 px-4 py-3 flex items-center justify-between">
                        <span className="text-sm font-mono text-gray-300 flex items-center gap-2">
                            <Code className="w-4 h-4" /> config.py
                        </span>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Python</span>
                    </div>
                    <div className="p-4 bg-[#0d1117] overflow-x-auto text-sm">
                        <pre className="text-blue-300 font-mono leading-relaxed">
                            {`# Define your Next.js redirect app URL
REDIRECT_SERVICE_URL = "https://sukuna.site/api/redirect"
`}
                        </pre>
                    </div>
                </div>

                <div className="mb-8 glass-card rounded-xl overflow-hidden border border-white/5">
                    <div className="bg-surface border-b border-white/5 px-4 py-3 flex items-center justify-between">
                        <span className="text-sm font-mono text-gray-300 flex items-center gap-2">
                            <Code className="w-4 h-4" /> shorturl.py
                        </span>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Python</span>
                    </div>
                    <div className="p-4 bg-[#0d1117] overflow-x-auto text-sm">
                        <pre className="text-gray-300 font-mono leading-relaxed">
                            {`import base64
from config import REDIRECT_SERVICE_URL
import urllib.parse

def generate_secure_redirect(target_url: str) -> str:
    \"\"\"
    Generates a secure redirect URL for sukuna.site
    which handles the Telegram in-app browser breakout.
    \"\"\"
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
`}
                        </pre>
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mt-8 flex gap-4 items-start">
                    <div className="bg-blue-500/20 p-2 rounded-full shrink-0">
                        <Terminal className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-100 mb-1">How it works</h4>
                        <p className="text-sm text-blue-200/70 leading-relaxed">
                            When a user clicks this link in Telegram, the Telegram WebView will open `sukuna.site`. Our Next.js backend detects the custom user-agent from Telegram and instantly returns an HTML page containing an Android Intent (`intent://`) or iOS Custom Scheme (`googlechromes://`) payload, forcing the native Chrome browser to open and load your original target URL dynamically.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
