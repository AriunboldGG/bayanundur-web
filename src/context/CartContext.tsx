"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  priceNum: number;
  price: string;
  img: string;
  color?: string;
  size?: string;
  brand?: string;
  theme?: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart_items");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart_items", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...item, qty }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) {
      removeItem(id);
    } else {
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
    }
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((n, p) => n + p.qty, 0), [items]);
  const total = useMemo(() => items.reduce((s, p) => s + p.qty * p.priceNum, 0), [items]);

  const value: CartContextValue = { items, addItem, updateQty, removeItem, clear, count, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


