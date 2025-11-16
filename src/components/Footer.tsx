import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-8 md:mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">ХОЛБОО БАРИХ</h4>
            <div className="text-xs font-semibold text-gray-800 mb-1">УТАС</div>
            <a
              href="tel:70118585"
              className="text-2xl font-bold text-[#1D75B7] mb-4 inline-block hover:underline"
            >
              70118585
            </a>
            <div className="text-xs font-semibold text-gray-800 mb-1">ХАЯГ</div>
            <div className="text-xs text-gray-500 mb-1">Улаанбаатар хот, Хан-Уул дүүрэг, 20р хороо, Мишээл систи, М-1 тауэр, 11 давхарт 7,8 оффис</div>
            <div className="text-xs font-semibold text-gray-800 mb-1">Имэйл хаяг</div>
            <a
              href="mailto:info@bayan-undur.mn"
              className="text-sm text-gray-700 hover:underline"
            >
              info@bayan-undur.mn
            </a>
            <div className="mt-4 flex items-center gap-3">
              <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Image src="/svg/fb-footer.svg" alt="Facebook" width={9} height={14} />
              </Link>
              <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Image src="/svg/whatsupp-footer.svg" alt="WhatsApp" width={16} height={16} />
              </Link>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">ЭРЭЛТТЭЙ БҮТЭЭГДЭХҮҮН</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#">Laptops</Link></li>
             
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">БИДНИЙ ТУХАЙ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#">About Swoo</Link></li>

            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">ХАРИЛЦАГЧДАД ЗОРИУЛСАН</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#">Customer Service</Link></li>
              <li><Link href="#">Policy</Link></li>
              <li><Link href="#">Terms & Conditions</Link></li>
              <li><Link href="#">FAQs</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex items-center justify-between text-xs text-gray-500">
          <div>© 2025 . All Rights Reserved</div>
          <div className="flex items-center gap-4">
            <Image src="/svg/mastercard.svg" alt="Mastercard" width={36} height={22} />
            <Image src="/svg/visa.svg" alt="Visa" width={36} height={22} />
          </div>
        </div>
      </div>
    </footer>
  );
}


