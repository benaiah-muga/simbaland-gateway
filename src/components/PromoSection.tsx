import { ArrowRight } from 'lucide-react';

const PromoSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto container-padding">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Promo Card 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-600 p-8 sm:p-10 min-h-[280px] flex flex-col justify-between group">
            <div>
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full mb-4">
                LIMITED OFFER
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-primary-foreground mb-3">
                Up to 30% Off<br />Home Appliances
              </h3>
              <p className="text-primary-foreground/70 max-w-xs">
                Transform your home with our premium collection of appliances
              </p>
            </div>
            <a
              href="/category/home-appliances"
              className="inline-flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-all"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </a>
            
            {/* Decorative elements */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-accent/10" />
            <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-accent/20" />
          </div>

          {/* Promo Card 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-8 sm:p-10 min-h-[280px] flex flex-col justify-between group">
            <div>
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-4">
                NEW ARRIVALS
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-accent-foreground mb-3">
                ZTE & nubia<br />Smartphones
              </h3>
              <p className="text-accent-foreground/80 max-w-xs">
                Experience cutting-edge technology with our latest mobile devices
              </p>
            </div>
            <a
              href="/category/zte-nubia"
              className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all"
            >
              Discover More
              <ArrowRight className="w-5 h-5" />
            </a>
            
            {/* Decorative elements */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-primary/10" />
            <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
