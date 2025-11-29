"use client";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, LifeBuoy, Wrench, Package } from "lucide-react";
import { useStock } from "@/context/StockContext";

type Product = {
  id: number;
  name: string;
  price: string;
  img: string;
  modelNumber: string;
  category: "ppe" | "rescue" | "workplace" | "other";
  subcategory: string;
  subleaf: string;
  color: string;
  brand: string;
  size: string;
  priceNum: number;
  stock: "in_stock" | "preorder";
  stockCount: number;
  theme: string;
};

const ALL_PRODUCTS: Product[] = Array.from({ length: 200 }).map((_, i) => {
  const idx = (i % 4) + 1;
  const cat: Product["category"] = i % 4 === 0 ? "ppe" : i % 4 === 1 ? "rescue" : i % 4 === 2 ? "workplace" : "other";
  const subByCat: Record<Product["category"], string[]> = {
    ppe: ["Толгойн хамгаалалт", "Хамгаалалтын хувцас", "Гар хамгаалалт", "Хөл хамгаалалт"],
    rescue: ["Аюулгүйн цоож пайз", "Цахилгааны хамгаалалтын багаж", "Тэмдэг тэмдэглэгээ", "Гэрэл, чийдэн", "Осолын үеийн багаж хэрэгсэл"],
    workplace: ["Дуу чимээ, тоосжилт"],
    other: ["Бусад бүтээгдэхүүн", "Нэмэлт хэрэгсэл", "Сэлбэг хэрэгсэл"],
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
  const priceNum = Math.floor(Math.random() * 900) + 100; // 100-999
  const stockCount = i % 4 === 0 ? 0 : Math.floor(Math.random() * 50) + 5; // 5-54 for in_stock, 0 for preorder
  
  // Generate unique model number (format: MC375xx/A, MC376xx/B, etc.)
  const modelPrefix = ["MC", "SP", "WP", "RS", "AE"];
  const modelNum = String(375 + (i % 1000)).padStart(3, "0");
  const modelSuffix = ["xx/A", "xx/B", "xx/C", "xx/D", "xx/E", "xx/F", "xx/G", "xx/H"];
  const modelNumber = `${modelPrefix[i % modelPrefix.length]}${modelNum}${modelSuffix[i % modelSuffix.length]}`;
  
  return {
    id: i + 1,
    name: `Sample Product ${i + 1}`,
    price: `${priceNum.toLocaleString()}₮`,
    img:
      idx === 1
        ? "/images/product1.jpg"
        : idx === 2
        ? "/images/product2.jpg"
        : "/images/product3.jpg",
    modelNumber,
    category: cat,
    subcategory: sub,
    subleaf,
    color: colors[i % colors.length],
    brand: brands[i % brands.length],
    size: sizes[i % sizes.length],
    priceNum,
    stock: i % 4 === 0 ? "preorder" : "in_stock",
    stockCount,
    theme: themes[i % themes.length],
  };
});

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { setInitialStock, getStock } = useStock();
  const pageSize = 50;
  const [page, setPage] = useState(1);
  const [selectedCat, setSelectedCat] = useState<"all" | Product["category"]>("all");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [selectedLeaf, setSelectedLeaf] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<Array<Product["stock"]>>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize stock counts
  useEffect(() => {
    ALL_PRODUCTS.forEach((product) => {
      setInitialStock(product.id, product.stockCount);
    });
  }, [setInitialStock]);

  // Read category and brand from URL query params on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && ["ppe", "rescue", "workplace", "other"].includes(categoryParam)) {
      setSelectedCat(categoryParam as Product["category"]);
      setPage(1);
      setSelectedSub(null);
      setSelectedLeaf([]);
    }
    
    const brandParam = searchParams.get("brand");
    if (brandParam) {
      const availableBrands = Array.from(new Set(ALL_PRODUCTS.map((p) => p.brand)));
      if (availableBrands.includes(brandParam)) {
        setSelectedBrands([brandParam]);
        setPage(1);
      }
    }
  }, [searchParams]);

  const categories = [
    { id: "all" as const, label: "Бүгд", icon: null, count: ALL_PRODUCTS.length },
    { id: "ppe" as const, label: "ХАБ хувцас хэрэгсэл", icon: Shield, count: ALL_PRODUCTS.filter(p => p.category === "ppe").length },
    { id: "rescue" as const, label: "Аврах хамгаалах", icon: LifeBuoy, count: ALL_PRODUCTS.filter(p => p.category === "rescue").length },
    { id: "workplace" as const, label: "Ажлын байр", icon: Wrench, count: ALL_PRODUCTS.filter(p => p.category === "workplace").length },
    { id: "other" as const, label: "Бусад", icon: Package, count: ALL_PRODUCTS.filter(p => p.category === "other").length },
  ];

  const subcats: Record<Product["category"], string[]> = {
    ppe: ["Толгойн хамгаалалт", "Хамгаалалтын хувцас", "Гар хамгаалалт", "Хөл хамгаалалт"],
    rescue: ["Аюулгүйн цоож пайз", "Цахилгааны хамгаалалтын багаж", "Тэмдэг тэмдэглэгээ", "Гэрэл, чийдэн", "Осолын үеийн багаж хэрэгсэл"],
    workplace: ["Дуу чимээ, тоосжилт"],
    other: ["Бусад бүтээгдэхүүн", "Нэмэлт хэрэгсэл", "Сэлбэг хэрэгсэл"],
  };
  const leafcats: Record<Product["category"], Record<string, string[]>> = {
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
    other: {
      "Бусад бүтээгдэхүүн": ["Бусад", "Нэмэлт"],
      "Нэмэлт хэрэгсэл": ["Хэрэгсэл", "Тоног төхөөрөмж"],
      "Сэлбэг хэрэгсэл": ["Сэлбэг", "Дагалдах хэрэгсэл"],
    },
  };

  const filtered = useMemo(() => {
    let base = selectedCat === "all" ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.category === selectedCat);
    if (selectedCat !== "all" && selectedSub) {
      base = base.filter(p => p.subcategory === selectedSub);
    }
    if (selectedCat !== "all" && selectedLeaf.length) {
      base = base.filter(p => selectedLeaf.includes(p.subleaf));
    }
    if (selectedColors.length) base = base.filter(p => selectedColors.includes(p.color));
    if (selectedBrands.length) base = base.filter(p => selectedBrands.includes(p.brand));
    if (selectedSizes.length) base = base.filter(p => selectedSizes.includes(p.size));
    if (selectedStock.length) base = base.filter(p => selectedStock.includes(p.stock));
    if (selectedThemes.length) base = base.filter(p => selectedThemes.includes(p.theme));
    return base;
  }, [selectedCat, selectedSub, selectedLeaf, selectedColors, selectedBrands, selectedSizes, selectedStock, selectedThemes]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [page, filtered]);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">БҮТЭЭГДЭХҮҮН</h1>
         
        </div>

        {/* Top category filter bar */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCat(c.id);
                  setPage(1);
                  setSelectedSub(null);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm transition-colors ${
                  selectedCat === c.id
                    ? "border-[#1f632b] bg-[#1f632b] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#1f632b] hover:bg-[#1f632b]/10"
                }`}
              >
                {c.icon ? <c.icon className="h-4 w-4" /> : null}
                <span>{c.label}</span>
                <span className="ml-1 text-[10px] opacity-80">{c.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile filters toggle */}
        <div className="mb-4 md:hidden">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-[#1f632b]/10 hover:text-[#1f632b] hover:border-[#1f632b] transition-colors"
          >
            Шүүлтүүрүүд
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Left filters: show subcats only when main selected */}
          <aside className="hidden md:block space-y-4">
            {selectedCat !== "all" ? (
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-2">Дэд ангилал</div>
                <div className="space-y-2">
                  {subcats[selectedCat].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSub(s === selectedSub ? null : s);
                        setSelectedLeaf([]);
                        setPage(1);
                      }}
                      className={`w-full text-left rounded-md px-2 py-2 text-sm transition-colors ${
                        s === selectedSub ? "bg-[#1f632b]/10 text-[#1f632b]" : "hover:bg-[#1f632b]/10 hover:text-[#1f632b]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Sub-sub categories */}
            {selectedCat !== "all" && selectedSub ? (
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-2">Нарийвчилсан ангилал</div>
                <div className="space-y-2 text-sm">
                  {(leafcats[selectedCat][selectedSub] ?? []).map((leaf) => (
                    <label key={leaf} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLeaf.includes(leaf)}
                        onChange={(e) => {
                          setPage(1);
                          setSelectedLeaf((prev) =>
                            e.target.checked ? [...prev, leaf] : prev.filter((x) => x !== leaf)
                          );
                        }}
                      />
                      {leaf}
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Color filter */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="text-sm font-semibold text-gray-800 mb-2">Өнгө</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Array.from(new Set(ALL_PRODUCTS.map((p) => p.color))).map((c) => {
                  const checked = selectedColors.includes(c);
                  return (
                    <label key={c} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setPage(1);
                          setSelectedColors((prev) =>
                            e.target.checked ? [...prev, c] : prev.filter((x) => x !== c)
                          );
                        }}
                      />
                      {c}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Brand filter */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="text-sm font-semibold text-gray-800 mb-2">Брэнд</div>
              <div className="space-y-2 text-sm">
                {Array.from(new Set(ALL_PRODUCTS.map((p) => p.brand))).map((b) => {
                  const checked = selectedBrands.includes(b);
                  return (
                    <label key={b} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setPage(1);
                          setSelectedBrands((prev) =>
                            e.target.checked ? [...prev, b] : prev.filter((x) => x !== b)
                          );
                        }}
                      />
                      {b}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Size filter */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="text-sm font-semibold text-gray-800 mb-2">Хэмжээ</div>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(ALL_PRODUCTS.map((p) => p.size))).map((s) => {
                  const active = selectedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setPage(1);
                        setSelectedSizes((prev) =>
                          active ? prev.filter((x) => x !== s) : [...prev, s]
                        );
                      }}
                      className={`rounded-md border px-2 py-1 text-sm transition-colors ${
                        active ? "border-[#1f632b] text-[#1f632b] bg-[#1f632b]/10" : "border-gray-200 hover:border-[#1f632b] hover:text-[#1f632b]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock filter */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="text-sm font-semibold text-gray-800 mb-2">Нөөц</div>
              <div className="space-y-2 text-sm">
                {[
                  { id: "in_stock" as const, label: "Агуулахад байна" },
                  { id: "preorder" as const, label: "Захиалгаар" },
                ].map((s) => {
                  const checked = selectedStock.includes(s.id);
                  return (
                    <label key={s.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setPage(1);
                          setSelectedStock((prev) =>
                            e.target.checked ? [...prev, s.id] : prev.filter((x) => x !== s.id)
                          );
                        }}
                      />
                      {s.label}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Clear filters */}
            <button
              onClick={() => {
                setSelectedSub(null);
                setSelectedLeaf([]);
                setSelectedColors([]);
                setSelectedBrands([]);
                setSelectedSizes([]);
                setSelectedStock([]);
                setSelectedThemes([]);
                setPage(1);
              }}
              className="w-full rounded-md border px-3 py-2 text-sm hover:bg-[#1f632b]/10 hover:text-[#1f632b] hover:border-[#1f632b] transition-colors"
            >
              Шүүлтүүр цэвэрлэх
            </button>
          </aside>

          {/* Products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {pageItems.map((p) => (
            <Card key={p.id} className="group overflow-hidden flex flex-col h-full relative cursor-pointer hover:border-[#1f632b] transition-colors">
              <Link href={`/products/${p.id}`} aria-label={`View ${p.name}`} className="absolute inset-0 z-[1]"></Link>
              <div className="relative h-40 w-full">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-contain bg-white"
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                />
                <Link
                  href={`/products/${p.id}`}
                  className="absolute bottom-2 right-2 z-[2] opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-[#1f632b] hover:bg-[#16451e] text-white text-xs px-3 py-1"
                >
                  Харах
                </Link>
              </div>
              <CardContent className="p-3 flex flex-col grow">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="text-gray-500 text-[10px]">Бүтээгдэхүүний код</div>
                      <span className="font-semibold text-[#1f632b]">{p.modelNumber}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          p.stock === "in_stock"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.stock === "in_stock" ? "Бэлэн" : "Захиалгаар"}
                      </span>
                      {p.stock === "in_stock" && (
                        <span className="text-[10px] text-gray-600">
                          Үлдэгдэл: {getStock(p.id)}ш
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-800 line-clamp-2">{p.name}</div>
                  <div className="mt-1 text-xs text-gray-600">
                    Брэнд: <span className="font-medium">{p.brand}</span> • Өнгө: {p.color} •
                    Хэмжээ: {p.size} • Загвар: {p.theme}
                  </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        {/* Mobile filters bottom sheet */}
        {showMobileFilters && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowMobileFilters(false);
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 max-h-[80%] overflow-y-auto rounded-t-2xl bg-white p-4 space-y-4">
              <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-gray-300" />

              {selectedCat !== "all" ? (
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="text-sm font-semibold text-gray-800 mb-2">Дэд ангилал</div>
                  <div className="space-y-2">
                    {subcats[selectedCat].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedSub(s === selectedSub ? null : s);
                          setPage(1);
                        }}
                        className={`w-full text-left rounded-md px-2 py-2 text-sm transition-colors ${
                          s === selectedSub ? "bg-[#1f632b]/10 text-[#1f632b]" : "hover:bg-[#1f632b]/10 hover:text-[#1f632b]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Color */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-2">Өнгө</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Array.from(new Set(ALL_PRODUCTS.map((p) => p.color))).map((c) => {
                    const checked = selectedColors.includes(c);
                    return (
                      <label key={c} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setPage(1);
                            setSelectedColors((prev) =>
                              e.target.checked ? [...prev, c] : prev.filter((x) => x !== c)
                            );
                          }}
                        />
                        {c}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Brand */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-2">Брэнд</div>
                <div className="space-y-2 text-sm">
                  {Array.from(new Set(ALL_PRODUCTS.map((p) => p.brand))).map((b) => {
                    const checked = selectedBrands.includes(b);
                    return (
                      <label key={b} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setPage(1);
                            setSelectedBrands((prev) =>
                              e.target.checked ? [...prev, b] : prev.filter((x) => x !== b)
                            );
                          }}
                        />
                        {b}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-2">Хэмжээ</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(ALL_PRODUCTS.map((p) => p.size))).map((s) => {
                    const active = selectedSizes.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          setPage(1);
                          setSelectedSizes((prev) =>
                            active ? prev.filter((x) => x !== s) : [...prev, s]
                          );
                        }}
                        className={`rounded-md border px-2 py-1 text-sm transition-colors ${
                          active ? "border-[#1f632b] text-[#1f632b] bg-[#1f632b]/10" : "border-gray-200 hover:border-[#1f632b] hover:text-[#1f632b]"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-2">Нөөц</div>
                <div className="space-y-2 text-sm">
                  {[
                    { id: "in_stock" as const, label: "Агуулахад байна" },
                    { id: "preorder" as const, label: "Захиалгаар" },
                  ].map((s) => {
                    const checked = selectedStock.includes(s.id);
                    return (
                      <label key={s.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setPage(1);
                            setSelectedStock((prev) =>
                              e.target.checked ? [...prev, s.id] : prev.filter((x) => x !== s.id)
                            );
                          }}
                        />
                        {s.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Theme */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-2">Загвар (Theme)</div>
                <div className="space-y-2 text-sm">
                  {Array.from(new Set(ALL_PRODUCTS.map((p) => p.theme))).map((t) => {
                    const checked = selectedThemes.includes(t);
                    return (
                      <label key={t} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setPage(1);
                            setSelectedThemes((prev) =>
                              e.target.checked ? [...prev, t] : prev.filter((x) => x !== t)
                            );
                          }}
                        />
                        {t}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSub(null);
                    setSelectedLeaf([]);
                    setSelectedColors([]);
                    setSelectedBrands([]);
                    setSelectedSizes([]);
                    setSelectedStock([]);
                    setSelectedThemes([]);
                    setPage(1);
                  }}
                  className="w-full rounded-md border px-4 py-2 text-sm hover:bg-[#1f632b]/10 hover:text-[#1f632b] hover:border-[#1f632b] transition-colors"
                >
                  Цэвэрлэх
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full rounded-md border px-4 py-2 text-sm hover:bg-[#1f632b]/10 hover:text-[#1f632b] hover:border-[#1f632b] transition-colors"
                >
                  Хаах
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full rounded-md bg-[#1f632b] hover:bg-[#16451e] px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  Хэрэглэх
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50 hover:bg-[#1f632b]/10 hover:text-[#1f632b] hover:border-[#1f632b] transition-colors"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Өмнөх
          </button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50 hover:bg-[#1f632b]/10 hover:text-[#1f632b] hover:border-[#1f632b] transition-colors"
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Ачааллаж байна...</div>
        </div>
      </main>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}