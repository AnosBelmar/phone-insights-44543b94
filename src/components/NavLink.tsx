import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
];

export const NavLinks = ({ className, onClick }: { className?: string; onClick?: () => void }) => {
  const location = useLocation();

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={onClick}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === link.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
