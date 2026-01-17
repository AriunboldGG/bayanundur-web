"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, LifeBuoy, Wrench, Package, type LucideIcon } from "lucide-react";
import { getCategoryTree, type CategoryTreeNode } from "@/lib/products";

export default function SearchBar() {
  const router = useRouter();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  const [hoveredSub, setHoveredSub] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Icon mapping for Lucide icons
  const iconMap: Record<string, LucideIcon> = {
    Shield,
    LifeBuoy,
    Wrench,
    Package,
  };

  // Fetch categories from backend on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        const tree = await getCategoryTree();
        setCategoryTree(tree);
      } catch (error) {
        setCategoryTree([]);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

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

  // Handle search
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If no search query, just go to products page
      router.push("/products");
    }
  };

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
              placeholder="Бүтээгдэхүүн нэрээр хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 px-4 md:px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-sm md:text-base h-full"
            />

            {/* Search Icon Button */}
            <button 
              onClick={handleSearch}
              className="px-4 md:px-5 py-3 border-l border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center h-full cursor-pointer group"
            >
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
                  setHoveredCat(null);
                  setHoveredSub(null);
                }
              }}
            >
                <div className="flex flex-col md:flex-row">
                  {/* First column - Show on mobile only when no category selected, always on desktop */}
                  <div className={`w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 ${isMobile && hoveredCat !== null ? 'hidden md:block' : ''}`}>
                    {isLoadingCategories ? (
                      <div className="py-4 px-4 text-sm text-gray-500">ачаалж байна...</div>
                    ) : categoryTree.length === 0 ? (
                      <div className="py-4 px-4 text-sm text-gray-500">Ангилал олдсонгүй</div>
                    ) : (
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
                                {(() => {
                                  const IconComponent = cat.icon ? iconMap[cat.icon] : Shield;
                                  const Icon = IconComponent || Shield;
                                  return (
                                    <Icon className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 transition-colors ${
                                      hoveredCat === idx ? "text-[#1f632b]" : "text-gray-500"
                                    }`} />
                                  );
                                })()}
                                <span className="break-words">{cat.name}</span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Second column (subs) - Show when category is hovered */}
                  {hoveredCat !== null && hoveredCat >= 0 && categoryTree[hoveredCat] && (
                    <div 
                      className={`w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 ${isMobile && hoveredSub !== null ? 'hidden md:block' : ''}`}
                      style={{ display: 'block' }}
                    >
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
                      {categoryTree[hoveredCat]?.children && Array.isArray(categoryTree[hoveredCat].children) && categoryTree[hoveredCat].children!.length > 0 ? (
                        <ul className="py-2">
                          {categoryTree[hoveredCat].children!.map(
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
                              {sub.children && sub.children.length > 0 ? (
                                // If subcategory has children, show as button (for hover to show sub-subcategories)
                                <button
                                  className={`w-full text-left px-4 py-3 transition-all cursor-pointer rounded-md mx-2 ${
                                    hoveredSub === sIdx
                                      ? "bg-[#1f632b]/10 text-[#1f632b] font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="text-sm md:text-base break-words">{sub.name}</span>
                                </button>
                              ) : (
                                // If no children, make it a clickable link
                                <Link
                                  href={`/products?category=${encodeURIComponent(sub.name)}`}
                                  className={`w-full text-left px-4 py-3 transition-all cursor-pointer rounded-md mx-2 block ${
                                    hoveredSub === sIdx
                                      ? "bg-[#1f632b]/10 text-[#1f632b] font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                  onClick={() => setIsCategoryOpen(false)}
                                >
                                  <span className="text-sm md:text-base break-words">{sub.name}</span>
                                </Link>
                              )}
                            </li>
                          )
                          )}
                        </ul>
                      ) : (
                        <div className="py-4 px-4 text-sm text-gray-500">Дэд ангилал байхгүй</div>
                      )}
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
                            href={`/products?category=${encodeURIComponent(leaf.name)}`}
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

