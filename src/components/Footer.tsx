import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto container-padding py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <h3 className="font-display font-bold text-2xl mb-6">
              SIMBALAND<span className="text-accent">.</span>
            </h3>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed">
              Your trusted partner for quality home appliances, automotive products, and mobile devices in Uganda.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home Appliances', 'Piao Piao Products', 'PVC Products', 'Automotive', 'ZTE | nubia'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Customer Care</h4>
            <ul className="space-y-3">
              {[
                'Track Your Order',
                'Shipping & Delivery',
                'Returns & Refunds',
                'Payment Methods',
                'FAQ',
                'Privacy Policy',
                'Terms & Conditions'
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70">
                  Seeta, Goma Mukono<br />
                  Uganda
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="text-primary-foreground/70">
                  <a href="tel:+256789919494" className="block hover:text-accent transition-colors">
                    +256 789 919 494
                  </a>
                  <a href="tel:+256705888858" className="block hover:text-accent transition-colors">
                    +256 705 888 858
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:info@simbaland.co.ug" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  info@simbaland.co.ug
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70">
                  Mon - Sat: 8:00 AM - 6:00 PM<br />
                  Sunday: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto container-padding py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 Simbaland Industries Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-accent transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
