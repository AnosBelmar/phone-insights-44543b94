import React from "react";
import { Link } from "react-router-dom";
import { NavLinks } from "./NavLinks";
import { Smartphone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <Smartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Phone<span className="text-primary">Insights</span>
            </span>
          </Link>

          {/* Desktop Navigation - Uses NavLinks, no Admin here */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {/* NavLinks handles mobile clicks via the list we cleaned earlier */}
                  <NavLinks className="flex-col items-start gap-4" />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - No Admin button here either */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Phone Insights</h3>
              <p className="text-sm text-muted-foreground">
                The ultimate guide for mobile prices and specs in Pakistan. 
                AI-powered recommendations for your next upgrade.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <nav className="flex flex-col gap-2">
                <NavLinks className="flex-col items-start gap-2" />
              </nav>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Contact us for collaborations or queries regarding mobile data.
              </p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Phone Insights Pakistan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
