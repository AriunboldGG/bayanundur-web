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
import { useMemo, useState, useEffect } from "react";
import { getAllNews, type NewsPost } from "@/lib/newsData";

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
}

export default function HeroSlider({ slides }: { slides?: Slide[] }) {
  const [allNews, setAllNews] = useState<NewsPost[]>([]);

  // Fetch news from Firestore
  useEffect(() => {
    async function fetchNews() {
      try {
        const news = await getAllNews();
        setAllNews(news);
      } catch (error) {
        console.error("Error fetching news for HeroSlider:", error);
        setAllNews([]);
      }
    }
    
    fetchNews();
  }, []);

  // Get last 3 news items sorted by date (most recent first)
  const newsSlides = useMemo(() => {
    if (allNews.length === 0) return [];
    
    const sortedNews = [...allNews].sort((a, b) => {
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
  }, [allNews]);

  const displaySlides = slides || newsSlides;
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px]">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {displaySlides.map((s) => (
            <CarouselItem key={s.id}>
              <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl border border-gray-200 group">
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
              
              {/* More Button */}
              {s.href && (
                <div className="absolute bottom-4 left-4">
                  <Link href={s.href}>
                    <Button className="bg-[#1f632b] hover:bg-[#16451e] text-white cursor-pointer">
                      {s.ctaLabel || "Дэлгэрэнгүй"}
                    </Button>
                  </Link>
                </div>
              )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 cursor-pointer" />
        <CarouselNext className="right-2 cursor-pointer" />
      </Carousel>
    </div>
  );
}


