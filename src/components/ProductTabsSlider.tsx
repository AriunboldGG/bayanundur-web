import Image from "next/image";
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

type Product = {
  id: string;
  title: string;
  img: string;
  price: string;
  saveTag?: string;
  shipping?: string;
  status?: string;
  stockCount?: number;
};

const products: Product[] = [
  {
    id: "p1",
    title: "BOSO 2 Wireless On Ear Headphone",
    img: "/images/product1.jpg",
    price: "129.000₮",
    saveTag: "SAVE $19.00",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 10,
  },
  {
    id: "p2",
    title: "O'Pad Pro 12.9 inch M1 2023",
    img: "/images/product2.jpg",
    price: "899.000₮",
    saveTag: "SAVE $189.00",
    shipping: "Хүргэлттэй",
    status: "Захиалгаар ирнэ",
  },
  {
    id: "p3",
    title: "Xenon Mini Case 2.0 512GB",
    img: "/images/product3.jpg",
    price: "59.000₮",
    saveTag: "SAVE $5.00",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 6,
  },
];

function ProductsCarousel() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {products.map((p) => (
          <CarouselItem key={p.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
            <Card className="overflow-hidden">
              <CardContent className="p-4 flex flex-col gap-3">
                {/* Save badge */}
                {p.saveTag && (
                  <div className="self-start rounded-full bg-[#8DC63F] px-2 py-0.5 text-[10px] font-semibold text-white">
                    {p.saveTag}
                  </div>
                )}
                {/* Image */}
                <div className="relative h-32 w-full">
                  <Image src={p.img} alt={p.title} fill className="object-contain" />
                </div>
                {/* Title */}
                <div className="text-xs text-gray-700 line-clamp-2 min-h-[32px]">
                  {p.title}
                </div>
                {/* Price */}
                <div className="text-sm font-semibold text-gray-900">{p.price}</div>
                {/* Meta rows */}
                <div className="mt-1 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="rounded-md border px-2 py-1 text-gray-600">
                    {p.shipping}
                  </div>
                  <div className="rounded-md border px-2 py-1 text-gray-600">
                    {p.status}
                    {p.status?.includes("Агуулахад үлдсэн") && typeof p.stockCount === "number"
                      ? ` - ${p.stockCount}ш`
                      : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

export default function ProductTabsSlider() {
  return (
    <Tabs defaultValue="best" className="w-full">
      <div className="rounded-xl border border-gray-200 shadow-sm p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="min-w-0 w-full overflow-x-auto sm:overflow-visible">
          <TabsList className="bg-transparent p-1 rounded-full border border-gray-200 inline-flex whitespace-nowrap gap-1">
            <TabsTrigger
              value="best"
              className="rounded-full data-[state=active]:bg-[#8DC63F] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
            >
              BEST SELLER
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="rounded-full data-[state=active]:bg-[#8DC63F] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
            >
              ШИНЭ
            </TabsTrigger>
            <TabsTrigger
              value="discount"
              className="rounded-full data-[state=active]:bg-[#8DC63F] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
            >
              ХЯМДРАЛТАЙ
            </TabsTrigger>
            <TabsTrigger
              value="promo"
              className="rounded-full data-[state=active]:bg-[#8DC63F] data-[state=active]:text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
            >
              ПРОМОУШН
            </TabsTrigger>
          </TabsList>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs self-start md:self-auto">
            Бүгдийг Харах
          </Button>
        </div>
      <TabsContent value="best">
        <ProductsCarousel />
      </TabsContent>
      <TabsContent value="new">
        <ProductsCarousel />
      </TabsContent>
      <TabsContent value="discount">
        <ProductsCarousel />
      </TabsContent>
      <TabsContent value="promo">
        <ProductsCarousel />
      </TabsContent>
      </div>
    </Tabs>
  );
}


