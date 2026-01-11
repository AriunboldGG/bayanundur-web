import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "БАЯН ӨНДӨР компанийн тухай мэдээлэл. ХАБЭА хамгаалах хувцас хэрэгсэл, аврах багаж хэрэгсэл нийлүүлэгч.",
  openGraph: {
    title: "Бидний тухай | БАЯН ӨНДӨР",
    description: "БАЯН ӨНДӨР компанийн тухай мэдээлэл",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">БИДНИЙ ТУХАЙ</h1>
        <p className="text-gray-600 text-lg">About us page content coming soon...</p>
      </div>
    </main>
  );
}

