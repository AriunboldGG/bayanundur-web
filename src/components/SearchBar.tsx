"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Shield, LifeBuoy, Wrench, Package, type LucideIcon } from "lucide-react";

export default function SearchBar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<number | null>(0);
  const [hoveredSub, setHoveredSub] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        // Reset to default on desktop
        setHoveredCat(0);
        setHoveredSub(null);
      } else {
        // Reset to show categories on mobile
        setHoveredCat(null);
        setHoveredSub(null);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Demo category tree for first-level, second-level (sub), and third-level (sub-sub)
  const categoryTree: Array<{
    name: string;
    slug: string;
    icon: LucideIcon;
    children?: Array<{ name: string; slug: string; children?: Array<{ name: string; slug: string }> }>;
  }> = [
    {
      name: "Хувь хүнийг хамгаалах хувцас хэрэгсэл",
      slug: "ppe",
      icon: Shield,
      children: [
        {
          name: "Толгойн хамгаалалт",
          slug: "head",
          children: [
            { name: "Малгай, каск", slug: "hat" },
            { name: "Нүүрний хамгаалалт, нүдний шил", slug: "goggles" },
            { name: "Гагнуурын баг, дагалдах хэрэгсэлт", slug: "gagnuur" },
            { name: "Амьсгал хамгаалах маск, хошуувч", slug: "mask" },
            { name: "Чихэвч, чихний бөглөө", slug: "ear" },
            { name: "Баг шүүлтүүр ", slug: "filter" },
          ],
        },
        {
          name: "Хамгаалалтын хувцас",
          slug: "clothes",
          children: [
            { name: "Зуны хувцас", slug: "summer" },
            { name: "Өвлийн хувцас", slug: "winter" },
            { name: "Цахилгаан, нуман ниргэлтээс хамгаалах хувцас хэрэглэл", slug: "electric" },
            { name: "Гангуурын хувцас хэрэгсэл", slug: "welder-suit" },
            { name: "Халуунаас хамгаалах хувцас хэрэгсэл", slug: "heat-protect" },
            { name: "Хими, цацраг, тоосонцроос хамгаалах хувцас", slug: "chemical-protect" },
          ],
        },
        {
          name: "Гар хамгаалалтын хувцас хэрэгсэл",
          slug: "hand",
          children: [
            { name: "Ажлын бээлий", slug: "work-gloves" },
            { name: "Цахилгааны бээлий", slug: "electric-gloves" },
            { name: "Гагнуурын бээлий, халуунаас хамгаалах бээлий", slug: "welder-gloves" },
            { name: "Хими, шүлт, цагцраас хамгаалах бээлий", slug: "heat-gloves" },
          ],
        },
        {
          name: "Хөл хамгаалалтын хувцас хэрэгсэл",
          slug: "foot",
          children: [
            { name: "Ажлын гутал", slug: "work-boots" },
            { name: "Гангуурын гутал", slug: "welder-boots" },
            { name: "Хүчил шүлт, цацрагаас хамгаалах", slug: "acid-alkali-boots" },
            { name: "Усны гутал", slug: "water-boots" },
          ],
        },
        {
          name: "Өндрөөс хамгаалах хэрэгсэл",
          slug: "height-protect",
          children: [
            { name: "Өндрийн бүс, олс", slug: "height-belt-rope" },
            { name: "Аврах олс, цүнх", slug: "rescue-rope-bag" },
          ],
        },
      ],
    },
    {
      name: "Аврах хамгаалах багаж хэрэгсэл",
      slug: "rescue",
      icon: LifeBuoy,
      children: [
        {
          name: "Аюулгүйн цоож пайз ",
          slug: "safety-sign",
          children: [
            { name: "Цоож", slug: "tsooj" },
            { name: "Түгжээ", slug: "tvgjee" },
            { name: "Хайрцаг, стайшин", slug: "sign-kit" },
            { name: "Пайз", slug: "paiz" },
            { name: "Иж бүрдэл, бусад", slug: "others" },
          ],
        },
        {
          name: "Цахилгааны хамгаалалтын багаж",
          slug: "electrical-protect",
          children: [
            { name: "Хөндийрүүлэгч штанг", slug: "insulating-rod" },
            { name: "Цахилгаан дамжуулдаггүй зөөврийн хайс, шат", slug: "non-eletric-stair" },
            { name: "Зөөврийн газардуулга", slug: "portable-ground" },
            { name: "Хүчдэл хэмжигч", slug: "voltage-tester" },
            { name: "Тусгаарлагч хэрэгсэл, материал", slug: "insulation-material" },
          ],
        },
        {
          name: "Тэмдэг тэмдэглэгээ",
          slug: "marking",
          children: [
            { name: "Анхааруулах тэмдэг тэмдэглэгээний палакат", slug: "warning-poster" },
            { name: "Тууз, наалт, скоч", slug: "tape-sticker" },
            { name: "Замын тэмдэг, тэмдэглэгээ", slug: "road-sign" },
            { name: "Замын тумбо, шон", slug: "traffic-bollard" },
            { name: "Туг дарцаг", slug: "flag" },
          ],
        },
        {
          name: "Гэрэл, чийдэн",
          slug: "lights",
          children: [
            { name: "Духны гэрэл", slug: "headlamp" },
            { name: "Баттерей", slug: "battery" },
            { name: "Зөөврийн гэрэл", slug: "portable-light" },
            { name: "Прожектор гэрэл", slug: "projector-light" },
            { name: "Маяк, дохиолол", slug: "beacon" },
          ],
        },
        {
          name: "Осолын үеийн багаж хэрэгсэл",
          slug: "emergency-tools",
          children: [
            { name: "Химийн асгаралтын үеийн хамгаалалтын иж бүрдэл", slug: "chemical-spill-kit" },
            { name: "Галын анхан шатны хэрэгсэл", slug: "fire-first-kit" },
            { name: "Түргэн тусламж үзүүлэх хэрэгсэл", slug: "first-aid-backpack" },

          ],
        },
      ],
    },
    {
      name: "Ажлын байрны хэвийн ажиллагааг хангах",
      slug: "workplace",
      icon: Wrench,
      children: [
        {
          name: "Дуу чимээ, тоосжилт",
          slug: "noise-dust",
          children: [
            { name: "Тоосны маск", slug: "dust-mask" },
            { name: "Чихний хамгаалалт", slug: "ear-protect" },
          ],
        },
      ],
    },
    {
      name: "Бусад",
      slug: "other",
      icon: Package,
      children: [
        {
          name: "Бусад бүтээгдэхүүн",
          slug: "other-products",
          children: [
            { name: "Бусад", slug: "other" },
            { name: "Нэмэлт", slug: "additional" },
          ],
        },
        {
          name: "Нэмэлт хэрэгсэл",
          slug: "additional-tools",
          children: [
            { name: "Хэрэгсэл", slug: "tools" },
            { name: "Тоног төхөөрөмж", slug: "equipment" },
          ],
        },
        {
          name: "Сэлбэг хэрэгсэл",
          slug: "spare-parts",
          children: [
            { name: "Сэлбэг", slug: "spare" },
            { name: "Дагалдах хэрэгсэл", slug: "accessories" },
          ],
        },
      ],
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    }

    if (isCategoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryOpen]);

  return (
    <div className="w-full">
      <div className="bg-[#8DC63F] rounded-xl px-4 md:px-5 py-4 md:py-5 shadow-md">
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg h-12 md:h-14 border-2 border-white/20 focus-within:border-white/40 transition-all">
            {/* Category Dropdown */}
            <button
              onClick={() => {
                const newState = !isCategoryOpen;
                setIsCategoryOpen(newState);
                if (newState && isMobile) {
                  // Reset to show categories on mobile when opening
                  setHoveredCat(null);
                  setHoveredSub(null);
                }
              }}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 border-r border-gray-200 transition-all h-full cursor-pointer ${
                isCategoryOpen 
                  ? "bg-[#1f632b]/5 text-[#1f632b]" 
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Ангилал</span>
              <svg
                className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Search Input Field */}
            <input
              type="text"
              placeholder="Бүтээгдэхүүн хайх..."
              className="flex-1 px-4 md:px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-sm md:text-base h-full"
            />

            {/* Search Icon Button */}
            <button className="px-4 md:px-5 py-3 border-l border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center h-full cursor-pointer group">
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-[#1f632b] group-hover:scale-110 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Category Dropdown Menu with sub and sub-sub */}
          {isCategoryOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-full md:w-[760px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] md:max-h-none overflow-y-auto md:overflow-y-visible"
              onMouseLeave={() => {
                if (!isMobile) {
                  setHoveredCat(0);
                  setHoveredSub(null);
                }
              }}
            >
                <div className="flex flex-col md:flex-row">
                  {/* First column - Show on mobile only when no category selected, always on desktop */}
                  <div className={`w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 ${isMobile && hoveredCat !== null ? 'hidden md:block' : ''}`}>
                    <ul className="py-2">
                      {categoryTree.map((cat, idx) => (
                        <li
                          key={cat.slug}
                          onMouseEnter={() => {
                            setHoveredCat(idx);
                            setHoveredSub(null);
                          }}
                          onClick={(e) => {
                            // On mobile, clicking a category shows its subcategories
                            if (isMobile) {
                              e.preventDefault();
                              setHoveredCat(idx);
                              setHoveredSub(null);
                            }
                          }}
                        >
                          <button
                            className={`w-full text-left px-4 py-3 transition-all cursor-pointer rounded-md mx-2 ${
                              hoveredCat === idx
                                ? "bg-[#1f632b]/10 text-[#1f632b] font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span className="inline-flex items-center gap-3 text-sm md:text-base">
                              <cat.icon className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 transition-colors ${
                                hoveredCat === idx ? "text-[#1f632b]" : "text-gray-500"
                              }`} />
                              <span className="break-words">{cat.name}</span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Second column (subs) - Show on mobile when category is selected */}
                  {hoveredCat !== null && (
                    <div className={`w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 ${isMobile && hoveredSub !== null ? 'hidden md:block' : ''}`}>
                      {/* Mobile back button */}
                      <div className="md:hidden border-b border-gray-100 px-4 py-3 bg-gray-50">
                        <button
                          onClick={() => {
                            setHoveredCat(null);
                            setHoveredSub(null);
                          }}
                          className="text-sm text-[#1f632b] hover:text-[#16451e] flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Буцах
                        </button>
                      </div>
                      <ul className="py-2">
                        {(categoryTree[hoveredCat ?? 0]?.children ?? []).map(
                          (sub, sIdx) => (
                            <li
                              key={sub.slug}
                              onMouseEnter={() => setHoveredSub(sIdx)}
                              onClick={(e) => {
                                // On mobile, clicking a subcategory shows its children
                                if (isMobile) {
                                  e.preventDefault();
                                  setHoveredSub(sIdx);
                                }
                              }}
                            >
                              <button
                                className={`w-full text-left px-4 py-3 transition-all cursor-pointer rounded-md mx-2 ${
                                  hoveredSub === sIdx
                                    ? "bg-[#1f632b]/10 text-[#1f632b] font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-sm md:text-base break-words">{sub.name}</span>
                              </button>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Third column (sub-subs) - Show on mobile when subcategory is selected */}
                  {hoveredCat !== null && hoveredSub !== null && (
                    <div className="w-full md:flex-1">
                      {/* Mobile back button */}
                      <div className="md:hidden border-b border-gray-100 px-4 py-3 bg-gray-50">
                        <button
                          onClick={() => {
                            setHoveredSub(null);
                          }}
                          className="text-sm text-[#1f632b] hover:text-[#16451e] flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Буцах
                        </button>
                      </div>
                      <div className="py-4 px-4 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {(
                          categoryTree[hoveredCat ?? 0]?.children?.[
                            hoveredSub ?? 0
                          ]?.children ?? []
                        ).map((leaf) => (
                          <Link
                            key={leaf.slug}
                            href={`/products?category=${leaf.slug}`}
                            className="text-xs md:text-sm text-gray-700 hover:text-[#1f632b] hover:bg-[#1f632b]/5 break-words py-2 px-3 rounded-md transition-all cursor-pointer"
                            onClick={() => setIsCategoryOpen(false)}
                          >
                            {leaf.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

