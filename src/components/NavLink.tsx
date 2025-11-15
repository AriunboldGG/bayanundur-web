"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`font-medium uppercase transition-colors ${
        isActive
          ? "text-[#8DC63F] hover:text-[#7AB82E]"
          : "text-gray-800 hover:text-[#8DC63F]"
      }`}
    >
      {children}
    </Link>
  );
}

