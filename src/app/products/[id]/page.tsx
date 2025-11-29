"use client";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStock } from "@/context/StockContext";

type Product = {
  id: number;
  name: string;
  price: string;
  img: string;
  images?: string[]; // Multiple images for gallery
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

function generateProducts(): Product[] {
  const arr: Product[] = [];
  for (let i = 0; i < 200; i++) {
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
      other: {
        "Бусад бүтээгдэхүүн": ["Бусад", "Нэмэлт"],
        "Нэмэлт хэрэгсэл": ["Хэрэгсэл", "Тоног төхөөрөмж"],
        "Сэлбэг хэрэгсэл": ["Сэлбэг", "Дагалдах хэрэгсэл"],
      },
    };
    const leaves = (leafByCat[cat][sub] ?? []);
    const subleaf = leaves.length ? leaves[i % leaves.length] : "";
    const colors = ["Улаан", "Цэнхэр", "Хар", "Цагаан", "Ногоон"];
    const brands = ["Swootech", "Nike", "Aegis", "SafePro", "WorkWear"];
    const sizes = ["S", "M", "L", "XL"];
    const themes = ["Classic", "Sport", "Pro", "Eco"];
    const priceNum = Math.floor(Math.random() * 900) + 100;
    const stockCount = i % 4 === 0 ? 0 : Math.floor(Math.random() * 50) + 5; // 5-54 for in_stock, 0 for preorder
    const mainImg = idx === 1 ? "/images/product1.jpg" : idx === 2 ? "/images/product2.jpg" : "/images/product3.jpg";
    
    // Generate unique model number (format: MC375xx/A, MC376xx/B, etc.)
    const modelPrefix = ["MC", "SP", "WP", "RS", "AE"];
    const modelNum = String(375 + (i % 1000)).padStart(3, "0");
    const modelSuffix = ["xx/A", "xx/B", "xx/C", "xx/D", "xx/E", "xx/F", "xx/G", "xx/H"];
    const modelNumber = `${modelPrefix[i % modelPrefix.length]}${modelNum}${modelSuffix[i % modelSuffix.length]}`;
    
    // Generate multiple images for gallery (using available product images)
    const productImages = [
      mainImg,
      idx === 1 ? "/images/product2.jpg" : idx === 2 ? "/images/product3.jpg" : "/images/product1.jpg",
      idx === 1 ? "/images/product3.jpg" : idx === 2 ? "/images/product1.jpg" : "/images/product2.jpg",
      "/images/prod1.jpg",
      "/images/prod2.jpg",
      "/images/prod3.jpg",
    ].filter(Boolean);
    
    arr.push({
      id: i + 1,
      name: `Sample Product ${i + 1}`,
      price: `${priceNum.toLocaleString()}₮`,
      img: mainImg,
      images: productImages, // Multiple images for gallery
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
    });
  }
  return arr;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { setInitialStock, getStock } = useStock();
  const products = useMemo(() => generateProducts(), []);
  const product = products.find((p) => p.id === Number(params.id));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  // Initialize stock count for this product
  useEffect(() => {
    if (product) {
      setInitialStock(product.id, product.stockCount);
    }
  }, [product, setInitialStock]);
  
  // Get all images for the product (use main img if no images array, or combine them)
  const productImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.img];
  }, [product]);
  
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
  
  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    if (product) {
      setSelectedSize(product.size);
      setSelectedColor(product.color);
      setSelectedTheme(product.theme);
    }
  }, [product?.id, product]);

  // Get available options for this product (from all products in same category/subcategory)
  const availableOptions = useMemo(() => {
    if (!product) return { sizes: [], colors: [], themes: [] };
    const sameCategoryProducts = products.filter(
      (p) => p.category === product.category && p.subcategory === product.subcategory
    );
    return {
      sizes: Array.from(new Set(sameCategoryProducts.map((p) => p.size))).sort(),
      colors: Array.from(new Set(sameCategoryProducts.map((p) => p.color))).sort(),
      themes: Array.from(new Set(sameCategoryProducts.map((p) => p.theme))).sort(),
    };
  }, [product, products]);
  
  // Handle navigation
  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  
  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Handle zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };
  
  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };
  
  // Handle mouse drag for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [productImages.length, isFullscreen]);

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
          <Link href="/" className="hover:text-[#1f632b] cursor-pointer">Нүүр</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#1f632b] cursor-pointer">Бүтээгдэхүүн</Link>
          <span>/</span>
          <span className="truncate">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Controls */}
            <div className="rounded-xl border p-4 bg-white relative">
              <div className="relative w-full h-80 md:h-96 overflow-hidden">
                <div
                  className="relative w-full h-full cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transition: isDragging ? "none" : "transform 0.3s ease",
                  }}
                >
                  <Image 
                    src={productImages[selectedImageIndex] || product.img} 
                    alt={product.name} 
                    fill 
                    className="object-contain bg-white select-none" 
                    draggable={false}
                  />
                </div>
                
                {/* Image Controls Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="bg-white/90 hover:bg-white border border-gray-300 rounded-md p-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                    title="Zoom In"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 1}
                    className="bg-white/90 hover:bg-white border border-gray-300 rounded-md p-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                    title="Zoom Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="bg-white/90 hover:bg-white border border-gray-300 rounded-md p-2 shadow-sm cursor-pointer transition-all"
                    title="Full Screen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
                
                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-300 rounded-full p-2 shadow-sm cursor-pointer transition-all z-10"
                      title="Previous Image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-300 rounded-full p-2 shadow-sm cursor-pointer transition-all z-10"
                      title="Next Image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-full aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "border-[#1f632b] ring-2 ring-[#1f632b]/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Зураг ${index + 1}`}
                      fill
                      className="object-contain bg-white p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="bg-[#1f632b]/10 px-3 py-1 rounded-md">
                <div className="text-[10px] text-gray-500">Бүтээгдэхүүний код</div>
                <div className="text-sm font-semibold text-[#1f632b]">{product.modelNumber}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <div>Ангилал: {product.category} / {product.subcategory}{product.subleaf ? ` / ${product.subleaf}` : ""}</div>
              <div>Брэнд: {product.brand}</div>
              <div>
                Нөөц: {product.stock === "in_stock" ? "Бэлэн" : "Захиалгаар"}
                {product.stock === "in_stock" && (
                  <span className="ml-2 font-semibold text-gray-800">
                    (Үлдэгдэл: {getStock(product.id)}ш)
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {availableOptions.sizes.length > 1 && (
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Хэмжээ <span className="text-red-500">*</span>
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-auto min-w-[120px]">
                    <SelectValue placeholder="Хэмжээ сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOptions.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {availableOptions.colors.length > 1 && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Өнгө <span className="text-red-500">*</span>
                </label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-auto min-w-[120px]">
                    <SelectValue placeholder="Өнгө сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOptions.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Type/Theme Selection */}
            {availableOptions.themes.length > 1 && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Загвар <span className="text-red-500">*</span>
                </label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="w-auto min-w-[120px]">
                    <SelectValue placeholder="Загвар сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOptions.themes.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <AddToCartButton
                id={product.id}
                name={product.name}
                priceNum={product.priceNum}
                price={product.price}
                img={product.img}
                modelNumber={product.modelNumber}
                color={selectedColor}
                size={selectedSize}
                brand={product.brand}
                theme={selectedTheme}
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
        
        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={toggleFullscreen}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-20 cursor-pointer"
                title="Close Fullscreen (ESC)"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div 
                className="relative max-w-7xl max-h-[90vh] w-full h-full"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transition: isDragging ? "none" : "transform 0.3s ease",
                }}
              >
                <Image 
                  src={productImages[selectedImageIndex] || product.img} 
                  alt={product.name} 
                  fill 
                  className="object-contain select-none" 
                  draggable={false}
                />
              </div>
              
              {/* Fullscreen Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 rounded-lg px-4 py-2 z-20">
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                  disabled={zoom <= 1}
                  className="text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Zoom Out"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                </button>
                <span className="text-white text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                  disabled={zoom >= 3}
                  className="text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Zoom In"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </button>
              </div>
              
              {/* Fullscreen Navigation */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20 cursor-pointer bg-black/50 rounded-full p-3"
                    title="Previous (←)"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20 cursor-pointer bg-black/50 rounded-full p-3"
                    title="Next (→)"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full z-20">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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
                  <div className="mt-1">
                    <div className="text-[10px] text-gray-500">Бүтээгдэхүүний код</div>
                    <div className="text-xs font-semibold text-[#1f632b]">{rp.modelNumber}</div>
                  </div>
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
  modelNumber: string;
  color?: string;
  size?: string;
  brand?: string;
  theme?: string;
}) {
  const cart = useCart();
  const { decreaseStock, getStock } = useStock();
  const [qty, setQty] = useState(1);
  const stockCount = getStock(props.id);

  const handleAddToCart = () => {
    if (stockCount >= qty) {
      cart.addItem(
        {
          id: props.id,
          name: props.name,
          priceNum: props.priceNum,
          price: props.price,
          img: props.img,
          modelNumber: props.modelNumber,
          color: props.color,
          size: props.size,
          brand: props.brand,
          theme: props.theme,
        },
        qty,
      );
      decreaseStock(props.id, qty);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md border">
        <button
          className="px-2 py-1 text-sm cursor-pointer"
          onClick={() => setQty((q: number) => Math.max(1, q - 1))}
        >
          -
        </button>
        <span className="px-3 text-sm">{qty}</span>
        <button 
          className="px-2 py-1 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={() => setQty((q: number) => Math.min(stockCount, q + 1))}
          disabled={qty >= stockCount}
        >
          +
        </button>
      </div>
      <Button
        className="bg-[#1f632b] hover:bg-[#16451e] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={stockCount < qty || stockCount === 0}
      >
        Сагсанд нэмэх
      </Button>
      {stockCount < qty && stockCount > 0 && (
        <span className="text-xs text-red-600">Үлдэгдэл хүрэлцэхгүй байна</span>
      )}
      {stockCount === 0 && (
        <span className="text-xs text-red-600">Бараа дууссан</span>
      )}
    </div>
  );
}


