"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FirebaseImage from "@/components/FirebaseImage";
import { useCart } from "@/context/CartContext";
import { X, Package, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { QuoteModal } from "@/components/QuoteModal";

export default function CartPage() {
  const { items, removeItem, clear, updateQty } = useCart();
  const [showQuote, setShowQuote] = useState(false);

  // Debug: Log items to see what's in cart
  useEffect(() => {
    console.log("🛒 Cart items:", items.length, "items");
    console.log("🛒 Items details:", items);
  }, [items]);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Таны сагс</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">Таны сагс хоосон байна</p>
            <Button className="bg-[#8DC63F] hover:bg-[#7AB82E] cursor-pointer" asChild>
              <a href="/products">Бүтээгдэхүүн харах</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Left: Cart Items */}
            <div className="space-y-4">
              {/* Delivery Info Card */}
              <Card className="rounded-xl border border-gray-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <Package className="h-6 w-6 text-[#8DC63F]" />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Энгийн хүргэлт</div>
                    <div className="text-xs text-gray-600">24-48 цагийн хооронд хүргэгдэнэ.</div>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Items */}
              {items.map((item, index) => (
                <Card key={`${item.id}-${item.size || ''}-${item.color || ''}-${item.theme || ''}-${index}`} className="rounded-xl border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      <div className="relative w-full md:w-24 h-32 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <FirebaseImage
                          src={item.img || ""}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-3">
                        {/* Title */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">{item.name}</div>
                            <div className="mt-1">
                              <div className="text-[10px] text-gray-500">Бүтээгдэхүүний код</div>
                              <div className="text-xs font-semibold text-[#1f632b]">{item.modelNumber}</div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.size && `Хэмжээ: ${item.size}`}
                              {item.color && ` • Өнгө: ${item.color}`}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => removeItem(item.id, item)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            >
                              <X className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                       

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-600">Тоо ширхэг:</span>
                            <div className="flex items-center border border-gray-200 rounded">
                              <button
                                onClick={() => updateQty(item.id, item.qty - 1, item)}
                                className="px-2 py-1 hover:bg-gray-50 text-gray-600 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-sm border-x border-gray-200 min-w-[40px] text-center">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, item.qty + 1, item)}
                                className="px-2 py-1 hover:bg-gray-50 text-gray-600 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                         
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right: Payment Summary */}
            <div className="lg:sticky lg:top-4 h-fit">
              <Card className="rounded-xl border border-gray-200 shadow-sm sticky top-4">
                <CardContent className="p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">Сагсны мэдээлэл</h2>

                  {/* Clear Cart Button */}
                  <Button
                    variant="outline"
                    onClick={clear}
                    className="w-full justify-start gap-2 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Сагс хоослох
                  </Button>

                  {/* Item Count */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Бүтээгдэхүүн ({items.length})
                    </div>
                  </div>

                  {/* Send Quote Button */}
                  <Button
                    onClick={() => setShowQuote(true)}
                    className="w-full bg-[#8DC63F] hover:bg-[#7AB82E] text-white cursor-pointer"
                  >
                    Үнийн санал авах
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <QuoteModal 
        open={showQuote} 
        onClose={() => setShowQuote(false)} 
        items={items.length > 0 ? [...items] : []} 
      />
    </main>
  );
}

