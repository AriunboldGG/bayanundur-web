 "use client";

import { Button } from "@/components/ui/button";
import { CartItem } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { saveQuoteToFirestore } from "@/lib/quotes";

type QuoteModalProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
};

export function QuoteModal({ open, onClose, items }: QuoteModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Log items when modal opens or items change
  useEffect(() => {
    if (open) {
      console.log("🔍 QuoteModal opened with items:", items.length, "items");
      console.log("🔍 Items:", items);
    }
  }, [open, items]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    const firstName = (formData.get("firstName") as string) ?? "";
    const lastName = (formData.get("lastName") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const phone = (formData.get("phone") as string) ?? "";
    const note = (formData.get("note") as string) ?? "";
    const position = (formData.get("position") as string) ?? "";
    const company = (formData.get("company") as string) ?? "";

    try {
      // Log items before sending
      console.log("📋 Quote form submitted with items:", items.length, "items");
      console.log("📋 Items array:", items);
      
      // Ensure items is an array and create a copy
      const itemsToSave = Array.isArray(items) ? [...items] : [];
      
      if (itemsToSave.length === 0) {
        setError("Сагсанд бүтээгдэхүүн байхгүй байна.");
        setSubmitting(false);
        return;
      }

      // Save to Firestore
      await saveQuoteToFirestore({
        firstName,
        lastName,
        email,
        phone,
        note,
        position,
        company,
        items: itemsToSave,
      });

      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error("Error saving quote:", err);
      setError(err.message || "Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Үнийн санал авах</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <span className="sr-only">Хаах</span>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3">
              <p className="text-sm text-green-800">✅ Үнийн санал амжилттай илгээгдлээ!</p>
            </div>
          )}
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
              className="text-sm cursor-pointer"
              onClick={onClose}
              disabled={submitting}
            >
              Болих
            </Button>
            <Button
              type="submit"
              className="bg-[#8DC63F] hover:bg-[#7AB82E] text-sm cursor-pointer"
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


