import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronDown, Phone, MapPin, User } from 'lucide-react';
import { categories } from '@/data/products';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartDrawer from './CartDrawer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="container mx-auto container-padding flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+256789919494" className="hidden sm:flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="w-3 h-3" />
              <span>+256 789 919 494</span>
            </a>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Seeta, Goma Mukono</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm">Free delivery on orders over UShs 200,000</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto container-padding py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-primary">
                SIMBALAND
                <span className="text-accent">.</span>
              </h1>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent rounded-md text-accent-foreground hover:bg-amber-600 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Account */}
              <Link
                to={user ? "/profile" : "/auth"}
                className="p-2 sm:p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-accent text-accent-foreground text-xs font-bold rounded-full">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 sm:p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent rounded-md text-accent-foreground">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:block border-t border-border">
          <div className="container mx-auto container-padding">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  to="/"
                  className="block px-4 py-3 font-medium text-foreground hover:text-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="relative mega-menu-trigger"
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    className={cn(
                      "flex items-center gap-1 px-4 py-3 font-medium transition-colors",
                      activeCategory === category.id ? "text-accent" : "text-foreground hover:text-accent"
                    )}
                  >
                    {category.name}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      activeCategory === category.id && "rotate-180"
                    )} />
                  </Link>
                  
                  {/* Mega Menu */}
                  <div className="mega-menu">
                    <div className="container mx-auto container-padding py-6">
                      <div className="grid grid-cols-4 gap-8">
                        <div className="col-span-3">
                          <h3 className="font-display font-semibold text-lg mb-4 text-primary">
                            {category.name}
                          </h3>
                          <div className="grid grid-cols-3 gap-4">
                            {category.subcategories.map((sub, idx) => (
                              <Link
                                key={idx}
                                to={`/shop?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                                className="block p-3 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        </div>
                        <Link 
                          to={`/shop?category=${encodeURIComponent(category.name)}`}
                          className="bg-secondary rounded-xl p-4 hover:bg-secondary/80 transition-colors"
                        >
                          <p className="text-sm text-muted-foreground mb-2">Featured</p>
                          <p className="font-semibold text-foreground">Shop {category.name}</p>
                          <p className="text-sm text-accent mt-2">View all products →</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              <li>
                <Link
                  to="/shop"
                  className="block px-4 py-3 font-medium text-foreground hover:text-accent transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block px-4 py-3 font-medium text-foreground hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 top-[120px] bg-card z-40 transform transition-transform duration-300",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container mx-auto container-padding py-6">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="block px-4 py-3 font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <details className="group">
                  <summary className="flex items-center justify-between px-4 py-3 font-medium text-foreground hover:bg-secondary rounded-lg cursor-pointer transition-colors">
                    {category.name}
                    <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                  </summary>
                  <ul className="ml-4 mt-2 space-y-1">
                    {category.subcategories.map((sub, idx) => (
                      <li key={idx}>
                        <Link
                          to={`/shop?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
            <li>
              <Link
                to="/shop"
                className="block px-4 py-3 font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop All
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block px-4 py-3 font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
