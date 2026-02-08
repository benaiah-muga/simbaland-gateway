import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminProducts } from '@/hooks/useProducts';
import { Package, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/data/products';

const AdminDashboard = () => {
  const { data: products, isLoading } = useAdminProducts();

  const totalProducts = products?.length ?? 0;
  const activeProducts = products?.filter((p) => p.is_active).length ?? 0;
  const lowStock = products?.filter((p) => p.stock < 10).length ?? 0;
  const totalValue = products?.reduce((sum, p) => sum + p.price * p.stock, 0) ?? 0;

  const stats = [
    { title: 'Total Products', value: totalProducts, icon: Package, color: 'bg-primary' },
    { title: 'Active Listings', value: activeProducts, icon: CheckCircle, color: 'bg-success' },
    { title: 'Low Stock Items', value: lowStock, icon: AlertTriangle, color: 'bg-amber-500' },
    { title: 'Inventory Value', value: formatPrice(totalValue), icon: TrendingUp, color: 'bg-navy-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your store</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`h-9 w-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent products */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : (
              <div className="space-y-3">
                {products?.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-10 w-10 rounded-lg object-cover bg-secondary" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
                      <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
