import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCcw, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { products, Product, formatPrice } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface CartItem extends Product {
  quantity: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const product = products.find((p) => p.id === id);

  // Generate gallery images (in real app, these would come from product data)
  const galleryImages = product ? [product.image, product.image, product.image, product.image] : [];

  // Get related products from same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const handleAddToCart = (productToAdd: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productToAdd.id);
      if (existing) {
        return prev.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...productToAdd, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
        <div className="container mx-auto container-padding py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-primary hover:underline">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Generate specifications based on category
  const specifications = getProductSpecifications(product);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-3">
        <div className="container mx-auto container-padding">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30">
                <img
                  src={galleryImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isOnSale && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                    NEW
                  </Badge>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & SKU */}
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : i < product.rating
                          ? 'fill-amber-400/50 text-amber-400'
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display font-bold text-3xl text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-muted-foreground leading-relaxed">
                High-quality {product.subcategory.toLowerCase()} from our {product.category} collection. 
                This product offers excellent value and reliability, backed by our satisfaction guarantee.
              </p>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 btn-primary gap-2"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>

                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="h-5 w-5" />
                </Button>

                <Button variant="outline" size="lg" className="px-4">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Free Delivery</p>
                    <p className="text-xs text-muted-foreground">On orders over UShs 100,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Warranty</p>
                    <p className="text-xs text-muted-foreground">1 Year Guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <RefreshCcw className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">30 Day Return Policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8 lg:py-12 bg-secondary/20">
        <div className="container mx-auto container-padding">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full justify-start bg-background border-b border-border rounded-none h-auto p-0 gap-0">
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <div className="bg-background rounded-xl p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Product Specifications</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-3 border-b border-border last:border-0"
                    >
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="bg-background rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display font-semibold text-lg">Customer Reviews</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-muted text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{product.rating} out of 5</span>
                      <span className="text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                  </div>
                  <Button>Write a Review</Button>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    { name: 'John K.', rating: 5, date: '2 weeks ago', comment: 'Excellent product! Works exactly as described. Fast delivery too.' },
                    { name: 'Sarah M.', rating: 4, date: '1 month ago', comment: 'Good quality for the price. Would recommend to others.' },
                    { name: 'Peter O.', rating: 5, date: '2 months ago', comment: 'Very satisfied with my purchase. Great customer service from Simbaland.' },
                  ].map((review, index) => (
                    <div key={index} className="pb-6 border-b border-border last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">{review.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{review.name}</p>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="bg-background rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-lg mb-3">Shipping Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Free delivery on orders over UShs 100,000 within Kampala</li>
                    <li>• Standard delivery: 2-5 business days</li>
                    <li>• Express delivery available for urgent orders</li>
                    <li>• Nationwide delivery across Uganda</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-3">Return Policy</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 30-day return policy for unused items</li>
                    <li>• Items must be in original packaging</li>
                    <li>• Refunds processed within 7-14 business days</li>
                    <li>• Contact customer care for return authorization</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="container mx-auto container-padding">
            <h2 className="font-display font-bold text-2xl lg:text-3xl text-foreground mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

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

// Helper function to generate specifications based on category
function getProductSpecifications(product: Product) {
  const baseSpecs = [
    { label: 'Brand', value: product.name.split(' ')[0] },
    { label: 'SKU', value: product.sku },
    { label: 'Category', value: product.category },
    { label: 'Subcategory', value: product.subcategory },
  ];

  const categorySpecs: Record<string, { label: string; value: string }[]> = {
    'Home Appliances': [
      { label: 'Voltage', value: '220-240V' },
      { label: 'Frequency', value: '50/60Hz' },
      { label: 'Warranty', value: '1 Year' },
      { label: 'Color', value: 'Silver/White' },
    ],
    'Piao Piao': [
      { label: 'Material', value: 'Premium Quality' },
      { label: 'Quantity', value: 'As Specified' },
      { label: 'Made In', value: 'Imported' },
      { label: 'Certification', value: 'ISO Certified' },
    ],
    'PVC Products': [
      { label: 'Material', value: 'High-Grade PVC' },
      { label: 'Standard', value: 'ISO 9001' },
      { label: 'Pressure Rating', value: 'Heavy Duty' },
      { label: 'Color', value: 'White/Grey' },
    ],
    'Automotive': [
      { label: 'Engine Type', value: 'Single Cylinder' },
      { label: 'Fuel Type', value: 'Petrol' },
      { label: 'Warranty', value: '2 Years' },
      { label: 'Assembly', value: 'Factory Assembled' },
    ],
    'ZTE | nubia': [
      { label: 'Network', value: '4G/5G' },
      { label: 'Display', value: 'AMOLED' },
      { label: 'Warranty', value: '1 Year' },
      { label: 'OS', value: 'Android' },
    ],
  };

  return [...baseSpecs, ...(categorySpecs[product.category] || [])];
}

export default ProductDetail;
