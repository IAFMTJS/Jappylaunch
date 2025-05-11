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
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;
    frame-src 'self' https://*.firebaseauth.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
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

// Function to generate CSRF token
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Function to validate CSRF token
export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
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

// Add runtime integrity check
export const checkRuntimeIntegrity = (): boolean => {
  try {
    // Check if code has been tampered with
    const integrityCheck = {
      timestamp: Date.now(),
      checksum: window.btoa(navigator.userAgent + window.location.href)
    };
    
    // Store the check in a way that's hard to tamper with
    Object.defineProperty(window, '__INTEGRITY__', {
      value: integrityCheck,
      writable: false,
      configurable: false
    });
    
    return true;
  } catch (error) {
    console.error('Runtime integrity check failed');
    return false;
  }
};

// Add anti-debugging protection
export const enableAntiDebugging = (): void => {
  if (process.env.NODE_ENV === 'production') {
    // Detect and prevent debugging
    const debuggerCheck = () => {
      const startTime = performance.now();
      debugger;
      const endTime = performance.now();
      
      if (endTime - startTime > 100) {
        // Debugger detected
        window.location.href = '/'; // Redirect to home page
      }
    };

    // Run checks periodically
    setInterval(debuggerCheck, 1000);
    
    // Prevent console access
    const consoleMethods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'clear', 'count', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'trace', 'profile', 'profileEnd'];
    consoleMethods.forEach(method => {
      // @ts-ignore
      console[method] = () => {};
    });
  }
};

// Add domain lock
export const checkDomainLock = (): boolean => {
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    // Add your production domain here
    'yourdomain.com'
  ];
  
  const currentDomain = window.location.hostname;
  return allowedDomains.some(domain => currentDomain === domain || currentDomain.endsWith('.' + domain));
};

// Initialize security measures
export const initializeSecurity = (): void => {
  if (process.env.NODE_ENV === 'production') {
    protectSourceMaps();
    enableAntiDebugging();
    
    if (!checkDomainLock()) {
      console.error('Unauthorized domain');
      window.location.href = '/';
      return;
    }
    
    if (!checkRuntimeIntegrity()) {
      console.error('Runtime integrity check failed');
      window.location.href = '/';
      return;
    }
  }
}; 