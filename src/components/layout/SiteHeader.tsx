import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/calculators", label: "Calculators" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/resources", label: "Resources" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm" : "bg-background/0 border-b border-transparent",
      )}
    >
      <div className="container-wide flex h-16 lg:h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="h-9 w-9 rounded-lg bg-gradient-hero flex items-center justify-center shadow-md">
              <span className="font-display text-accent font-bold text-lg leading-none">M</span>
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold text-base tracking-tight">Meridian</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground -mt-0.5">Mortgage</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "text-accent" : "text-foreground/75 hover:text-foreground hover:bg-secondary",
              )}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:1300000000" className="hidden xl:flex items-center gap-2 text-sm text-foreground/75 hover:text-foreground transition-colors">
            <Phone className="h-4 w-4" /> 1300 000 000
          </a>
          <Button asChild variant="gold" size="sm">
            <Link to="/book">Book Appointment</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container-wide py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => cn(
                  "px-3 py-3 text-sm font-medium rounded-md",
                  isActive ? "text-accent bg-secondary" : "text-foreground/80 hover:bg-secondary",
                )}
              >
                {l.label}
              </NavLink>
            ))}
            <Button asChild variant="gold" className="mt-3">
              <Link to="/book">Book Appointment</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
