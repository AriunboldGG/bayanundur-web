import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BRAND_SVGS = [
  "/svg/brand1.svg",
  "/svg/brand2.svg",
  "/svg/brand3.svg",
  "/svg/brand1.svg",
  "/svg/brand2.svg",
  "/svg/brand3.svg",
  "/svg/brand1.svg",
  "/svg/brand2.svg",
  "/svg/brand3.svg",
  "/svg/brand1.svg",
  "/svg/brand2.svg",
  "/svg/brand3.svg",
];

export default function Brands() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[#1E293B] text-sm md:text-base">БРЭНД</CardTitle>
        <Link href="/brands" className="text-xs text-gray-500 hover:text-[#8DC63F]">
          Бүгдийг Харах
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6 items-center">
          {BRAND_SVGS.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="flex items-center justify-center rounded-lg bg-white"
            >
              <Image
                src={src}
                alt={`brand-${idx + 1}`}
                width={96}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


