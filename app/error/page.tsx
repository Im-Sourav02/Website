import Link from 'next/link';
import { Lock, AlertTriangle, ExternalLink } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Deep Red Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center space-y-8">
        
        {/* Warning Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            Bypass <span className="text-red-600 bg-red-600/10 px-2 rounded-md">Detected</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-md mx-auto mt-4 text-sm md:text-base">
            We've detected an invalid or automated link bypass attempt. Sudhar ja bhai..
          </p>
        </div>

        {/* Warning Cards Stack */}
        <div className="w-full space-y-4">
          
          {/* Card 1: Primary Violation */}
          <div className="bg-[#111]/80 border border-red-900/40 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl shrink-0">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-200">Security Violation</h2>
              <p className="text-red-500 uppercase text-xs font-bold mt-1 tracking-wider">Invalid Request or Direct Access!</p>
            </div>
          </div>

          {/* Card 2: Explanation */}
          <div className="bg-[#0f0f0f]/80 border border-neutral-800 rounded-2xl p-6 text-center shadow-lg backdrop-blur-sm">
            <p className="text-gray-400 text-sm leading-relaxed">
              Please don't try to bypass links or refresh the page, as it directly affects content provider earnings and breaks the secure connection. 
              Go back to the original source and solve the short link manually.
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="w-full flex flex-col items-center space-y-6 mt-4">
          <p className="text-gray-300 text-sm font-medium">
            If you believe this is a mistake, please contact our support team!!
          </p>
          
          <Link href="https://t.me/Im_Sukuna02" target="_blank" rel="noopener noreferrer" 
            className="w-full max-w-sm group flex items-center justify-center gap-3 bg-[#161616] hover:bg-[#1a1a1a] border border-neutral-800 hover:border-red-900/50 transition-all duration-300 rounded-xl p-4 shadow-lg hover:shadow-[0_0_20px_-5px_rgba(220,38,38,0.3)]">
            <span className="font-bold text-white group-hover:text-red-100 transition-colors">Click here [TG]</span>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
          </Link>

          <p className="text-red-600 font-bold text-xs max-w-sm text-center uppercase tracking-wide opacity-80 pt-4">
            Warning: Repeated attempts to bypass links will result in a permanent ban from the bot.
          </p>
        </div>

      </div>
    </div>
  );
}
