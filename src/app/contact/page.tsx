import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">ХОЛБОО БАРИХ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
         

            {/* Email */}
            <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#8DC63F] transition-colors">
              <div className="flex-shrink-0">
                <Image 
                  src="/svg/email-logo.svg" 
                  alt="Email" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Имэйл</h3>
                <a
                  href="mailto:info@bayan-undur.mn"
                  className="text-[#8DC63F] hover:text-[#7AB82E] hover:underline transition-colors"
                >
                  info@bayan-undur.mn
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#8DC63F] transition-colors">
              <div className="flex-shrink-0">
                <Image 
                  src="/svg/phone-logo.svg" 
                  alt="Phone" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Утас</h3>
                <a
                  href="tel:70118585"
                  className="text-[#8DC63F] hover:text-[#7AB82E] hover:underline transition-colors"
                >
                  70118585
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-gray-600">📱</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Сошиал хаягууд</h3>
                <div className="flex items-center gap-4">
                  <Link href="#" className="hover:opacity-80 transition-opacity">
                    <Image 
                      src="/svg/fb-logo.svg" 
                      alt="Facebook" 
                      width={32} 
                      height={32}
                      className="w-8 h-8"
                    />
                  </Link>
                  <Link href="#" className="hover:opacity-80 transition-opacity">
                    <Image 
                      src="/svg/whatsupp-log.svg" 
                      alt="WhatsApp" 
                      width={32} 
                      height={32}
                      className="w-8 h-8"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </main>
  );
}

