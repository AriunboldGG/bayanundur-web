import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] gap-3">
      {/* Left pill banner */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8DC63F] to-[#7AB82E]" />
        <div className="relative px-6 py-6 text-white">
          <div className="text-xs opacity-90">УРЬДЧИЛСАН</div>
          <div className="text-lg font-extrabold leading-tight">ЗАХИАЛГА</div>
          <div className="mt-3 text-[11px] opacity-90">150,000₮</div>
        </div>
        <div className="absolute right-0 top-0 h-full w-10 bg-[#5D85A5] opacity-60 clip-path-[ellipse(60%_50%_at_50%_50%)]" />
      </div>

      {/* Center product image */}
      <div className="relative h-20 md:h-auto md:w-24 flex items-center justify-center">
        {/* Image will be rendered here when src is provided */}
      </div>

      {/* Right wide banner */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5D85A5] via-[#7AB82E] to-[#8DC63F]" />
        <div className="relative flex items-center justify-between px-6 py-6">
          <div className="text-white">
            <div className="text-base md:text-lg font-semibold">
              Тун удахгүй
            </div>
          </div>
          <Button size="sm" className="bg-white text-gray-800 hover:bg-gray-100">
            Хүсэлт илгээх
          </Button>
        </div>
        <div className="absolute left-1/3 top-0 h-full w-14 bg-[#5D85A5] opacity-50 clip-path-[ellipse(60%_50%_at_50%_50%)]" />
      </div>
    </div>
  );
}


