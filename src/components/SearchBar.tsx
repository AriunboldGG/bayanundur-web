"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Shield, LifeBuoy, Wrench, type LucideIcon } from "lucide-react";

export default function SearchBar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<number | null>(0);
  const [hoveredSub, setHoveredSub] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full py-3 md:py-4">
      <div className="container mx-auto px-4">
        <div className="bg-[#8DC63F] rounded-lg px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
          {/* Search Input */}
          <div className="flex-1 relative" ref={dropdownRef}>
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm h-12">
              {/* Category Dropdown */}
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 px-4 md:px-5 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap h-full"
              >
                <span className="text-gray-700 font-normal text-sm">Ангилал</span>
                <Image
                  src="/svg/dropdown.svg"
                  alt="Dropdown"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              </button>

              {/* Search Input Field */}
              <input
                type="text"
                placeholder="Бүтээгдэхүүн хайх..."
                className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-sm h-full"
              />

              {/* Search Icon Button */}
              <button className="px-4 md:px-5 py-3 border-l border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center h-full">
                <Image
                  src="/svg/search.svg"
                  alt="Search"
                  width={14}
                  height={14}
                  className="w-4 h-4"
                />
              </button>
            </div>

            {/* Category Dropdown Menu with sub and sub-sub */}
            {isCategoryOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-[760px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                onMouseLeave={() => {
                  setHoveredCat(0);
                  setHoveredSub(null);
                }}
              >
                <div className="flex">
                  {/* First column */}
                  <div className="w-64 border-r">
                    <ul className="py-2">
                      {categoryTree.map((cat, idx) => (
                        <li
                          key={cat.slug}
                          onMouseEnter={() => {
                            setHoveredCat(idx);
                            setHoveredSub(null);
                          }}
                        >
                          <button
                            className={`w-full text-left px-4 py-2 transition-colors ${
                              hoveredCat === idx
                                ? "bg-[#8DC63F]/10 text-[#8DC63F]"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span className="inline-flex items-center gap-2">
                              <cat.icon className="h-5 w-5 text-[#8DC63F]" />
                              {cat.name}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Second column (subs) */}
                  <div className="w-64 border-r">
                    <ul className="py-2">
                      {(categoryTree[hoveredCat ?? 0]?.children ?? []).map(
                        (sub, sIdx) => (
                          <li
                            key={sub.slug}
                            onMouseEnter={() => setHoveredSub(sIdx)}
                          >
                            <button
                              className={`w-full text-left px-4 py-2 transition-colors ${
                                hoveredSub === sIdx
                                  ? "bg-[#8DC63F]/10 text-[#8DC63F]"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {sub.name}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Third column (sub-subs) */}
                  <div className="flex-1">
                    <div className="py-3 px-4 grid grid-cols-2 gap-2">
                      {(
                        categoryTree[hoveredCat ?? 0]?.children?.[
                          hoveredSub ?? 0
                        ]?.children ?? []
                      ).map((leaf) => (
                        <Link
                          key={leaf.slug}
                          href={`/products?category=${leaf.slug}`}
                          className="text-sm text-gray-700 hover:text-[#8DC63F]"
                          onClick={() => setIsCategoryOpen(false)}
                        >
                          {leaf.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 lg:gap-8 flex-shrink-0">
            <Link
              href="/delivery"
              className="text-white uppercase font-semibold hover:text-gray-100 transition-colors text-xs md:text-sm whitespace-nowrap"
            >
              ХҮРГЭЛТ
            </Link>
            <Link
              href="/return"
              className="text-white uppercase font-semibold hover:text-gray-100 transition-colors text-xs md:text-sm whitespace-nowrap"
            >
              БУЦААЛТ
            </Link>
            <Link
              href="/order"
              className="text-white uppercase font-semibold hover:text-gray-100 transition-colors text-xs md:text-sm whitespace-nowrap"
            >
              ЗАХИАЛГА
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

