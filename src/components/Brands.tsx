"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { getAllProducts, type Product } from "@/lib/products";
import { IconType } from "react-icons";
import { 
  FaTag, FaIndustry, FaTools, FaShieldAlt, FaHardHat,
  FaBox, FaStore, FaBuilding
} from "react-icons/fa";
import { 
  Si3M, SiAnsys, SiSiemens
} from "react-icons/si";

interface BrandItem {
  id: string;
  title: string;
  icon: IconType;
  count: number;
}

// Brand icon mapping - maps brand names to react-icons
const getBrandIcon = (brandName: string): IconType => {
  const normalized = brandName.toLowerCase().trim();
  
  // Common brand mappings
  const brandIconMap: Record<string, IconType> = {
    '3m': Si3M,
    'ansys': SiAnsys,
    'siemens': SiSiemens,
    'honeywell': FaIndustry, // Using fallback icon
    'dupont': FaBuilding, // Using fallback icon
    'microsoft': FaBuilding, // Using fallback icon
  };
  
  // Check exact match first
  if (brandIconMap[normalized]) {
    return brandIconMap[normalized];
  }
  
  // Check partial matches
  for (const [key, icon] of Object.entries(brandIconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }
  
  // Default icons based on keywords
  if (normalized.includes('safety') || normalized.includes('хамгаалалт') || normalized.includes('аюулгүй')) {
    return FaShieldAlt;
  }
  if (normalized.includes('helmet') || normalized.includes('малгай') || normalized.includes('дуулга')) {
    return FaHardHat;
  }
  if (normalized.includes('hard') || normalized.includes('hat') || normalized.includes('гувалз')) {
    return FaHardHat;
  }
  if (normalized.includes('work') || normalized.includes('ажлын') || normalized.includes('tool')) {
    return FaTools;
  }
  if (normalized.includes('industrial') || normalized.includes('үйлдвэр')) {
    return FaIndustry;
  }
  if (normalized.includes('store') || normalized.includes('дэлгүүр') || normalized.includes('shop')) {
    return FaStore;
  }
  if (normalized.includes('building') || normalized.includes('барилга')) {
    return FaBuilding;
  }
  if (normalized.includes('other') || normalized.includes('бусад')) {
    return FaBox;
  }
  
  // Default generic icon
  return FaTag;
};

export default function Brands() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Extract brands from products with counts and icons
  const brands = useMemo(() => {
    // Group products by brand
    const brandMap = new Map<string, Product[]>();
    
    allProducts.forEach((product) => {
      if (product.brand && typeof product.brand === 'string' && product.brand.trim() !== '') {
        const brandName = product.brand.trim();
        
        if (!brandMap.has(brandName)) {
          brandMap.set(brandName, []);
        }
        
        brandMap.get(brandName)!.push(product);
      }
    });

    // Convert to BrandItem array
    const brandItems: BrandItem[] = Array.from(brandMap.entries()).map(([brandName, products]) => {
      return {
        id: brandName,
        title: brandName,
        icon: getBrandIcon(brandName),
        count: products.length,
      };
    });

    // Sort alphabetically from A-Z (ascending), but keep "Бусад"/"Other" at the bottom
    brandItems.sort((a, b) => {
      const aLower = a.title.toLowerCase();
      const bLower = b.title.toLowerCase();
      
      // If a is "Бусад" or "Other", it should go to bottom
      if (aLower === "бусад" || aLower === "other" || aLower.includes("бусад") || aLower.includes("other")) {
        return 1;
      }
      // If b is "Бусад" or "Other", it should go to bottom
      if (bLower === "бусад" || bLower === "other" || bLower.includes("бусад") || bLower.includes("other")) {
        return -1;
      }
      // Otherwise, sort alphabetically
      return a.title.localeCompare(b.title, 'mn', { sensitivity: 'base' });
    });

    return brandItems;
  }, [allProducts]);

  if (isLoading) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[#1E293B] text-sm md:text-base">БРЭНД</CardTitle>
          <Link href="/products" className="text-xs text-gray-500 hover:text-[#1f632b] cursor-pointer">
            Бүгдийг Харах
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Ачааллаж байна...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[#1E293B] text-sm md:text-base">БРЭНД</CardTitle>
        <Link href="/products" className="text-xs text-gray-500 hover:text-[#1f632b] cursor-pointer">
          Бүгдийг Харах
        </Link>
      </CardHeader>
      <CardContent>
        {brands.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Брэнд олдсонгүй</div>
        ) : (
          <div className="flex flex-wrap gap-3 md:gap-4">
            {brands.map((brand) => {
              const BrandIcon = brand.icon;
              return (
                <Link
                  key={brand.id}
                  href={`/products?brand=${encodeURIComponent(brand.id)}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-[#1f632b] hover:bg-[#1f632b]/5 transition-colors cursor-pointer min-w-[140px]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1f632b]/10">
                    <BrandIcon className="h-4 w-4 text-[#1f632b]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 font-medium leading-tight">{brand.title}</span>
                    {brand.count > 0 && (
                      <span className="text-[10px] text-gray-500">{brand.count}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


