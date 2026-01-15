import type { Metadata } from "next";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import TopCategories from "@/components/TopCategories";
import HeroSlider from "@/components/HeroSlider";
import Brands from "@/components/Brands";
import ProductTabsSlider from "@/components/ProductTabsSlider";
import PromoBanner from "@/components/PromoBanner";
import Suggestions from "@/components/Suggestions";

export const metadata: Metadata = {
  title: "Нүүр хуудас",
  description: "ХАБЭА хамгаалах хувцас хэрэгсэл, аврах багаж хэрэгсэл, ажлын байрны тохилог орчны бүтээгдэхүн. БАЯН ӨНДӨР компаниас чанартай, найдвартай бүтээгдэхүн худалдан аваарай.",
  openGraph: {
    title: "БАЯН ӨНДӨР - Хамгаалах хувцас хэрэгсэл, багаж хэрэгсэл",
    description: "ХАБЭА хамгаалах хувцас хэрэгсэл, аврах багаж хэрэгсэл нийлүүлнэ",
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="container mx-auto px-4 mt-6 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-1">
            <SearchBar />
          </div>
          <div className="md:col-span-2">
            <Brands />
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 mt-6 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-1">
            <TopCategories />
          </div>
          <div className="md:col-span-2">
            <HeroSlider />
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 mt-6 md:mt-8">
        <ProductTabsSlider />
      </section>
      <section className="container mx-auto px-4 mt-6 md:mt-8">
        <PromoBanner />
      </section>
      {/* <section className="container mx-auto px-4 mt-6 md:mt-8">
        <Suggestions />
      </section> */}
    </main>
  );
}
