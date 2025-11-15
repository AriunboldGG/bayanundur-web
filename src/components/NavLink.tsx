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
          ? "text-green-500 hover:text-green-600"
          : "text-gray-800 hover:text-green-500"
      }`}
    >
      {children}
    </Link>
  );
}

