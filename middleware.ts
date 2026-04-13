import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to /secure paths
  if (request.nextUrl.pathname.startsWith('/secure')) {
    const referer = request.headers.get('referer');
    
    // Check if there is an authorized shortener list in envy
    const authorizedStr = process.env.AUTHORIZED_SHORTENERS;
    
    // If we're not enforcing or no settings found, we might want to skip (or fail closed depending on your preference)
    if (!authorizedStr) {
      // Failing open for development safety if no env set, though in production you might want to fail closed
      console.warn('AUTHORIZED_SHORTENERS not set. Allow-listing all referers. Please set this in production.');
      return NextResponse.next();
    }
    
    const authorizedDomains = authorizedStr.split(',').map(d => d.trim().toLowerCase());
    
    let isAuthorized = false;
    
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const refHostname = refererUrl.hostname.toLowerCase();
        
        // Allow localhost for testing purposes
        if (refHostname === 'localhost') {
           isAuthorized = true;
        } else {
           isAuthorized = authorizedDomains.some(domain => refHostname === domain || refHostname.endsWith(`.${domain}`));
        }
      } catch (e) {
        console.error('Invalid referer URL', referer, e);
      }
    }
    
    if (!isAuthorized) {
      // Rewrite the request to the error page so bypassers don't see the /secure UI
      const url = request.nextUrl.clone();
      url.pathname = '/error';
      return NextResponse.rewrite(url);
    }
  }
  
  return NextResponse.next();
}

// Config to apply middleware primarily to our designated routes
export const config = {
  matcher: [
    '/secure/:path*',
  ],
};
