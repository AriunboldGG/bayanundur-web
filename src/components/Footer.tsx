"use client";

import Image from "next/image";
import Link from "next/link";
import { FaWeixin } from "react-icons/fa";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";

export default function Footer() {
  const { companyInfo } = useCompanyInfo();
  return (
    <footer className="w-full border-t mt-8 md:mt-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">ХОЛБОО БАРИХ</h4>
            <div className="text-xs font-semibold text-gray-800 mb-1">УТАС</div>
            <a
              href={`tel:${companyInfo.phone}`}
              className="text-2xl font-bold text-[#1D75B7] mb-4 inline-block hover:underline"
            >
              {companyInfo.phone}
            </a>
            {companyInfo.mobilePhone ? (
              <>
                <div className="text-xs font-semibold text-gray-800 mb-1">ГАР УТАС</div>
                <a
                  href={`tel:${companyInfo.mobilePhone}`}
                  className="text-lg font-semibold text-[#1D75B7] mb-4 inline-block hover:underline"
                >
                  {companyInfo.mobilePhone}
                </a>
              </>
            ) : null}
            <div className="text-xs font-semibold text-gray-800 mb-1">Имэйл хаяг</div>
            <a
              href={`mailto:${companyInfo.email}`}
              className="text-sm text-gray-700 hover:underline mb-4 inline-block"
            >
              {companyInfo.email}
            </a>
            <div className="text-xs font-semibold text-gray-800 mb-1">Сошиал хаяг</div>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={companyInfo.facebookUrl || "#"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                target={companyInfo.facebookUrl ? "_blank" : undefined}
                rel={companyInfo.facebookUrl ? "noopener noreferrer" : undefined}
              >
                <Image src="/svg/fb-footer.svg" alt="Facebook" width={9} height={14} />
              </a>
              {companyInfo.wechatUrl ? (
                <a
                  href={companyInfo.wechatUrl}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WeChat"
                >
                  <FaWeixin className="w-4 h-4" />
                </a>
              ) : null}
              <a
                href={companyInfo.whatsappUrl || "#"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                target={companyInfo.whatsappUrl ? "_blank" : undefined}
                rel={companyInfo.whatsappUrl ? "noopener noreferrer" : undefined}
              >
                <Image src="/svg/whatsupp-footer.svg" alt="WhatsApp" width={16} height={16} />
              </a>
            </div>
          </div>

          {/* Address with Map */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">ХАЯГ</h4>
            <div className="text-xs text-gray-500 mb-4">{companyInfo.address}</div>
            {companyInfo.mapEmbedUrl ? (
              <div className="w-full overflow-hidden rounded-lg">
                <iframe
                  src={companyInfo.mapEmbedUrl}
                  title="Company location map"
                  width="400"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-auto min-h-[250px] md:min-h-[300px]"
                />
              </div>
            ) : null}
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">БИДНИЙ ТУХАЙ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:underline">Бидний тухай</Link></li>

            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">ХАРИЛЦАГЧДАД ЗОРИУЛСАН</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#">Policy</Link></li>
              <li><Link href="#">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex items-center justify-between text-xs text-gray-500">
          <div>© 2026 БАЯН ӨНДӨР. Бүх эрх хуулиар хамгаалагдсан</div>
          <div className="flex items-center gap-4">
            {/* <Image src="/svg/mastercard.svg" alt="Mastercard" width={36} height={22} />
            <Image src="/svg/visa.svg" alt="Visa" width={36} height={22} /> */}
          </div>
        </div>
      </div>
    </footer>
  );
}


