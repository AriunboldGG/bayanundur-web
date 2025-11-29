"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SpecialOrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    productName: "",
    productDescription: "",
    quantity: "",
    specifications: "",
    deliveryDate: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission (replace with actual API call)
    try {
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For now, just log the data and show success
      console.log("Special Order Request:", formData);
      
      setSubmitStatus("success");
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          productName: "",
          productDescription: "",
          quantity: "",
          specifications: "",
          deliveryDate: "",
          additionalInfo: "",
        });
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            ТУСГАЙ ЗАХИАЛГА
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-8">
            Бидний каталогт байхгүй бүтээгдэхүүний үнийн санал авах, тусгай захиалга өгөх
          </p>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Холбоо барих мэдээлэл</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Нэр <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent"
                      placeholder="Таны нэр"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Имэйл <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent"
                      placeholder="Таны имэйл хаяг"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Утас <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent"
                      placeholder="Таны утасны дугаар"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Байгууллагын нэр
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent"
                      placeholder="Байгууллагын нэр"
                    />
                  </div>
                </div>
              </div>

              {/* Product Information Section */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Бүтээгдэхүүний мэдээлэл</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                      Бүтээгдэхүүний нэр <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      required
                      value={formData.productName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent"
                      placeholder="Бүтээгдэхүүний нэр"
                    />
                  </div>

                  <div>
                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Бүтээгдэхүүний тайлбар <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="productDescription"
                      name="productDescription"
                      required
                      rows={4}
                      value={formData.productDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent resize-none"
                      placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Тоо ширхэг <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent"
                        placeholder="Жишээ: 10, 50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-2">
                      Техникийн шаардлага / Хэмжээ, хэлбэр
                    </label>
                    <textarea
                      id="specifications"
                      name="specifications"
                      rows={3}
                      value={formData.specifications}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent resize-none"
                      placeholder="Техникийн шаардлага, хэмжээ, хэлбэр, өнгө гэх мэт..."
                    />
                  </div>

                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                      Нэмэлт мэдээлэл
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      rows={3}
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f632b] focus:border-transparent resize-none"
                      placeholder="Нэмэлт мэдээлэл, санал хүсэлт..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-6">
                {submitStatus === "success" && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    Таны хүсэлт амжилттай илгээгдлээ! Бид удахгүй танд холбогдох болно.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    Алдаа гарлаа. Дахин оролдоно уу эсвэл утсаар холбогдоно уу.
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#1f632b] hover:bg-[#16451e] text-white font-semibold py-3 px-8 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Илгээж байна..." : "Илгээх"}
                </Button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Анхаарна уу:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">

              <li>Хүргэлтийн хугацаа нь бүтээгдэхүүний төрөл, тоо ширхэгээс хамаарна</li>
              <li>Нэмэлт асуулт байвал утсаар холбогдоно уу: 70118585</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

