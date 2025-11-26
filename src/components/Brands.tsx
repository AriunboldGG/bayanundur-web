import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Available brands from products
const BRANDS = [
  "Swootech",
  "Nike",
  "Aegis",
  "SafePro",
  "WorkWear"
];

// Map brands to their SVG images (using existing SVGs)
const BRAND_SVG_MAP: Record<string, string> = {
  "Swootech": "/svg/brand1.svg",
  "Nike": "/svg/brand2.svg",
  "Aegis": "/svg/brand3.svg",
  "SafePro": "/svg/brand1.svg",
  "WorkWear": "/svg/brand2.svg",
};

// Default SVG if brand not found in map
const DEFAULT_BRAND_SVG = "/svg/brand3.svg";

export default function Brands() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[#1E293B] text-sm md:text-base">БРЭНД</CardTitle>
        <Link href="/products" className="text-xs text-gray-500 hover:text-[#1f632b] cursor-pointer">
          Бүгдийг Харах
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6 items-center">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/products?brand=${encodeURIComponent(brand)}`}
              className="flex items-center justify-center rounded-lg bg-white hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src={BRAND_SVG_MAP[brand] || DEFAULT_BRAND_SVG}
                alt={brand}
                width={96}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


