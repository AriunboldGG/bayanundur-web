"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function SearchBar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full bg-[#8DC63F] py-3 md:py-4">
      <div className="container mx-auto px-4">
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

            {/* Category Dropdown Menu */}
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <Link
                    href="/products?category=all"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#8DC63F]/10 hover:text-[#8DC63F] transition-colors"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    Бүх ангилал
                  </Link>
                  <Link
                    href="/products?category=laptops"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#8DC63F]/10 hover:text-[#8DC63F] transition-colors"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    Laptops
                  </Link>
                  <Link
                    href="/products?category=phones"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#8DC63F]/10 hover:text-[#8DC63F] transition-colors"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    Cell Phones
                  </Link>
                  <Link
                    href="/products?category=tablets"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#8DC63F]/10 hover:text-[#8DC63F] transition-colors"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    Tablets
                  </Link>
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
  );
}

