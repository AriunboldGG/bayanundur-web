"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { 
  FaBuilding, 
  FaFire, 
  FaRoad, 
  FaMountain, 
  FaIndustry, 
  FaBolt,
  FaShieldAlt,
  FaTools,
  FaBox
} from "react-icons/fa";
import { getSectors, type Sector } from "@/lib/products";

// Icon mapping for sectors
const iconMap: Record<string, IconType> = {
  FaBuilding,
  FaFire,
  FaRoad,
  FaMountain,
  FaIndustry,
  FaBolt,
  FaShieldAlt,
  FaTools,
  FaBox,
};

// Default icon if sector doesn't have one
const DefaultIcon = FaBox;

export default function ProductSectors() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSectors() {
      try {
        setIsLoading(true);
        const sectorsData = await getSectors();
        setSectors(sectorsData);
      } catch (error) {
        console.error("Error fetching sectors:", error);
        setSectors([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSectors();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Салбарын ангилал</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (sectors.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Салбарын ангилал</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {sectors.map((sector) => {
          const Icon = (sector.icon && iconMap[sector.icon]) ? iconMap[sector.icon] : DefaultIcon;
          return (
            <Link
              key={sector.id}
              href={`/products?sector=${encodeURIComponent(sector.name)}`}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-[#1f632b] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="aspect-square flex flex-col items-center justify-center p-4 md:p-6">
                <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-lg bg-[#1f632b]/10 group-hover:bg-[#1f632b]/20 transition-colors mb-3">
                  <Icon className="h-6 w-6 md:h-8 md:w-8 text-[#1f632b]" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700 text-center group-hover:text-[#1f632b] transition-colors">
                  {sector.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
