"use client";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import FirebaseImage from "@/components/FirebaseImage";
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
import { getProductById, getAllProducts, getImageUrl, getImageUrls, type Product } from "@/lib/products";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { setInitialStock, getStock } = useStock();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  // Helper function to parse comma-separated values
  const parseCommaSeparated = (value: string | undefined | null): string[] => {
    if (!value || typeof value !== 'string') return [];
    return value.split(',').map(s => s.trim()).filter(s => s && s.length > 0);
  };

  // Fetch product from Firestore
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const fetchedProduct = await getProductById(params.id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setInitialStock(fetchedProduct.id, fetchedProduct.stockCount);
          
          // Parse comma-separated values and select first option
          const sizes = parseCommaSeparated(fetchedProduct.size);
          const colors = parseCommaSeparated(fetchedProduct.color);
          
          // Set initial selection to first parsed value, or empty if none
          setSelectedSize(sizes.length > 0 ? sizes[0] : "");
          setSelectedColor(colors.length > 0 ? colors[0] : "");
          setSelectedTheme(fetchedProduct.theme || "");

          // Load images from Firebase Storage
          const imagesToLoad = fetchedProduct.images && fetchedProduct.images.length > 0 
            ? fetchedProduct.images 
            : [fetchedProduct.img];
          const urls = await getImageUrls(imagesToLoad);
          setImageUrls(urls);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [params.id, setInitialStock]);

  // Fetch related products
  useEffect(() => {
    async function fetchRelated() {
      if (!product) return;
      try {
        const allProducts = await getAllProducts();
        const related = allProducts
          .filter(
            (p) =>
              p.firestoreId !== product.firestoreId &&
              (p.subleaf ? p.subleaf === product.subleaf : p.subcategory === product.subcategory)
          )
          .slice(0, 5);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    }
    fetchRelated();
  }, [product]);
  
  // Get all images for the product
  const productImages = useMemo(() => {
    if (imageUrls.length > 0) return imageUrls;
    if (product?.images && product.images.length > 0) return product.images;
    if (product?.img) return [product.img];
    return [];
  }, [imageUrls, product]);
  
  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [product?.firestoreId]);

  // Get available options for this product (from related products)
  const availableOptions = useMemo(() => {
    if (!product) return { sizes: [], colors: [], themes: [] };
    const sameCategoryProducts = relatedProducts.filter(
      (p) => p.category === product.category && p.subcategory === product.subcategory
    );
    // Include current product in options
    const allProducts = [product, ...sameCategoryProducts];
    
    // Parse sizes - always parse comma-separated values to get individual items
    const allSizes = new Set<string>();
    allProducts.forEach((p) => {
      if (p.size) {
        const sizeStr = String(p.size).trim();
        if (sizeStr) {
          // Always try to parse as comma-separated first
          const sizes = parseCommaSeparated(sizeStr);
          if (sizes.length > 0) {
            // Add each individual size from the array
            sizes.forEach(s => allSizes.add(s));
          } else {
            // If not comma-separated, add as single value
            allSizes.add(sizeStr);
          }
        }
      }
    });
    
    // Parse colors - always parse comma-separated values to get individual items
    const allColors = new Set<string>();
    allProducts.forEach((p) => {
      if (p.color) {
        const colorStr = String(p.color).trim();
        if (colorStr) {
          // Always try to parse as comma-separated first
          const colors = parseCommaSeparated(colorStr);
          if (colors.length > 0) {
            // Add each individual color from the array
            colors.forEach(c => allColors.add(c));
          } else {
            // If not comma-separated, add as single value
            allColors.add(colorStr);
          }
        }
      }
    });
    
    return {
      sizes: Array.from(allSizes).sort(),
      colors: Array.from(allColors).sort(),
      themes: Array.from(new Set(allProducts.map((p) => p.theme).filter(Boolean))).sort(),
    };
  }, [product, relatedProducts, parseCommaSeparated]);

  // Validate and update selected values to match available options
  useEffect(() => {
    if (availableOptions.sizes.length > 0 && selectedSize && !availableOptions.sizes.includes(selectedSize)) {
      // If selected size is not in available options, select the first one
      setSelectedSize(availableOptions.sizes[0]);
    } else if (availableOptions.sizes.length > 0 && !selectedSize) {
      // If no size selected but options available, select first
      setSelectedSize(availableOptions.sizes[0]);
    }
    
    if (availableOptions.colors.length > 0 && selectedColor && !availableOptions.colors.includes(selectedColor)) {
      // If selected color is not in available options, select the first one
      setSelectedColor(availableOptions.colors[0]);
    } else if (availableOptions.colors.length > 0 && !selectedColor) {
      // If no color selected but options available, select first
      setSelectedColor(availableOptions.colors[0]);
    }
  }, [availableOptions, selectedSize, selectedColor]);
  
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Ачааллаж байна...</div>
        </div>
      </main>
    );
  }

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
                  <FirebaseImage 
                    src={productImages[selectedImageIndex] || product.img || ""} 
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
                    <FirebaseImage
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
                <div className="text-sm font-semibold text-[#1f632b]">{product.modelNumber || "N/A"}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-sm font-bold text-gray-700 min-w-[80px]">Ангилал:</span>
                <span className="text-sm text-gray-600">{product.category} / {product.subcategory}{product.subleaf ? ` / ${product.subleaf}` : ""}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm font-bold text-gray-700 min-w-[80px]">Брэнд:</span>
                <span className="text-sm text-gray-600">{product.brand}</span>
              </div>
              {product.material && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-gray-700 min-w-[80px]">Материал:</span>
                  <span className="text-sm text-gray-600">{product.material}</span>
                </div>
              )}
            </div>

            {/* Size Selection */}
            {availableOptions.sizes.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Хэмжээ <span className="text-red-500">*</span>
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-auto min-w-[100px] max-w-[200px]">
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
            {availableOptions.colors.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Өнгө <span className="text-red-500">*</span>
                </label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-auto min-w-[100px] max-w-[200px]">
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
                img={product.images && product.images.length > 0 ? product.images[0] : (product.img || "")}
                modelNumber={product.modelNumber || ""}
                color={selectedColor}
                size={selectedSize}
                brand={product.brand}
                theme={selectedTheme}
                stock={product.stock}
              />
              <Link href="/products" className="rounded-md border px-4 py-2 text-sm flex items-center">
                Буцах
              </Link>
            </div>

            {product.description && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-gray-800 mb-2">Тайлбар</h2>
                <p className="text-sm text-gray-600 leading-6 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {product.feature && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-gray-800 mb-2">Онцлог шинж чанар</h2>
                <p className="text-sm text-gray-600 leading-6 whitespace-pre-line">
                  {product.feature}
                </p>
              </div>
            )}
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
                <FirebaseImage 
                  src={productImages[selectedImageIndex] || product.img || ""} 
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
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Төстэй бүтээгдэхүүнүүд</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.firestoreId || rp.id}
                  href={`/products/${rp.firestoreId || rp.id}`}
                  className="group rounded-xl border bg-white p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="relative w-full h-28">
                    <FirebaseImage
                      src={rp.img || ""}
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
                    <div className="text-xs font-semibold text-[#1f632b]">{rp.modelNumber || "N/A"}</div>
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
  stock: "in_stock" | "preorder";
}) {
  const cart = useCart();
  const { getStock } = useStock();
  const [qty, setQty] = useState(1);
  const stockCount = getStock(props.id);
  
  // For in_stock items with available stock, limit quantity. For preorder/out-of-stock, allow unlimited.
  const isInStock = props.stock === "in_stock" && stockCount > 0;
  const maxQuantity = isInStock ? stockCount : Infinity;

  const handleAddToCart = () => {
    // Validate stock availability for in-stock items
    if (isInStock && qty > stockCount) {
      return; // Don't add if quantity exceeds available stock
    }
    
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
    // Stock count is static - only admins can change it
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
          className={`px-2 py-1 text-sm ${
            isInStock && qty >= stockCount
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
          onClick={() => {
            if (isInStock) {
              setQty((q: number) => Math.min(stockCount, q + 1));
            } else {
              setQty((q: number) => q + 1);
            }
          }}
          disabled={isInStock && qty >= stockCount}
        >
          +
        </button>
      </div>
      <Button
        className={`bg-[#1f632b] hover:bg-[#16451e] ${
          isInStock && qty > stockCount
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
        onClick={handleAddToCart}
        disabled={isInStock && qty > stockCount}
      >
        Сагсанд нэмэх
      </Button>
      {isInStock && qty > stockCount && (
        <span className="text-xs text-red-600">Үлдэгдэл хүрэлцэхгүй байна</span>
      )}
    </div>
  );
}


