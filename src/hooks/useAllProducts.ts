import { useProducts, DBProduct } from '@/hooks/useProducts';
import { Product, products as staticProducts, formatPrice } from '@/data/products';

// Convert DB product to the Product interface used by components
export const dbProductToProduct = (p: DBProduct): Product => ({
  id: p.id,
  name: p.name,
  category: p.category,
  subcategory: p.subcategory,
  price: p.price,
  originalPrice: p.original_price ?? undefined,
  image: p.image_url || '/placeholder.svg',
  rating: Number(p.rating),
  reviews: p.reviews,
  sku: p.sku,
  isNew: p.is_new,
  isOnSale: p.is_on_sale,
  isBestSeller: p.is_best_seller,
});

export const useAllProducts = () => {
  const { data: dbProducts, isLoading, error } = useProducts();

  // If DB products are available, use them; otherwise fall back to static
  const products: Product[] = dbProducts && dbProducts.length > 0
    ? dbProducts.map(dbProductToProduct)
    : staticProducts;

  return { products, isLoading, error };
};

export { formatPrice };
