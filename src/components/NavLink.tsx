import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Optimized: Static array outside the component prevents re-creation on every render
const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
];

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
}

export const NavLinks = ({ className, onClick }: NavLinksProps) => {
  const location = useLocation();

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {links.map((link) => {
        const isActive = location.pathname === link.href;
        
        return (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClick}
            className={cn(
              "text-sm font-medium transition-all duration-200 hover:text-primary relative py-1",
              isActive 
                ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full" 
                : "text-muted-foreground"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;
