import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/data/products';
import { User, Package, MapPin, LogOut, Loader2, Edit2, Save, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_address: any;
}

const Profile = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data);
    }
    setLoadingOrders(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await updateProfile(formData);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Profile updated successfully' });
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Signed out', description: 'You have been signed out successfully' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-cyan-100 text-cyan-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-display font-bold">{profile?.full_name || 'User'}</h1>
                <p className="text-muted-foreground">{profile?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button 
              variant={activeTab === 'profile' ? 'default' : 'outline'}
              onClick={() => setActiveTab('profile')}
              className="gap-2"
            >
              <User className="w-4 h-4" /> Profile
            </Button>
            <Button 
              variant={activeTab === 'orders' ? 'default' : 'outline'}
              onClick={() => setActiveTab('orders')}
              className="gap-2"
            >
              <Package className="w-4 h-4" /> Orders
            </Button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-bold">Personal Information</h2>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit2 className="w-4 h-4" /> Edit
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </Button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="+256 700 000 000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-display font-bold mb-6">Order History</h2>
              
              {loadingOrders ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="font-medium mt-1">Order #{order.id.slice(0, 8)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {order.shipping_address?.city || 'N/A'}
                        </div>
                        <p className="font-bold text-primary">{formatPrice(Number(order.total_amount))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
