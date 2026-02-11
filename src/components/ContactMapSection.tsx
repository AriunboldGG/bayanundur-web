"use client";

import { useCompanyInfo } from "@/hooks/useCompanyInfo";

export default function ContactMapSection() {
  const { companyInfo } = useCompanyInfo();
  const defaultMapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2675.1584418996117!2d106.88357267590312!3d47.89461856804502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96930010cf9007%3A0xc7910f0df8d73ee!2sM1%20Tower!5e0!3m2!1sen!2smn!4v1768798097551!5m2!1sen!2smn";

  return (
    <div className="w-full">
      <div className="rounded-xl border bg-white p-3 shadow-sm">
        <div className="text-sm font-semibold text-gray-800 mb-3">Show room</div>
        <div className="w-full overflow-hidden rounded-lg">
          <iframe
            src={companyInfo.mapEmbedUrl || defaultMapEmbedUrl}
            title="Show room"
            width="400"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-auto min-h-[300px] md:min-h-[360px]"
          />
        </div>
      </div>
    </div>
  );
}
