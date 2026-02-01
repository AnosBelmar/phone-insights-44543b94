import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Phone Insights</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted source for mobile specifications and AI-powered reviews in Pakistan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <p className="text-sm text-muted-foreground">
                Email: info@phone-insights-x.app
              </p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Phone Insights. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
