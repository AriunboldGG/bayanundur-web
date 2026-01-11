"use client";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ALL_NEWS } from "@/lib/newsData";

export default function NewsPage() {
  const pageSize = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(ALL_NEWS.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return ALL_NEWS.slice(start, start + pageSize);
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
            <Card key={post.id} className="overflow-hidden hover:border-[#8DC63F] transition-colors">
              {post.img && post.img.trim() !== '' ? (
                <div className="relative h-40 w-full bg-gray-100">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              ) : (
                <div className="relative h-40 w-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Зураг байхгүй</span>
                </div>
              )}
              <CardContent className="p-4 flex h-full flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-500">
                    {post.date} • {post.category}
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-gray-900 line-clamp-3">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {post.description}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    href={`/news/${post.id}`}
                    className="text-sm font-medium text-[#8DC63F] hover:underline inline-flex items-center gap-1"
                  >
                    Дэлгэрэнгүй үзэх
                    <span>→</span>
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