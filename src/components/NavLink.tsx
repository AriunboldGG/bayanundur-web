"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavLink({ href, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-medium uppercase transition-colors ${
        isActive
          ? "text-[#1f632b] hover:text-[#1f632b]"
          : "text-gray-800 hover:text-[#1f632b]"
      }`}
    >
      {children}
    </Link>
  );
}

