// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/Shared/LoadingSpinner';
import ErrorBoundary from './components/Shared/ErrorBoundary';
import './index.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Create query client with configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Toast configuration
const toastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    fontSize: 'var(--font-size-sm)',
    maxWidth: '400px',
  },
  success: {
    iconTheme: {
      primary: 'var(--color-accent-gold)',
      secondary: 'var(--color-text-inverse)',
    },
  },
  error: {
    iconTheme: {
      primary: 'var(--color-accent-red)',
      secondary: 'var(--color-text-inverse)',
    },
  },
};

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </Layout>
              <Toaster toastOptions={toastOptions} />
            </Router>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;