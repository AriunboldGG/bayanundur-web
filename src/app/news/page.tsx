"use client";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";

type NewsPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  href: string;
  img: string;
};

const ALL_POSTS: NewsPost[] = [
  {
    id: "p1",
    title: "ХАБЭА Сургалтын зохион байгуулалт. Үндсэн дүрэм MNS 4969 : 2000",
    date: "2024-09-04",
    category: "Зөвлөгөө",
    href: "https://hsct.mn/posts?category_id=124",
    img: "/images/hero1.jpg",
  },
  {
    id: "p2",
    title: "HSCT бараа бүтээгдэхүүний каталог",
    date: "2023-10-19",
    category: "Зөвлөгөө",
    href: "https://hsct.mn/posts?category_id=124",
    img: "/images/hero2.png",
  },
  {
    id: "p3",
    title: "ХАБ-ууд бид өөрсдийгөө хязгаарладаг",
    date: "2023-02-15",
    category: "Зөвлөгөө",
    href: "https://hsct.mn/posts?category_id=124",
    img: "/images/product1.jpg",
  },
  {
    id: "p4",
    title: "ХАБЭА нэр томъёог зөв хэрэглэн хэвшицгээе",
    date: "2022-02-15",
    category: "Зөвлөгөө",
    href: "https://hsct.mn/posts?category_id=124",
    img: "/images/product2.jpg",
  },
  {
    id: "p5",
    title: "Хугацаа алдсан гэмтлийн давтамж — Lost Time Injury Frequency",
    date: "2022-02-15",
    category: "Зөвлөгөө",
    href: "https://hsct.mn/posts?category_id=124",
    img: "/images/product3.jpg",
  },
  {
    id: "p6",
    title: "Нийт гэмтлийн давтамж — Total Recordable Injury Frequency",
    date: "2022-02-15",
    category: "Зөвлөгөө",
    href: "https://hsct.mn/posts?category_id=124",
    img: "/images/hero3.jpg",
  },
];

export default function NewsPage() {
  const pageSize = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(ALL_POSTS.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return ALL_POSTS.slice(start, start + pageSize);
  }, [page]);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">МЭДЭЭ</h1>
         
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {pageItems.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative h-40 w-full">
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  className="object-contain bg-white"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <CardContent className="p-4 flex h-full flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-500">
                    {post.date} • {post.category}
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-gray-900 line-clamp-3">
                    {post.title}
                  </h2>
                </div>
                <div className="mt-4">
                  <Link
                    href={post.href}
                    target="_blank"
                    className="text-sm font-medium text-[#8DC63F] hover:underline"
                  >
                    Дэлгэрэнгүй үзэх
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Өмнөх
          </button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Дараах
          </button>
        </div>
      </div>
    </main>
  );
}