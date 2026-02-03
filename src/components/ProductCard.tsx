import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, formatPrice } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  variant?: 'default' | 'horizontal';
}

const ProductCard = ({ product, onAddToCart, variant = 'default' }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (variant === 'horizontal') {
    return (
      <div className="product-card group flex flex-row overflow-hidden">
        {/* Image Container */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {product.isOnSale && discount > 0 && (
            <span className="badge-sale">-{discount}%</span>
          )}
          {product.isNew && !product.isOnSale && (
            <span className="badge-new">NEW</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating)
                        ? "fill-amber-500 text-amber-500"
                        : "fill-border text-border"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xl text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart?.(product)}
                className="btn-accent text-sm py-2 px-4"
              >
                Add to Cart
              </button>
              <Link
                to={`/product/${product.id}`}
                className="py-2 px-4 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card group">
      {/* Image Container */}
      <div className="product-card-image aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Badges */}
        {product.isOnSale && discount > 0 && (
          <span className="badge-sale">-{discount}%</span>
        )}
        {product.isNew && !product.isOnSale && (
          <span className="badge-new">NEW</span>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
          <button
            onClick={() => onAddToCart?.(product)}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 btn-accent text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 min-h-[48px] group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < Math.floor(product.rating)
                    ? "fill-amber-500 text-amber-500"
                    : "fill-border text-border"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* SKU */}
        <p className="text-xs text-muted-foreground mb-3">
          SKU: {product.sku}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="price-current text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="price-old">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/product/${product.id}`}
          className="block w-full text-center py-2.5 px-4 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
