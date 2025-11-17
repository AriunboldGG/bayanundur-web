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

          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Санал хүсэлт илгээх</h2>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Нэр *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                  placeholder="Таны нэр"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Имэйл *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                  placeholder="Таны имэйл хаяг"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Утас
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                  placeholder="Таны утасны дугаар"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Сэдэв *
                </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                    placeholder="Мессежийн сэдэв"
                  />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Мессеж *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent resize-none"
                  placeholder="Таны мессеж..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8DC63F] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#7AB82E] transition-colors cursor-pointer"
              >
                Илгээх
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

