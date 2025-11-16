"use client";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Product = {
  id: number;
  name: string;
  price: string;
  img: string;
  category: "ppe" | "rescue" | "workplace";
  subcategory: string;
  subleaf: string;
  color: string;
  brand: string;
  size: string;
  priceNum: number;
  stock: "in_stock" | "preorder";
  theme: string;
};

function generateProducts(): Product[] {
  const arr: Product[] = [];
  for (let i = 0; i < 200; i++) {
    const idx = (i % 3) + 1;
    const cat: Product["category"] = i % 3 === 0 ? "ppe" : i % 3 === 1 ? "rescue" : "workplace";
    const subByCat: Record<Product["category"], string[]> = {
      ppe: ["Толгойн хамгаалалт", "Хамгаалалтын хувцас", "Гар хамгаалалт", "Хөл хамгаалалт"],
      rescue: ["Аюулгүйн цоож пайз", "Цахилгааны хамгаалалтын багаж", "Тэмдэг тэмдэглэгээ", "Гэрэл, чийдэн", "Осолын үеийн багаж хэрэгсэл"],
      workplace: ["Дуу чимээ, тоосжилт"],
    };
    const subs = subByCat[cat];
    const sub = subs[i % subs.length];
    const leafByCat: Record<Product["category"], Record<string, string[]>> = {
      ppe: {
        "Толгойн хамгаалалт": ["Малгай, каск", "Нүүрний хамгаалалт, нүдний шил", "Гагнуурын баг", "Амьсгалын маск", "Чихэвч", "Баг шүүлтүүр"],
        "Хамгаалалтын хувцас": ["Зуны хувцас", "Өвлийн хувцас", "Цахилгаан, нуман ниргэлтээс", "Гагнуурын хувцас", "Халуунаас хамгаалах", "Хими, цацрагаас"],
        "Гар хамгаалалт": ["Ажлын бээлий", "Цахилгааны бээлий", "Гагнуурын/халуун бээлий", "Хими, шүлт, цацрагаас"],
        "Хөл хамгаалалт": ["Ажлын гутал", "Гагнуурын гутал", "Хүчил шүлтнээс", "Усны гутал"],
      },
      rescue: {
        "Аюулгүйн цоож пайз": ["Цоож", "Түгжээ", "Хайрцаг/стайшин", "Пайз", "Иж бүрдэл"],
        "Цахилгааны хамгаалалтын багаж": ["Хөндийрүүлэгч штанг", "Зөөврийн газардуулга", "Хүчдэл хэмжигч", "Тусгаарлагч материал", "Зөөврийн хайс/шат"],
        "Тэмдэг тэмдэглэгээ": ["Анхааруулах палакат", "Тууз/наалт/скоч", "Замын тэмдэг", "Тумбо/шон", "Туг дарцаг"],
        "Гэрэл, чийдэн": ["Духны гэрэл", "Баттерей", "Зөөврийн гэрэл", "Прожектор гэрэл", "Маяк/дохиолол"],
        "Осолын үеийн багаж хэрэгсэл": ["Химийн асгаралтын иж бүрдэл", "Галын анхан шатны хэрэгсэл", "Түргэн тусламжийн хэрэгсэл"],
      },
      workplace: {
        "Дуу чимээ, тоосжилт": ["Тоосны маск", "Чихний хамгаалалт"],
      },
    };
    const leaves = (leafByCat[cat][sub] ?? []);
    const subleaf = leaves.length ? leaves[i % leaves.length] : "";
    const colors = ["Улаан", "Цэнхэр", "Хар", "Цагаан", "Ногоон"];
    const brands = ["Swootech", "Nike", "Aegis", "SafePro", "WorkWear"];
    const sizes = ["S", "M", "L", "XL"];
    const themes = ["Classic", "Sport", "Pro", "Eco"];
    const priceNum = Math.floor(Math.random() * 900) + 100;
    arr.push({
      id: i + 1,
      name: `Sample Product ${i + 1}`,
      price: `${priceNum.toLocaleString()}₮`,
      img: idx === 1 ? "/images/product1.jpg" : idx === 2 ? "/images/product2.jpg" : "/images/product3.jpg",
      category: cat,
      subcategory: sub,
      subleaf,
      color: colors[i % colors.length],
      brand: brands[i % brands.length],
      size: sizes[i % sizes.length],
      priceNum,
      stock: i % 4 === 0 ? "preorder" : "in_stock",
      theme: themes[i % themes.length],
    });
  }
  return arr;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const products = useMemo(() => generateProducts(), []);
  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-gray-700">Бүтээгдэхүүн олдсонгүй.</p>
          <Button className="mt-4" onClick={() => router.push("/products")}>
            Буцах
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="rounded-xl border p-4 bg-white">
            <div className="relative w-full h-80">
              <Image src={product.img} alt={product.name} fill className="object-contain bg-white" />
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{product.price}</div>
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <div>Ангилал: {product.category} / {product.subcategory}{product.subleaf ? ` / ${product.subleaf}` : ""}</div>
              <div>Брэнд: {product.brand}</div>
              <div>Өнгө: {product.color}</div>
              <div>Хэмжээ: {product.size}</div>
              <div>Загвар: {product.theme}</div>
              <div>Нөөц: {product.stock === "in_stock" ? "Бэлэн" : "Захиалгаар"}</div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button className="bg-[#8DC63F] hover:bg-[#7AB82E]">Сагсанд нэмэх</Button>
              <Link href="/products" className="rounded-md border px-4 py-2 text-sm flex items-center">
                Буцах
              </Link>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Тайлбар</h2>
              <p className="text-sm text-gray-600 leading-6">
                Энэхүү бүтээгдэхүүний мэдээлэл нь жишээ/mock өгөгдөл дээр суурилсан. Жинхэнэ өгөгдөлтэй холбох
                үед танай API-гаас ачаалж, үзүүлэлтүүдийг дэлгэрэнгүйгээр харуулах боломжтой.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


