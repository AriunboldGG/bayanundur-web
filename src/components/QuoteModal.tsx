 "use client";

import { Button } from "@/components/ui/button";
import { CartItem } from "@/context/CartContext";
import { useState } from "react";

type QuoteModalProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
};

export function QuoteModal({ open, onClose, items }: QuoteModalProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const firstName = (formData.get("firstName") as string) ?? "";
    const lastName = (formData.get("lastName") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const phone = (formData.get("phone") as string) ?? "";
    const note = (formData.get("note") as string) ?? "";
    const position = (formData.get("position") as string) ?? "";
    const company = (formData.get("company") as string) ?? "";

    const subject = "Үнийн санал хүсэлт";

    const lines: string[] = [];
    lines.push("Хувийн мэдээлэл");
    lines.push(`Нэр: ${firstName}`);
    lines.push(`Овог: ${lastName}`);
    lines.push(`И-мэйл: ${email}`);
    lines.push(`Утас: ${phone}`);
    lines.push(`Албан тушаал: ${position}`);
    lines.push(`Компани: ${company}`);
    lines.push("");
    lines.push("Нэмэлт мэдээлэл");
    lines.push(note);
    lines.push("");
    lines.push("Сагсанд буй бүтээгдэхүүнүүд");

    if (items.length === 0) {
      lines.push("Сагс хоосон байна.");
    } else {
      items.forEach((item, idx) => {
        const parts: string[] = [];
        parts.push(`${idx + 1}) ID: ${item.id}`);
        parts.push(`Нэр: ${item.name}`);
        if (item.brand) parts.push(`Брэнд: ${item.brand}`);
        if (item.color) parts.push(`Өнгө: ${item.color}`);
        if (item.size) parts.push(`Хэмжээ: ${item.size}`);
        if (item.theme) parts.push(`Загвар: ${item.theme}`);
        parts.push(`Тоо ширхэг: ${item.qty}`);
        lines.push(parts.join(" | "));
      });
    }

    const body = encodeURIComponent(lines.join("\n"));
    const mailto = `mailto:ganbatariunbold8@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    window.location.href = mailto;
    setSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Үнийн санал авах</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <span className="sr-only">Хаах</span>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Нэр <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="firstName"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Овог <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="lastName"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Үнийн санал хүлээн авах и-мэйл хаяг <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                name="email"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Утас <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="phone"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Нэмэлт мэдээлэл <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                name="note"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Албан тушаал <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="position"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Компани <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="company"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              className="text-sm"
              onClick={onClose}
              disabled={submitting}
            >
              Болих
            </Button>
            <Button
              type="submit"
              className="bg-[#8DC63F] hover:bg-[#7AB82E] text-sm"
              disabled={submitting}
            >
              {submitting ? "Илгээж байна..." : "Илгээх"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


