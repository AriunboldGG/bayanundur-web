import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-8 md:mt-12 bg-[#F5F5F5]">
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
            <div className="text-xs font-semibold text-gray-800 mb-1">Имэйл хаяг</div>
            <a
              href="mailto:info@bayan-undur.mn"
              className="text-sm text-gray-700 hover:underline mb-4 inline-block"
            >
              info@bayan-undur.mn
            </a>
            <div className="text-xs font-semibold text-gray-800 mb-1">Сошиал хаяг</div>
            <div className="mt-4 flex items-center gap-3">
              <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Image src="/svg/fb-footer.svg" alt="Facebook" width={9} height={14} />
              </Link>
              <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Image src="/svg/whatsupp-footer.svg" alt="WhatsApp" width={16} height={16} />
              </Link>
            </div>
          </div>

          {/* Address with Map */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">ХАЯГ</h4>
            <div className="text-xs text-gray-500 mb-4">Улаанбаатар хот, Хан-Уул дүүрэг, 20р хороо, Мишээл систи, М-1 тауэр, 11 давхарт 7,8 оффис</div>
            <div className="w-full overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1443.9520251627903!2d106.88475281061318!3d47.894673195821106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96930010cf9007%3A0xc7910f0df8d73ee!2sM1%20Tower!5e0!3m2!1sen!2smn!4v1764166660404!5m2!1sen!2smn"
                width="400"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-auto min-h-[250px] md:min-h-[300px]"
              />
            </div>
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


