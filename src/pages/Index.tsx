import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryShowcase from '@/components/CategoryShowcase';
import ProductSection from '@/components/ProductSection';
import FeaturesBar from '@/components/FeaturesBar';
import PromoSection from '@/components/PromoSection';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

const Index = () => {
  const { addToCart } = useCart();

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const recentlyAdded = products.filter((p) => p.isNew).slice(0, 8);
  const onSale = products.filter((p) => p.isOnSale).slice(0, 8);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <Header />

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
        viewAllLink="/shop?filter=bestseller"
        onAddToCart={addToCart}
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
          viewAllLink="/shop?filter=new"
          onAddToCart={addToCart}
        />
      </div>

      {/* On Sale */}
      <ProductSection
        title="On Sale"
        subtitle="Grab these deals before they're gone"
        products={onSale}
        viewAllLink="/shop?filter=sale"
        onAddToCart={addToCart}
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
    </div>
  );
};

export default Index;
