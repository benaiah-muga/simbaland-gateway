import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid3X3, LayoutList, X, SlidersHorizontal, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, categories, Product, formatPrice } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    searchParams.get('subcategory') ? [searchParams.get('subcategory')!] : []
  );
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [showOnSale, setShowOnSale] = useState(searchParams.get('filter') === 'sale');
  const [showNew, setShowNew] = useState(searchParams.get('filter') === 'new');
  const [showBestSeller, setShowBestSeller] = useState(searchParams.get('filter') === 'bestseller');

  const { addToCart } = useCart();
  const { toast } = useToast();
  const maxPrice = Math.max(...products.map((p) => p.price));

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      result = result.filter((p) => selectedSubcategories.includes(p.subcategory));
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter((p) => selectedRatings.some((r) => p.rating >= r));
    }

    // Status filters
    if (showOnSale) {
      result = result.filter((p) => p.isOnSale);
    }
    if (showNew) {
      result = result.filter((p) => p.isNew);
    }
    if (showBestSeller) {
      result = result.filter((p) => p.isBestSeller);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [selectedCategories, selectedSubcategories, priceRange, selectedRatings, showOnSale, showNew, showBestSeller, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setPriceRange([0, maxPrice]);
    setSelectedRatings([]);
    setShowOnSale(false);
    setShowNew(false);
    setShowBestSeller(false);
    setSearchParams({});
  };

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory) ? prev.filter((s) => s !== subcategory) : [...prev, subcategory]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedSubcategories.length +
    selectedRatings.length +
    (showOnSale ? 1 : 0) +
    (showNew ? 1 : 0) +
    (showBestSeller ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  // Get available subcategories based on selected categories
  const availableSubcategories = useMemo(() => {
    if (selectedCategories.length === 0) {
      return categories.flatMap((c) => c.subcategories);
    }
    return categories
      .filter((c) => selectedCategories.includes(c.name))
      .flatMap((c) => c.subcategories);
  }, [selectedCategories]);

  // Filter sidebar content (reused in both desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="text-base font-semibold py-2 hover:no-underline">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => toggleCategory(category.name)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Subcategories */}
      {availableSubcategories.length > 0 && (
        <Accordion type="single" collapsible defaultValue="subcategories">
          <AccordionItem value="subcategories" className="border-none">
            <AccordionTrigger className="text-base font-semibold py-2 hover:no-underline">
              Subcategories
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2 max-h-60 overflow-y-auto">
                {availableSubcategories.map((sub, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={selectedSubcategories.includes(sub)}
                      onCheckedChange={() => toggleSubcategory(sub)}
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {sub}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Price Range */}
      <Accordion type="single" collapsible defaultValue="price">
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="text-base font-semibold py-2 hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 pb-2">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={maxPrice}
                min={0}
                step={10000}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Rating */}
      <Accordion type="single" collapsible>
        <AccordionItem value="rating" className="border-none">
          <AccordionTrigger className="text-base font-semibold py-2 hover:no-underline">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={() => toggleRating(rating)}
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Status Filters */}
      <div className="space-y-3 pt-4 border-t border-border">
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox checked={showOnSale} onCheckedChange={(checked) => setShowOnSale(!!checked)} />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            On Sale
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox checked={showNew} onCheckedChange={(checked) => setShowNew(!!checked)} />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            New Arrivals
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox
            checked={showBestSeller}
            onCheckedChange={(checked) => setShowBestSeller(!!checked)}
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Best Sellers
          </span>
        </label>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 py-12 lg:py-16">
        <div className="container mx-auto container-padding text-center">
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-primary-foreground mb-3">
            Shop All Products
          </h1>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            Discover our complete range of quality products at competitive prices
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto container-padding py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-background rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount} active</Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Results Count */}
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-secondary' : 'hover:bg-secondary/50'} transition-colors`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-secondary' : 'hover:bg-secondary/50'} transition-colors`}
                  >
                    <LayoutList className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Pills */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/10"
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {selectedSubcategories.map((sub) => (
                  <Badge
                    key={sub}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/10"
                    onClick={() => toggleSubcategory(sub)}
                  >
                    {sub}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {showOnSale && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/10"
                    onClick={() => setShowOnSale(false)}
                  >
                    On Sale
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {showNew && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/10"
                    onClick={() => setShowNew(false)}
                  >
                    New Arrivals
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {showBestSeller && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/10"
                    onClick={() => setShowBestSeller(false)}
                  >
                    Best Sellers
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to find what you're looking for
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
