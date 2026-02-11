"use client";

import FirebaseImage from "@/components/FirebaseImage";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";

export default function AboutContent() {
  const { companyInfo } = useCompanyInfo();
  const description =
    companyInfo.aboutDescription ||
    "Манай компанийн тухай мэдээлэл тун удахгүй.";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            БИДНИЙ ТУХАЙ
          </h1>
          <p className="text-black text-base md:text-lg leading-7 whitespace-pre-line">
            {description}
          </p>
        </div>
        <div className="w-full">
          {companyInfo.aboutImageUrl ? (
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border bg-white shadow-sm">
              <FirebaseImage
                src={companyInfo.aboutImageUrl}
                alt="Company"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full aspect-[4/3] rounded-2xl border bg-gray-50 text-gray-400">
              Зураг байхгүй
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
