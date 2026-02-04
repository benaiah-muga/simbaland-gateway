import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/data/products';
import { ShoppingBag, MapPin, Truck, CreditCard, CheckCircle, Loader2, Minus, Plus, Trash2 } from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    notes: ''
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to checkout</p>
            <Button onClick={() => navigate('/shop')} className="btn-accent">
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmitOrder = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.streetAddress || !shippingInfo.city) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          shipping_address: {
            fullName: shippingInfo.fullName,
            phone: shippingInfo.phone,
            streetAddress: shippingInfo.streetAddress,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postalCode: shippingInfo.postalCode
          },
          notes: shippingInfo.notes || null,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image,
        quantity: item.quantity,
        price_at_purchase: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setOrderSuccess(true);
      toast({ title: 'Order Placed!', description: 'We will contact you shortly to confirm your order.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to place order', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We'll contact you shortly to confirm the details and arrange delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/profile')} variant="outline">
                View Orders
              </Button>
              <Button onClick={() => navigate('/shop')} className="btn-accent">
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[
              { num: 1, label: 'Cart', icon: ShoppingBag },
              { num: 2, label: 'Shipping', icon: MapPin },
              { num: 3, label: 'Confirm', icon: CreditCard }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    step >= s.num ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
                {i < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-4 ${step > s.num ? 'bg-accent' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <div className="bg-card rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-display font-bold mb-6">Your Cart</h2>
                  <div className="space-y-4">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="font-semibold text-primary mt-1">{formatPrice(product.price)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-2 bg-background rounded-lg p-1">
                            <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setStep(2)} className="btn-accent">
                      Continue to Shipping
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-card rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Shipping Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input 
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo(p => ({ ...p, fullName: e.target.value }))}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input 
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+256 700 000 000"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label>Street Address *</Label>
                      <Input 
                        value={shippingInfo.streetAddress}
                        onChange={(e) => setShippingInfo(p => ({ ...p, streetAddress: e.target.value }))}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input 
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(p => ({ ...p, city: e.target.value }))}
                        placeholder="Kampala"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State/Region</Label>
                      <Input 
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo(p => ({ ...p, state: e.target.value }))}
                        placeholder="Central"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label>Order Notes (optional)</Label>
                      <Textarea 
                        value={shippingInfo.notes}
                        onChange={(e) => setShippingInfo(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Any special instructions for delivery..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>Back to Cart</Button>
                    <Button onClick={() => setStep(3)} className="btn-accent">Review Order</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-card rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-display font-bold mb-6">Review Your Order</h2>
                  
                  <div className="mb-6 p-4 bg-muted/50 rounded-xl">
                    <h3 className="font-medium mb-2">Shipping To:</h3>
                    <p className="text-sm text-muted-foreground">
                      {shippingInfo.fullName}<br />
                      {shippingInfo.phone}<br />
                      {shippingInfo.streetAddress}<br />
                      {shippingInfo.city}{shippingInfo.state ? `, ${shippingInfo.state}` : ''}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex justify-between items-center py-2 border-b border-border">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">{formatPrice(product.price * quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>Edit Shipping</Button>
                    <Button 
                      onClick={handleSubmitOrder} 
                      disabled={isSubmitting}
                      className="btn-accent gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-display font-bold mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success">Contact for quote</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-800">
                    <strong>Payment on Delivery</strong><br />
                    Pay when you receive your order. We accept cash and mobile money.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
