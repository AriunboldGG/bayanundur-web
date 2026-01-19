"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
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
  FaBox,
  FaHardHat,
  FaTruck,
  FaWarehouse,
  FaFlask,
  FaLeaf,
  FaRecycle,
  FaHammer,
  FaBriefcase,
  FaHandsHelping
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
  FaHardHat,
  FaTruck,
  FaWarehouse,
  FaFlask,
  FaLeaf,
  FaRecycle,
  FaHammer,
  FaBriefcase,
  FaHandsHelping,
};

// Default icon if sector doesn't have one
const DefaultIcon = FaBox;

const keywordIconMap: Array<{ keywords: string[]; icon: IconType }> = [
  { keywords: ["барилга", "construction", "build"], icon: FaHardHat },
  { keywords: ["гал", "fire"], icon: FaFire },
  { keywords: ["зам", "road"], icon: FaRoad },
  { keywords: ["уул", "mine", "mining"], icon: FaMountain },
  { keywords: ["үйлдвэр", "industry", "factory"], icon: FaIndustry },
  { keywords: ["цахилгаан", "energy", "electric"], icon: FaBolt },
  { keywords: ["хамгаал", "safety", "hse"], icon: FaShieldAlt },
  { keywords: ["багаж", "tool"], icon: FaTools },
  { keywords: ["агуулах", "warehouse", "storage"], icon: FaWarehouse },
  { keywords: ["тээвэр", "transport", "logistic"], icon: FaTruck },
  { keywords: ["хими", "chemical", "lab"], icon: FaFlask },
  { keywords: ["ногоон", "eco", "environment"], icon: FaLeaf },
  { keywords: ["дахин", "recycle"], icon: FaRecycle },
  { keywords: ["засвар", "service", "maintenance"], icon: FaHammer },
  { keywords: ["зөвлөх", "service", "support"], icon: FaHandsHelping },
  { keywords: ["офис", "business", "office"], icon: FaBriefcase },
];

function resolveSectorIcon(sector: Sector): IconType {
  if (sector.icon && iconMap[sector.icon]) {
    return iconMap[sector.icon];
  }
  const name = `${sector.name || ""} ${sector.slug || ""}`.toLowerCase();
  for (const entry of keywordIconMap) {
    if (entry.keywords.some((keyword) => name.includes(keyword))) {
      return entry.icon;
    }
  }
  return DefaultIcon;
}

type ProductSectorsVariant = "inline" | "floating";

export default function ProductSectors({
  variant = "inline",
}: {
  variant?: ProductSectorsVariant;
}) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSectors() {
      try {
        setIsLoading(true);
        const sectorsData = await getSectors();
        setSectors(sectorsData);
      } catch (error) {
        setSectors([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSectors();
  }, []);

  const iconAssignments = useMemo(() => {
    const used = new Set<IconType>();
    const assigned = new Map<string, IconType>();
    const fallbackIcons: IconType[] = [
      FaHardHat,
      FaFire,
      FaRoad,
      FaMountain,
      FaIndustry,
      FaBolt,
      FaShieldAlt,
      FaTools,
      FaWarehouse,
      FaTruck,
      FaFlask,
      FaLeaf,
      FaRecycle,
      FaHammer,
      FaBriefcase,
      FaHandsHelping,
      FaBox,
    ];

    sectors.forEach((sector) => {
      let icon = resolveSectorIcon(sector);
      if (used.has(icon)) {
        const next = fallbackIcons.find((candidate) => !used.has(candidate));
        if (next) {
          icon = next;
        }
      }
      assigned.set(sector.id, icon);
      used.add(icon);
    });

    return assigned;
  }, [sectors]);

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

  if (variant === "floating") {
    const visibleSectors = sectors.slice(0, 7);
    return (
      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40">
        <div className="rounded-full bg-white shadow-xl border border-gray-100 px-2 py-3 overflow-visible">
          <div className="flex flex-col items-center gap-3">
            {visibleSectors.map((sector) => {
              const Icon = iconAssignments.get(sector.id) || resolveSectorIcon(sector);
              return (
                <Link
                  key={sector.id}
                  href={`/products?sector=${encodeURIComponent(sector.name)}`}
                  className="group relative flex items-center justify-center"
                  aria-label={sector.name}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-gray-200 text-[#1f632b] shadow-sm transition-all group-hover:border-[#1f632b] group-hover:shadow-md">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1f632b] px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {sector.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Салбарын ангилал</h2>
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        {sectors.map((sector) => {
          const Icon = iconAssignments.get(sector.id) || resolveSectorIcon(sector);
          return (
            <Link
              key={sector.id}
              href={`/products?sector=${encodeURIComponent(sector.name)}`}
              className="group relative flex flex-col items-center"
              aria-label={sector.name}
            >
              <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm transition-all group-hover:border-[#1f632b] group-hover:shadow-md">
                <Icon className="h-6 w-6 md:h-7 md:w-7 text-[#1f632b]" />
              </div>
              <span className="pointer-events-none absolute -bottom-8 whitespace-nowrap rounded-full bg-[#1f632b] px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {sector.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
