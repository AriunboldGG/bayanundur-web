"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Shield, LifeBuoy, Wrench } from "lucide-react";

interface CategoryItem {
  id: string;
  title: string;
  icon: LucideIcon;
  count?: number;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "ppe", title: "Хувь хүнийг хамгаалах хувцас хэрэгсэл", icon: Shield, count: 5 },
  { id: "rescue", title: "Аврах хамгаалах багаж хэрэгсэл", icon: LifeBuoy, count: 2 },
  { id: "workplace", title: "Ажлын байрны хэвийн ажиллагааг хангах", icon: Wrench, count: 3 },
];

export default function TopCategories({
  categories = DEFAULT_CATEGORIES,
}: {
  categories?: CategoryItem[];
}) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#1E293B] text-lg">Топ ангилал</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.id}`}
            className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 hover:border-[#8DC63F] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#8DC63F]/10">
                <c.icon className="h-4 w-4 text-[#8DC63F]" />
              </div>
              <span className="text-sm text-gray-700">{c.title}</span>
            </div>
            {typeof c.count === "number" && (
              <span className="ml-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-100 px-1.5 text-[10px] font-medium text-gray-700">
                {c.count}
              </span>
            )}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}


