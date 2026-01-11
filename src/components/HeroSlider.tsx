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
import { ALL_NEWS } from "@/lib/newsData";

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
}

export default function HeroSlider({ slides }: { slides?: Slide[] }) {
  // Get last 3 news items sorted by date (most recent first)
  const newsSlides = useMemo(() => {
    const sortedNews = [...ALL_NEWS].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return sortedNews.slice(0, 3).map((post) => ({
      id: post.id,
      image: post.img,
      title: post.title,
      subtitle: `${post.date} • ${post.category}`,
      ctaLabel: "Дэлгэрэнгүй",
      href: `/news/${post.id}`, // Link to internal news page
    }));
  }, []);

  const displaySlides = slides || newsSlides;
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {displaySlides.map((s) => (
          <CarouselItem key={s.id}>
            <div className="relative h-[260px] md:h-[360px] overflow-hidden rounded-xl group">
              {s.image && s.image.trim() !== "" ? (
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  priority
                  className="object-contain bg-white"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Зураг байхгүй</span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-black/10" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <h2 className="text-lg md:text-2xl font-bold mb-2 line-clamp-2">{s.title}</h2>
                {s.subtitle && (
                  <p className="text-xs md:text-sm text-white/90 mb-3">{s.subtitle}</p>
                )}
                {s.href && (
                  <Link href={s.href}>
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


