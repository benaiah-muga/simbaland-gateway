import { useState } from 'react';
import { ChevronRight, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/data/products';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  onAddToCart?: (product: Product) => void;
  showFilters?: boolean;
}

const ProductSection = ({
  title,
  subtitle,
  products,
  viewAllLink,
  onAddToCart,
  showFilters = false
}: ProductSectionProps) => {
  const [sortBy, setSortBy] = useState('featured');

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return a.isNew ? -1 : 1;
      default:
        return 0;
    }
  });

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {showFilters && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            )}
            
            {viewAllLink && (
              <a
                href={viewAllLink}
                className="flex items-center gap-1 text-accent font-medium hover:gap-2 transition-all"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
