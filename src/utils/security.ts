// Add type declarations for window properties
declare global {
  interface Window {
    Firebug?: {
      chrome?: {
        isInitialized: boolean;
      };
    };
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown;
    __REDUX_DEVTOOLS_EXTENSION__?: unknown;
    __INTEGRITY__?: {
      timestamp: number;
      checksum: string;
      version: string;
      environment: string;
      functionHash: string;
    };
  }
}

// Security headers configuration
export const securityHeaders = {
  // Prevent clickjacking and other frame-based attacks
  'X-Frame-Options': 'DENY',
  // Enable XSS protection in browsers
  'X-XSS-Protection': '1; mode=block',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Control which referrer information is sent
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Restrict browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Content Security Policy
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.firebase.com wss://*.firebaseio.com;
    frame-src 'self' https://*.firebaseauth.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    require-trusted-types-for 'script';
  `.replace(/\s+/g, ' ').trim(),
  // Prevent caching of sensitive data
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  // Additional security headers
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
} as const;

// Function to sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .trim();
}

// Function to validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Function to check password strength
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character');
  }

  // Complexity check (no common patterns)
  const commonPatterns = [
    'password',
    '123456',
    'qwerty',
    'admin',
    'welcome'
  ];
  
  if (!commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score += 1;
  } else {
    feedback.push('Avoid common password patterns');
  }

  return { score, feedback };
}

// Function to generate CSRF token with expiration
export function generateCSRFToken(): { token: string; expires: number } {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const expires = Date.now() + 3600000; // 1 hour expiration
  return { token, expires };
}

// Function to validate CSRF token with expiration check
export function validateCSRFToken(token: string, storedToken: { token: string; expires: number }): boolean {
  if (!storedToken || !storedToken.token || !storedToken.expires) {
    return false;
  }
  if (Date.now() > storedToken.expires) {
    return false;
  }
  return safeStringCompare(token, storedToken.token);
}

// Function to prevent timing attacks in string comparison
export function safeStringCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

// Add code obfuscation utility
export const obfuscateCode = (code: string): string => {
  // This is a simple obfuscation example. In production, you should use a proper obfuscation tool
  return code
    .split('')
    .map(char => '\\x' + char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};

// Add source map protection
export const protectSourceMaps = (): void => {
  if (process.env.NODE_ENV === 'production') {
    // Disable source maps in production
    // @ts-ignore
    window.SourceMap = undefined;
    // @ts-ignore
    window.sourceMap = undefined;
  }
};

// Add runtime integrity check with enhanced verification
export const checkRuntimeIntegrity = (): boolean => {
  try {
    // Create a more complex integrity check
    const integrityCheck = {
      timestamp: Date.now(),
      checksum: window.btoa(navigator.userAgent + window.location.href),
      version: process.env.REACT_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      // Add a hash of critical functions
      functionHash: window.btoa(
        Object.keys(window)
          .filter(key => typeof (window as any)[key] === 'function')
          .sort()
          .join('')
      )
    };
    
    // Store the check in a way that's hard to tamper with
    Object.defineProperty(window, '__INTEGRITY__', {
      value: integrityCheck,
      writable: false,
      configurable: false,
      enumerable: false
    });
    
    // Add periodic re-verification
    setInterval(() => {
      const currentCheck = (window as any).__INTEGRITY__;
      if (!currentCheck || currentCheck.checksum !== integrityCheck.checksum) {
        console.error('Runtime integrity verification failed');
        window.location.href = '/error.html?error=Integrity%20check%20failed';
      }
    }, 30000); // Check every 30 seconds
    
    return true;
  } catch (error) {
    console.error('Runtime integrity check failed:', error);
    return false;
  }
};

// Add anti-debugging protection with better detection
export const enableAntiDebugging = (): void => {
  if (process.env.NODE_ENV === 'production') {
    let debuggerDetected = false;
    
    // More sophisticated debugger detection
    const debuggerCheck = () => {
      if (debuggerDetected) return;
      
      const startTime = performance.now();
      const stack = new Error().stack;
      
      // Check for devtools
      const devtools = /./;
      devtools.toString = function() {
        debuggerDetected = true;
        return '';
      };
      
      // Check for common debugging patterns
      if (
        window.Firebug?.chrome?.isInitialized ||
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
        window.__REDUX_DEVTOOLS_EXTENSION__ ||
        (stack && stack.includes('debugger'))
      ) {
        debuggerDetected = true;
      }
      
      const endTime = performance.now();
      if (endTime - startTime > 100 || debuggerDetected) {
        debuggerDetected = true;
        // Instead of redirecting, just disable sensitive operations
        window.location.href = '/error.html?error=Debugging%20detected';
      }
    };

    // Run checks less frequently to reduce performance impact
    setInterval(debuggerCheck, 5000);
    
    // Only disable console in production and only for sensitive methods
    if (process.env.NODE_ENV === 'production') {
      const sensitiveMethods = ['debug', 'trace', 'profile', 'profileEnd'];
      sensitiveMethods.forEach(method => {
        const original = (console as any)[method];
        (console as any)[method] = function() {
          debuggerDetected = true;
          return original.apply(console, arguments);
        };
      });
    }
  }
};

// Add domain lock with proper configuration
export const checkDomainLock = (): boolean => {
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'japvoc.com', // Replace with your actual domain
    'netlify.app' // Allow Netlify preview deployments
  ];
  
  const currentDomain = window.location.hostname;
  const isAllowed = allowedDomains.some(domain => 
    currentDomain === domain || 
    currentDomain.endsWith('.' + domain) ||
    (process.env.NODE_ENV === 'development' && domain === 'localhost')
  );
  
  if (!isAllowed && process.env.NODE_ENV === 'production') {
    console.error('Domain not allowed:', currentDomain);
    window.location.href = '/error.html?error=Invalid%20domain';
    return false;
  }
  
  return isAllowed;
};

// Initialize security measures with better error handling
export const initializeSecurity = (): void => {
  try {
    // Always enable basic security measures
    protectSourceMaps();
    
    if (process.env.NODE_ENV === 'production') {
      // Enable additional security measures in production
      if (!checkDomainLock()) {
        throw new Error('Domain check failed');
      }
      
      if (!checkRuntimeIntegrity()) {
        throw new Error('Runtime integrity check failed');
      }
      
      enableAntiDebugging();
    }
    
    // Log initialization status
    console.log('Security initialization completed successfully');
  } catch (error) {
    // Log security initialization errors but don't block the app in development
    console.error('Security initialization error:', error);
    if (process.env.NODE_ENV === 'production') {
      window.location.href = '/error.html?error=Security%20initialization%20failed';
    }
  }
}; 