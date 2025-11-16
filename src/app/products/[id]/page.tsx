"use client";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
 import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
 import { useCart } from "@/context/CartContext";

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
  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.subleaf ? p.subleaf === product.subleaf : p.subcategory === product.subcategory)
      )
      .slice(0, 5);
  }, [products, product]);

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
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#8DC63F]">Нүүр</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#8DC63F]">Бүтээгдэхүүн</Link>
          <span>/</span>
          <span className="truncate">{product.name}</span>
        </nav>
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
              <AddToCartButton
                id={product.id}
                name={product.name}
                priceNum={product.priceNum}
                price={product.price}
                img={product.img}
                color={product.color}
                size={product.size}
                brand={product.brand}
                theme={product.theme}
              />
              <Link href="/products" className="rounded-md border px-4 py-2 text-sm flex items-center">
                Буцах
              </Link>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Тайлбар</h2>
              <p className="text-sm text-gray-600 leading-6">
                Tailbar
              </p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Төстэй бүтээгдэхүүнүүд</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.id}`}
                  className="group rounded-xl border bg-white p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="relative w-full h-28">
                    <Image
                      src={rp.img}
                      alt={rp.name}
                      fill
                      className="object-contain bg-white"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 line-clamp-2 group-hover:text-gray-800">
                    {rp.name}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{rp.price}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function AddToCartButton(props: {
  id: number;
  name: string;
  priceNum: number;
  price: string;
  img: string;
  color?: string;
  size?: string;
  brand?: string;
  theme?: string;
}) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md border">
        <button
          className="px-2 py-1 text-sm"
          onClick={() => setQty((q: number) => Math.max(1, q - 1))}
        >
          -
        </button>
        <span className="px-3 text-sm">{qty}</span>
        <button className="px-2 py-1 text-sm" onClick={() => setQty((q: number) => q + 1)}>
          +
        </button>
      </div>
      <Button
        className="bg-[#8DC63F] hover:bg-[#7AB82E]"
        onClick={() =>
          cart.addItem(
            {
              id: props.id,
              name: props.name,
              priceNum: props.priceNum,
              price: props.price,
              img: props.img,
              color: props.color,
              size: props.size,
              brand: props.brand,
              theme: props.theme,
            },
            qty,
          )
        }
      >
        Сагсанд нэмэх
      </Button>
    </div>
  );
}


