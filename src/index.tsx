import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log('Application starting...');

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Root error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          border: '1px solid red', 
          borderRadius: '4px',
          backgroundColor: '#fff',
          color: '#000'
        }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  console.log('Attempting to find root element...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found in the DOM');
  }
  
  console.log('Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Rendering application...');
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Critical error during application initialization:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; margin: 20px; border: 1px solid red; border-radius: 4px; background-color: #fff; color: #000;">
      <h1>Critical Error</h1>
      <p>The application failed to initialize:</p>
      <pre style="white-space: pre-wrap;">${error instanceof Error ? error.toString() : 'Unknown error'}</pre>
      <button onclick="window.location.reload()" style="padding: 8px 16px; background-color: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
}

// Register service worker for romaji caching
if ('serviceWorker' in navigator) {
  // Wait for the page to be fully loaded
  window.addEventListener('load', () => {
    // Add a small delay to ensure the app is initialized first
    setTimeout(() => {
      console.log('Attempting to register service worker...');
      navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none'
      })
      .then(registration => {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker installed, waiting for activation');
              }
            });
          }
        });
      })
      .catch(error => {
        console.warn('ServiceWorker registration failed:', error);
        // Don't throw the error, just log it
      });
    }, 1000); // 1 second delay
  });
}

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent the default error handling
  event.preventDefault();
});

// Add unhandled rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default error handling
  event.preventDefault();
}); 