import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Smartphone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

// Clean links array - Admin is removed
const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
];

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const NavItems = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <div className={cn("flex items-center gap-6", className)}>
      {navigationLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={onClick}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === link.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavItems />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavItems className="flex-col items-start gap-4" />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="border-t border-border bg-muted/30 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Phone Insights</h3>
              <p className="text-sm text-muted-foreground">Expert mobile specs and AI reviews for Pakistan.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <NavItems className="flex-col items-start gap-2" />
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">info@phone-insights-x.app</p>
            </div>
          </div>
          <div className="text-center pt-8 mt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Phone Insights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
