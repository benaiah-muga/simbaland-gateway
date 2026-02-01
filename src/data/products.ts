import refrigeratorImg from '@/assets/products/refrigerator.jpg';
import washingMachineImg from '@/assets/products/washing-machine.jpg';
import airConditionerImg from '@/assets/products/air-conditioner.jpg';
import blenderImg from '@/assets/products/blender.jpg';
import toiletPaperImg from '@/assets/products/toilet-paper.jpg';
import babyDiapersImg from '@/assets/products/baby-diapers.jpg';
import tissueBoxImg from '@/assets/products/tissue-box.jpg';
import pvcPipeImg from '@/assets/products/pvc-pipe.jpg';
import rainGutterImg from '@/assets/products/rain-gutter.jpg';
import electricalConduitImg from '@/assets/products/electrical-conduit.jpg';
import motorbikeBoxerImg from '@/assets/products/motorbike-boxer.jpg';
import motorbikeTvsImg from '@/assets/products/motorbike-tvs.jpg';
import helmetImg from '@/assets/products/helmet.jpg';
import smartphoneZteImg from '@/assets/products/smartphone-zte.jpg';
import smartphoneNubiaImg from '@/assets/products/smartphone-nubia.jpg';
import powerBankImg from '@/assets/products/power-bank.jpg';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  sku: string;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Home Appliances',
    slug: 'home-appliances',
    image: refrigeratorImg,
    subcategories: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves', 'Blenders', 'Electric Kettles']
  },
  {
    id: '2',
    name: 'Piao Piao',
    slug: 'piao-piao',
    image: toiletPaperImg,
    subcategories: ['Toilet Paper', 'Baby Diapers', 'Adult Diapers', 'Tissue Boxes', 'Wet Wipes']
  },
  {
    id: '3',
    name: 'PVC Products',
    slug: 'pvc',
    image: pvcPipeImg,
    subcategories: ['PVC Pipes', 'PVC Fittings', 'PVC Sheets', 'Rain Gutters', 'Electrical Conduits']
  },
  {
    id: '4',
    name: 'Automotive',
    slug: 'automotive',
    image: motorbikeBoxerImg,
    subcategories: ['Motorbikes', 'Spare Parts', 'Accessories', 'Helmets', 'Lubricants']
  },
  {
    id: '5',
    name: 'ZTE | nubia',
    slug: 'zte-nubia',
    image: smartphoneZteImg,
    subcategories: ['Smartphones', 'Tablets', 'Accessories', 'Power Banks', 'Earphones']
  }
];

export const products: Product[] = [
  // Home Appliances
  {
    id: '1',
    name: 'Hisense 250L Double Door Refrigerator',
    category: 'Home Appliances',
    subcategory: 'Refrigerators',
    price: 1850000,
    originalPrice: 2100000,
    image: refrigeratorImg,
    rating: 4.5,
    reviews: 128,
    sku: 'HA-REF-001',
    isOnSale: true,
    isBestSeller: true
  },
  {
    id: '2',
    name: 'LG 8kg Front Load Washing Machine',
    category: 'Home Appliances',
    subcategory: 'Washing Machines',
    price: 2450000,
    image: washingMachineImg,
    rating: 4.8,
    reviews: 89,
    sku: 'HA-WM-002',
    isBestSeller: true
  },
  {
    id: '3',
    name: 'Midea Split Air Conditioner 1.5HP',
    category: 'Home Appliances',
    subcategory: 'Air Conditioners',
    price: 1650000,
    originalPrice: 1800000,
    image: airConditionerImg,
    rating: 4.3,
    reviews: 67,
    sku: 'HA-AC-003',
    isOnSale: true
  },
  {
    id: '4',
    name: 'Saachi Electric Blender 1.5L',
    category: 'Home Appliances',
    subcategory: 'Blenders',
    price: 185000,
    image: blenderImg,
    rating: 4.2,
    reviews: 45,
    sku: 'HA-BL-004',
    isNew: true
  },
  // Piao Piao Products
  {
    id: '5',
    name: 'Piao Piao Premium Toilet Paper 12 Rolls',
    category: 'Piao Piao',
    subcategory: 'Toilet Paper',
    price: 28000,
    originalPrice: 32000,
    image: toiletPaperImg,
    rating: 4.6,
    reviews: 234,
    sku: 'PP-TP-001',
    isOnSale: true,
    isBestSeller: true
  },
  {
    id: '6',
    name: 'Piao Piao Baby Diapers Large (50pcs)',
    category: 'Piao Piao',
    subcategory: 'Baby Diapers',
    price: 65000,
    image: babyDiapersImg,
    rating: 4.7,
    reviews: 189,
    sku: 'PP-BD-002',
    isBestSeller: true
  },
  {
    id: '7',
    name: 'Piao Piao Facial Tissue Box (3 Pack)',
    category: 'Piao Piao',
    subcategory: 'Tissue Boxes',
    price: 18000,
    image: tissueBoxImg,
    rating: 4.4,
    reviews: 98,
    sku: 'PP-TB-003',
    isNew: true
  },
  // PVC Products
  {
    id: '8',
    name: 'PVC Pipe 4 inch (3m Length)',
    category: 'PVC Products',
    subcategory: 'PVC Pipes',
    price: 45000,
    image: pvcPipeImg,
    rating: 4.5,
    reviews: 56,
    sku: 'PVC-PP-001',
    isBestSeller: true
  },
  {
    id: '9',
    name: 'PVC Rain Gutter Complete Set',
    category: 'PVC Products',
    subcategory: 'Rain Gutters',
    price: 180000,
    originalPrice: 210000,
    image: rainGutterImg,
    rating: 4.3,
    reviews: 34,
    sku: 'PVC-RG-002',
    isOnSale: true
  },
  {
    id: '10',
    name: 'PVC Electrical Conduit 20mm',
    category: 'PVC Products',
    subcategory: 'Electrical Conduits',
    price: 8500,
    image: electricalConduitImg,
    rating: 4.6,
    reviews: 78,
    sku: 'PVC-EC-003',
    isNew: true
  },
  // Automotive
  {
    id: '11',
    name: 'Boxer 150cc Motorbike',
    category: 'Automotive',
    subcategory: 'Motorbikes',
    price: 4500000,
    originalPrice: 4800000,
    image: motorbikeBoxerImg,
    rating: 4.7,
    reviews: 156,
    sku: 'AUTO-MB-001',
    isOnSale: true,
    isBestSeller: true
  },
  {
    id: '12',
    name: 'TVS Apache RTR 160',
    category: 'Automotive',
    subcategory: 'Motorbikes',
    price: 5200000,
    image: motorbikeTvsImg,
    rating: 4.8,
    reviews: 203,
    sku: 'AUTO-MB-002',
    isBestSeller: true
  },
  {
    id: '13',
    name: 'Premium Safety Helmet',
    category: 'Automotive',
    subcategory: 'Helmets',
    price: 85000,
    image: helmetImg,
    rating: 4.4,
    reviews: 112,
    sku: 'AUTO-HM-003',
    isNew: true
  },
  // ZTE | nubia
  {
    id: '14',
    name: 'ZTE Blade A73 5G Smartphone',
    category: 'ZTE | nubia',
    subcategory: 'Smartphones',
    price: 850000,
    originalPrice: 950000,
    image: smartphoneZteImg,
    rating: 4.5,
    reviews: 167,
    sku: 'ZTE-SP-001',
    isOnSale: true,
    isBestSeller: true
  },
  {
    id: '15',
    name: 'nubia Z60 Ultra Gaming Phone',
    category: 'ZTE | nubia',
    subcategory: 'Smartphones',
    price: 2800000,
    image: smartphoneNubiaImg,
    rating: 4.9,
    reviews: 89,
    sku: 'NUB-SP-002',
    isNew: true,
    isBestSeller: true
  },
  {
    id: '16',
    name: 'ZTE 10000mAh Power Bank',
    category: 'ZTE | nubia',
    subcategory: 'Power Banks',
    price: 95000,
    image: powerBankImg,
    rating: 4.3,
    reviews: 78,
    sku: 'ZTE-PB-003',
    isNew: true
  }
];

export const formatPrice = (price: number): string => {
  return `UShs ${price.toLocaleString()}`;
};
