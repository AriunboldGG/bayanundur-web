"use client";

import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="w-full bg-white">
      {/* Top Header Bar */}
      <div className="w-full bg-white border-b border-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
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
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <a href="mailto:info@bayan-undur.mn" className="flex items-center gap-2 text-gray-700 hover:underline">
              <Image 
                src="/svg/email-logo.svg" 
                alt="Email" 
                width={20} 
                height={20}
                className="w-5 h-5"
              />
              <span className="text-xs sm:text-sm">info@bayan-undur.mn</span>
            </a>
            <a href="tel:70118585" className="flex items-center gap-2 text-gray-700 hover:underline">
              <Image 
                src="/svg/phone-logo.svg" 
                alt="Phone" 
                width={20} 
                height={20}
                className="w-5 h-5"
              />
              <span className="text-xs sm:text-sm">70118585</span>
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

          {/* Middle: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/">НҮҮР</NavLink>
            <NavLink href="/products">БҮТЭЭГДЭХҮҮН</NavLink>
            <NavLink href="/news">МЭДЭЭ</NavLink>
            <NavLink href="/about">БИДНИЙ ТУХАЙ</NavLink>
          </nav>

          {/* Right: Shopping Cart */}
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
        </div>
      </div>
    </header>
  );
}

