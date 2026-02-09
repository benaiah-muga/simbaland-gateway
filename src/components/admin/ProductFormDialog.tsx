import { useState, useEffect } from 'react';
import { DBProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductImageUpload } from './ProductImageUpload';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/products';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: DBProduct | null;
}

const initialForm = {
  name: '',
  category: '',
  subcategory: '',
  price: 0,
  original_price: null as number | null,
  image_url: null as string | null,
  sku: '',
  description: '',
  stock: 0,
  is_new: false,
  is_on_sale: false,
  is_best_seller: false,
  is_active: true,
  rating: 0,
  reviews: 0,
};

export const ProductFormDialog = ({ open, onOpenChange, product }: Props) => {
  const [form, setForm] = useState(initialForm);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { toast } = useToast();
  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        original_price: product.original_price,
        image_url: product.image_url,
        sku: product.sku,
        description: product.description || '',
        stock: product.stock,
        is_new: product.is_new,
        is_on_sale: product.is_on_sale,
        is_best_seller: product.is_best_seller,
        is_active: product.is_active,
        rating: product.rating,
        reviews: product.reviews,
      });
    } else {
      setForm(initialForm);
    }
  }, [product, open]);

  const selectedCategory = categories.find((c) => c.name === form.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: product.id, ...form });
        toast({ title: 'Product updated successfully' });
      } else {
        await createProduct.mutateAsync(form);
        toast({ title: 'Product created successfully' });
      }
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image */}
          <ProductImageUpload
            currentImageUrl={form.image_url}
            onImageChange={(url) => updateField('image_url', url)}
          />

          {/* Name & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>SKU *</Label>
              <Input
                value={form.sku}
                onChange={(e) => updateField('sku', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => {
                updateField('category', v);
                updateField('subcategory', '');
              }}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subcategory *</Label>
              <Select value={form.subcategory} onValueChange={(v) => updateField('subcategory', v)}>
                <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                <SelectContent>
                  {(selectedCategory?.subcategories || []).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price & Original Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price (UShs) *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Original Price</Label>
              <Input
                type="number"
                value={form.original_price || ''}
                onChange={(e) => updateField('original_price', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock *</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => updateField('stock', Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: 'is_active', label: 'Active' },
              { key: 'is_new', label: 'New' },
              { key: 'is_on_sale', label: 'On Sale' },
              { key: 'is_best_seller', label: 'Best Seller' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <Switch
                  checked={form[key as keyof typeof form] as boolean}
                  onCheckedChange={(v) => updateField(key, v)}
                />
                <Label className="text-sm">{label}</Label>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-amber-600 text-accent-foreground"
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {createProduct.isPending || updateProduct.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
