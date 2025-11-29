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

type Product = {
  id: string;
  title: string;
  img: string;
  price: string;
  modelNumber: string;
  saveTag?: string;
  shipping?: string;
  status?: string;
  stockCount?: number;
};

const products: Product[] = [
  {
    id: "1",
    title: "BOSO 2 Wireless On Ear Headphone",
    img: "/images/product1.jpg",
    price: "129.000₮",
    modelNumber: "MC375xx/A",
    saveTag: "SAVE 19.000₮",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 10,
  },
  {
    id: "2",
    title: "O'Pad Pro 12.9 inch M1 2023",
    img: "/images/product2.jpg",
    price: "899.000₮",
    modelNumber: "SP376xx/B",
    saveTag: "SAVE 189.000₮",
    shipping: "Хүргэлттэй",
    status: "Захиалгаар ирнэ",
  },
  {
    id: "3",
    title: "Xenon Mini Case 2.0 512GB",
    img: "/images/product3.jpg",
    price: "59.000₮",
    modelNumber: "WP377xx/C",
      saveTag: "SAVE 5.000₮",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 6,
  },
];

const suggestedProducts: Product[] = [
  {
    id: "4",
    title: "Өвлийн бээлий",
    img: "/images/prod1.jpg",
    price: "45.000₮",
    modelNumber: "RS378xx/D",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 15,
  },
  {
    id: "5",
    title: "Амь олс",
    img: "/images/prod2.jpg",
    price: "120.000₮",
    modelNumber: "AE379xx/E",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 8,
  },
  {
    id: "6",
    title: "Хамгаалалтын нүдний шил",
    img: "/images/prod3.jpg",
    price: "25.000₮",
    modelNumber: "MC380xx/F",
    saveTag: "ШИНЭ",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 20,
  },
  {
    id: "7",
    title: "Өндрийн олс",
    img: "/images/prod4.jpg",
    price: "85.000₮",
    modelNumber: "SP381xx/G",
    shipping: "Хүргэлттэй",
    status: "Захиалгаар ирнэ",
  },
  {
    id: "8",
    title: "Хамгаалалтын малгай",
    img: "/images/product1.jpg",
    price: "35.000₮",
    modelNumber: "WP382xx/H",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 12,
  },
  {
    id: "9",
    title: "Ажлын бээлий",
    img: "/images/product2.jpg",
    price: "28.000₮",
    modelNumber: "RS383xx/A",
    shipping: "Хүргэлттэй",
    status: "Агуулахад үлдсэн",
    stockCount: 25,
  },
];

function ProductsCarousel({ productsToShow = products }: { productsToShow?: Product[] }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {productsToShow.map((p) => (
          <CarouselItem key={p.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
            <Link href={`/products/${p.id}`} className="block">
              <Card className="overflow-hidden hover:border-[#1f632b] transition-colors cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col gap-3">
                  {/* Save badge */}
                  {p.saveTag && (
                    <div className="self-start rounded-full bg-[#1f632b] px-2 py-0.5 text-[10px] font-semibold text-white">
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
                  {/* Model Number */}
                  <div>
                    <div className="text-[10px] text-gray-500">Бүтээгдэхүүний код</div>
                    <div className="text-xs font-semibold text-[#1f632b]">{p.modelNumber}</div>
                  </div>
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
            </Link>
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
      <TabsContent value="suggest">
        <ProductsCarousel productsToShow={suggestedProducts} />
      </TabsContent>
      </div>
    </Tabs>
  );
}


