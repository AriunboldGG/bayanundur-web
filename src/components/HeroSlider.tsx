import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "s1",
    image: "/images/hero1.jpg",
    title: "ХАБ БҮТЭЭГДЭХҮҮН",
    subtitle: "Сонголт таны гарт",
    ctaLabel: "үнийн санал",
  },
  {
    id: "s2",
    image: "/images/hero2.png",
    title: "ШИНЭ ИРЛЭЭ",
    subtitle: "Хамгийн халуун бүтээгдэхүүнүүд",
    ctaLabel: "худалдаж авах",
  },
  {
    id: "s3",
    image: "/images/hero3.jpg",
    title: "ОНЦГОЙ ХЯМДРАЛ",
    subtitle: "Долоо хоногийн турш",
    ctaLabel: "дэлгэрэнгүй",
  },
];

export default function HeroSlider({ slides = DEFAULT_SLIDES }: { slides?: Slide[] }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {slides.map((s) => (
          <CarouselItem key={s.id}>
            <div className="relative h-[260px] md:h-[360px] overflow-hidden rounded-xl">
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority
                className="object-contain bg-white"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-black/10" />
           
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}


