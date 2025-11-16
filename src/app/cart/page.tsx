import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Сагс</h1>
        <p className="text-gray-600 text-lg mb-6">Shopping cart content coming soon...</p>
        <Button variant="default">shadcn/ui Button</Button>
      </div>
    </main>
  );
}

