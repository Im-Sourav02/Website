'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

function SecureVerification() {
  const searchParams = useSearchParams();
  const token = searchParams.get('t');
  const router = useRouter();

  const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const verifyToken = async () => {
      setStatus('verifying');
      
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.url) {
          setStatus('success');
          // Short delay so the user sees the 'success' state before redirect
          setTimeout(() => {
            window.location.href = data.url;
          }, 500);
        } else {
          throw new Error(data.error || 'Verification failed');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Invalid Request');
        // Redirect to error page after a short delay
        setTimeout(() => {
            router.push('/error');
        }, 1500);
      }
    };

    if (token) {
      // Intentional 3-second delay to foil simple bots
      timeout = setTimeout(() => {
        verifyToken();
      }, 3000);
    } else {
      setStatus('error');
      setErrorMessage('Verification token missing');
      timeout = setTimeout(() => {
         router.push('/error');
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#111] border border-red-900/30 rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(220,38,38,0.25)] backdrop-blur-md">
          
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Icon Container */}
            <div className="relative">
              {status === 'pending' || status === 'verifying' ? (
                <div className="relative flex items-center justify-center w-20 h-20">
                  <div className="absolute inset-0 border-t-2 border-red-500 rounded-full animate-spin"></div>
                  <Lock className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
              ) : status === 'success' ? (
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-green-500" />
                </div>
              ) : (
                 <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <Lock className="w-10 h-10 text-red-600" />
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-wider text-gray-100 uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                Secure Verification
              </h1>
              
              {status === 'pending' && (
                <>
                  <p className="text-gray-400 text-sm">Validating request authenticity...</p>
                  <p className="text-red-500/80 font-mono text-xs mt-4">Human Check 1/2</p>
                </>
              )}
              
              {status === 'verifying' && (
                <>
                   <p className="text-gray-400 text-sm">Decrypting payload payload...</p>
                   <p className="text-red-500/80 font-mono text-xs mt-4">Human Check 2/2</p>
                </>
              )}

              {status === 'success' && (
                <p className="text-green-400 text-sm font-medium">Verification Successful. Redirecting...</p>
              )}

              {status === 'error' && (
                <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
              )}
            </div>

            {/* Progress Bar (Visual only) */}
            {(status === 'pending' || status === 'verifying') && (
               <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-4">
                 <div 
                   className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-[3000ms] ease-linear"
                   style={{ width: status === 'verifying' ? '100%' : '50%' }}
                 />
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
       <SecureVerification />
    </Suspense>
  );
}
