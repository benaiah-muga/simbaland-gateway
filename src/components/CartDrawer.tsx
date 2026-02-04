import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-foreground/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart
            <span className="text-sm font-normal text-muted-foreground">
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ height: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Your cart is empty</p>
              <p className="text-muted-foreground mb-6">Add some products to get started</p>
              <button
                onClick={onClose}
                className="btn-accent"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 p-4 bg-secondary/50 rounded-xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground line-clamp-2 text-sm mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
                    <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
                        className="p-1 rounded-md border border-border hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1 rounded-md border border-border hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="ml-auto text-sm text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-xl text-foreground">{formatPrice(totalPrice)}</span>
            </div>
            <Link 
              to="/checkout" 
              onClick={onClose}
              className="block w-full btn-accent py-4 text-center"
            >
              Proceed to Checkout
            </Link>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
