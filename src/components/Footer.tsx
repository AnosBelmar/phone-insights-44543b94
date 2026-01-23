import { Link } from "react-router-dom";
import { Smartphone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-xl">M</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">MobileHub</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted source for mobile phone prices, specifications, and AI-powered reviews.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="footer-link text-sm">Home</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link text-sm">Contact</Link>
              </li>
              <li>
                <Link to="/admin" className="footer-link text-sm">Admin Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="footer-link text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link text-sm">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                contact@mobilehub.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                San Francisco, CA
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Smartphone className="w-4 h-4 text-primary" />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} MobileHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
