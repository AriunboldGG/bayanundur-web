"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLink from "./NavLink";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { count } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="w-full bg-white">
      {/* Top Header Bar */}
      <div className="w-full bg-white border-b border-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          {/* Left: Social Media Icons */}
          <div className="flex items-center gap-2">
            <Link href="#" className="flex items-center justify-center">
              <Image 
                src="/svg/fb-logo.svg" 
                alt="Facebook" 
                width={20} 
                height={20}
                className="w-5 h-5"
              />
            </Link>
            <Link href="#" className="flex items-center justify-center">
              <Image 
                src="/svg/whatsupp-log.svg" 
                alt="WhatsApp" 
                width={20} 
                height={20}
                className="w-5 h-5"
              />
            </Link>
          </div>

         

          {/* Right: Contact Info */}
          <div className="flex items-center gap-2 justify-end whitespace-nowrap">
            <a
              href="mailto:info@bayan-undur.mn"
              className="flex items-center gap-1 text-gray-700 hover:underline"
            >
              <Image 
                src="/svg/email-logo.svg" 
                alt="Email" 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
              <span className="max-sm:text-[10px]">info@bayan-undur.mn</span>
            </a>
            <span className="text-gray-300 px-1">|</span>
            <a
              href="tel:70118585"
              className="flex items-center gap-1 text-gray-700 hover:underline"
            >
              <Image 
                src="/svg/phone-logo.svg" 
                alt="Phone" 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
              <span className="max-sm:text-[10px]">70118585</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-white border-b border-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/svg/main-logo.svg" 
              alt="БАЯН ӨНДӨР" 
              width={224} 
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Middle: Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/">НҮҮР</NavLink>
            <NavLink href="/products">БҮТЭЭГДЭХҮҮН</NavLink>
            <NavLink href="/news">МЭДЭЭ</NavLink>
            <NavLink href="/about">БИДНИЙ ТУХАЙ</NavLink>
            <NavLink href="/contact">ХОЛБОО БАРИХ</NavLink>
            <NavLink href="/special-order">ТУСГАЙ ЗАХИАЛГА</NavLink>
          </nav>

          {/* Right: Shopping Cart and Burger Menu */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart */}
            <div className="relative">
              <Link href="/cart" className="relative">
                <Image 
                  src="/svg/bag-logo.svg" 
                  alt="Shopping Cart" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
                <span className="absolute -top-2 -right-2 bg-[#8DC63F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              </Link>
            </div>

            {/* Burger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-800 hover:text-[#8DC63F] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <NavLink href="/" onClick={() => setIsMenuOpen(false)}>
                НҮҮР
              </NavLink>
              <NavLink href="/products" onClick={() => setIsMenuOpen(false)}>
                БҮТЭЭГДЭХҮҮН
              </NavLink>
              <NavLink href="/news" onClick={() => setIsMenuOpen(false)}>
                МЭДЭЭ
              </NavLink>
              <NavLink href="/about" onClick={() => setIsMenuOpen(false)}>
                БИДНИЙ ТУХАЙ
              </NavLink>
              <NavLink href="/contact" onClick={() => setIsMenuOpen(false)}>
                ХОЛБОО БАРИХ
              </NavLink>
              <NavLink href="/special-order" onClick={() => setIsMenuOpen(false)}>
                ТУСГАЙ ЗАХИАЛГА
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

