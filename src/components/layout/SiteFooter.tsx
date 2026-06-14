import { Link } from "react-router-dom";
import { Mail, Phone, Linkedin, Facebook, Instagram, ShieldCheck } from "lucide-react";

export const SiteFooter = () => {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
              <span className="font-display font-bold text-primary text-sm">KM</span>
            </div>
            <div>
              <div className="font-display text-lg">KM</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">Financing</div>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
            Independent finance brokers helping families and investors secure smarter home finance.
          </p>
          <div className="flex gap-3 mt-5">
            {[Linkedin, Facebook, Instagram].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="h-9 w-9 rounded-md border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-accent mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm text-primary-foreground/75">
            <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
            <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
            <li><Link to="/calculators" className="hover:text-accent transition-colors">Calculators</Link></li>
            <li><Link to="/resources" className="hover:text-accent transition-colors">Resources</Link></li>
            <li><Link to="/testimonials" className="hover:text-accent transition-colors">Testimonials</Link></li>
            <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-accent mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/75">
            <li className="flex items-start gap-2.5"><Phone className="h-4 w-4 mt-0.5 text-accent" /> 0410 391 183</li>
            <li className="flex items-start gap-2.5"><Mail className="h-4 w-4 mt-0.5 text-accent" /> info@kmfinacing.com</li>

          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-accent mb-4">Compliance</h4>
          <div className="flex items-start gap-3 mb-4">
            <ShieldCheck className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-primary-foreground/70 leading-relaxed">
              Meridian Mortgage Pty Ltd · Credit Representative #482910 authorised under Australian Credit Licence #389328.
            </p>
          </div>
          <p className="text-xs text-primary-foreground/55 leading-relaxed">
            Information on this site is general in nature and does not consider your personal circumstances. Lending criteria, fees and conditions apply. Subject to lender approval.
          </p>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/55">
          <div>© {new Date().getFullYear()} KM Financing. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Credit Guide</a>
            <a href="#" className="hover:text-accent">Complaints</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
