"use client";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { getAllProducts, type Product as BackendProduct } from "@/lib/products";
import FirebaseImage from "@/components/FirebaseImage";

type ProductType = "best" | "new" | "discount" | "promo" | "suggest";

function ProductsCarousel({ productsToShow }: { productsToShow: BackendProduct[] }) {
  if (productsToShow.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Бүтээгдэхүүн олдсонгүй
      </div>
    );
  }

  return (
    <div className="relative px-8 md:px-12">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {productsToShow.map((p) => (
            <CarouselItem key={p.firestoreId || p.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Link href={`/products/${p.firestoreId || p.id}`} className="block h-full">
                <Card className="overflow-hidden hover:border-[#1f632b] transition-colors cursor-pointer h-full flex flex-col">
                  <CardContent className="p-4 flex flex-col gap-3 flex-1">
                    {/* Image */}
                    <div className="relative h-32 w-full">
                      {p.images && p.images.length > 0 ? (
                        <FirebaseImage
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-contain bg-white"
                        />
                      ) : p.img ? (
                        <FirebaseImage
                          src={p.img}
                          alt={p.name}
                          fill
                          className="object-contain bg-white"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Зураг байхгүй</span>
                        </div>
                      )}
                    </div>
                    {/* Title */}
                    <div className="text-xs text-gray-700 line-clamp-2 min-h-[32px] font-medium">
                      {p.name}
                    </div>
                    {/* Model Number */}
                    <div>
                      <div className="text-[10px] text-gray-500 font-medium">Бүтээгдэхүүний код</div>
                      <div className="text-xs font-bold text-[#1f632b]">{p.modelNumber || "N/A"}</div>
                    </div>
                    {/* Price */}
                    <div className="mt-auto">
                      <div className="text-sm font-bold text-gray-900">{p.price}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2 z-10 bg-white shadow-md hover:bg-gray-50" />
        <CarouselNext className="right-0 -translate-y-1/2 top-1/2 z-10 bg-white shadow-md hover:bg-gray-50" />
      </Carousel>
    </div>
  );
}

export default function ProductTabsSlider() {
  const [allProducts, setAllProducts] = useState<BackendProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products by productType from backend
  const filteredProducts = useMemo(() => {
    return {
      best: allProducts.filter(p => {
        // Filter by productType field from backend
        if (p.productType) {
          return p.productType.toLowerCase().includes("best") || p.productType.toLowerCase() === "bestseller";
        }
        return false;
      }).slice(0, 12),
      new: allProducts.filter(p => {
        // Filter by productType field from backend
        if (p.productType) {
          return p.productType.toLowerCase().includes("new") || p.productType.toLowerCase() === "шинэ";
        }
        // Fallback: show all
        return true;
      }).slice(0, 12),
      discount: allProducts.filter(p => {
        // Filter by productType field from backend
        if (p.productType) {
          return p.productType.toLowerCase().includes("discount") || p.productType.toLowerCase().includes("хямдрал");
        }
        // Fallback: show all
        return true;
      }).slice(0, 12),
      promo: allProducts.filter(p => {
        // Filter by productType field from backend
        if (p.productType) {
          return p.productType.toLowerCase().includes("promo") || p.productType.toLowerCase().includes("промо");
        }
        // Fallback: show all
        return true;
      }).slice(0, 12),
      suggest: allProducts.filter(p => {
        // Filter by productType field from backend
        if (p.productType) {
          return p.productType.toLowerCase().includes("suggest") || p.productType.toLowerCase().includes("санал");
        }
        // Fallback: show all
        return true;
      }).slice(0, 12),
    };
  }, [allProducts]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 shadow-sm p-4 md:p-5">
        <div className="text-center py-8 text-gray-500">Ачааллаж байна...</div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="best" className="w-full">
      <div className="rounded-xl border border-gray-200 shadow-sm p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="min-w-0 w-full overflow-x-auto sm:overflow-visible">
          <TabsList className="bg-transparent p-1 rounded-full border border-gray-200 inline-flex whitespace-nowrap gap-1">
            <TabsTrigger
              value="best"
              className="rounded-full data-[state=active]:bg-[#1f632b] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 cursor-pointer"
            >
              BEST SELLER
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="rounded-full data-[state=active]:bg-[#1f632b] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 cursor-pointer"
            >
              ШИНЭ
            </TabsTrigger>
            <TabsTrigger
              value="discount"
              className="rounded-full data-[state=active]:bg-[#1f632b] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 cursor-pointer"
            >
              ХЯМДРАЛТАЙ
            </TabsTrigger>
            <TabsTrigger
              value="promo"
              className="rounded-full data-[state=active]:bg-[#1f632b] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 cursor-pointer"
            >
              ПРОМОУШН
            </TabsTrigger>
            <TabsTrigger
              value="suggest"
              className="rounded-full data-[state=active]:bg-[#1f632b] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 cursor-pointer"
            >
              САНАЛ БОЛГОХ
            </TabsTrigger>
          </TabsList>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs self-start md:self-auto">
            <Link href="/products">Бүгдийг Харах</Link>
          </Button>
        </div>
      <TabsContent value="best">
        <ProductsCarousel productsToShow={filteredProducts.best} />
      </TabsContent>
      <TabsContent value="new">
        <ProductsCarousel productsToShow={filteredProducts.new} />
      </TabsContent>
      <TabsContent value="discount">
        <ProductsCarousel productsToShow={filteredProducts.discount} />
      </TabsContent>
      <TabsContent value="promo">
        <ProductsCarousel productsToShow={filteredProducts.promo} />
      </TabsContent>
      <TabsContent value="suggest">
        <ProductsCarousel productsToShow={filteredProducts.suggest} />
      </TabsContent>
      </div>
    </Tabs>
  );
}


