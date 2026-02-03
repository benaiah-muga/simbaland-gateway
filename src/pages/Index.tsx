import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryShowcase from '@/components/CategoryShowcase';
import ProductSection from '@/components/ProductSection';
import FeaturesBar from '@/components/FeaturesBar';
import PromoSection from '@/components/PromoSection';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { products, Product } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const recentlyAdded = products.filter((p) => p.isNew).slice(0, 8);
  const onSale = products.filter((p) => p.isOnSale).slice(0, 8);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Bar */}
      <FeaturesBar />

      {/* Categories */}
      <CategoryShowcase />

      {/* Best Sellers */}
      <ProductSection
        title="Best Sellers"
        subtitle="Our most popular products loved by customers"
        products={bestSellers}
        viewAllLink="/products?filter=bestseller"
        onAddToCart={handleAddToCart}
        showFilters
      />

      {/* Promo Section */}
      <PromoSection />

      {/* Recently Added */}
      <div className="bg-secondary/30">
        <ProductSection
          title="Recently Added"
          subtitle="Check out the latest additions to our collection"
          products={recentlyAdded}
          viewAllLink="/products?filter=new"
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* On Sale */}
      <ProductSection
        title="On Sale"
        subtitle="Grab these deals before they're gone"
        products={onSale}
        viewAllLink="/products?filter=sale"
        onAddToCart={handleAddToCart}
      />

      {/* Newsletter Section */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto container-padding text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-primary-foreground mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Stay updated with our latest products, exclusive offers, and special discounts
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="btn-accent whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;
