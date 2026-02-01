import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';

const categoryImages: Record<string, string> = {
  'home-appliances': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'piao-piao': 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&q=80',
  'pvc': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
  'automotive': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'zte-nubia': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'
};

const CategoryShowcase = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-3">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of quality products across all categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="category-card group aspect-[4/5] sm:aspect-[3/4]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={categoryImages[category.slug] || '/placeholder.svg'}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
                <h3 className="font-display font-semibold text-base sm:text-lg lg:text-xl text-primary-foreground mb-1">
                  {category.name}
                </h3>
                <div className="flex items-center gap-1 text-primary-foreground/80 text-sm group-hover:text-accent transition-colors">
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
