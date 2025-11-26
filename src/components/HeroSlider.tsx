"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMemo } from "react";

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
}

type NewsPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  href: string;
  img: string;
};

const ALL_NEWS_POSTS: NewsPost[] = [
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

export default function HeroSlider({ slides }: { slides?: Slide[] }) {
  // Get last 3 news items sorted by date (most recent first)
  const newsSlides = useMemo(() => {
    const sortedNews = [...ALL_NEWS_POSTS].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return sortedNews.slice(0, 3).map((post) => ({
      id: post.id,
      image: post.img,
      title: post.title,
      subtitle: `${post.date} • ${post.category}`,
      ctaLabel: "Дэлгэрэнгүй",
      href: post.href,
    }));
  }, []);

  const displaySlides = slides || newsSlides;
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {displaySlides.map((s) => (
          <CarouselItem key={s.id}>
            <div className="relative h-[260px] md:h-[360px] overflow-hidden rounded-xl group">
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority
                className="object-contain bg-white"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-black/10" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <h2 className="text-lg md:text-2xl font-bold mb-2 line-clamp-2">{s.title}</h2>
                {s.subtitle && (
                  <p className="text-xs md:text-sm text-white/90 mb-3">{s.subtitle}</p>
                )}
                {s.href && (
                  <Link
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : "_self"}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <Button className="bg-[#1f632b] hover:bg-[#16451e] text-white cursor-pointer">
                      {s.ctaLabel || "Дэлгэрэнгүй"}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}


