import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Performance Optimization: Lazy load pages to reduce initial bundle size
// This ensures the browser only downloads the code for the page being viewed.
const Index = lazy(() => import("./pages/Index"));
const PhoneDetail = lazy(() => import("./pages/PhoneDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure QueryClient with caching to prevent unnecessary re-fetches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      gcTime: 1000 * 60 * 30,    // Keep unused data in memory for 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Suspense handles the loading state while lazy components are being fetched */}
        <Suspense 
          fallback={
            <div className="h-screen w-full flex items-center justify-center bg-background">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/phone/:slug" element={<PhoneDetail />} />
            
            {/* Hidden Admin Route: Accessed only via /khan */}
            <Route path="/khan" element={<Admin />} />
            
            {/* Security/SEO: Redirect old /admin attempts back to home */}
            <Route path="/admin" element={<Navigate to="/" replace />} />
            
            {/* Standard Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
