import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'On orders over UShs 200,000'
  },
  {
    icon: Shield,
    title: 'Warranty Covered',
    description: 'All products guaranteed'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer care'
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Mobile money & cards'
  }
];

const FeaturesBar = () => {
  return (
    <section className="py-8 sm:py-12 bg-secondary/50 border-y border-border">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
