import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CartItem } from "@/context/CartContext";

export type QuoteData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note: string;
  position: string;
  company: string;
  items: CartItem[];
  createdAt?: any;
  status?: "pending" | "processed" | "completed";
};

/**
 * Save a quote request to Firestore
 */
export async function saveQuoteToFirestore(data: QuoteData): Promise<string> {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized");
  }

  try {
    // Log items to debug


    // Ensure we have a proper array and map all items
    const itemsArray = Array.isArray(data.items) ? data.items : [];
    
    const quoteData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      note: data.note,
      position: data.position,
      company: data.company,
      items: itemsArray.map((item, index) => {
        // Ensure qty is a number and is valid
        const quantity = typeof item.qty === 'number' && item.qty > 0 ? item.qty : 1;
        
        // Determine status_type based on stock
        const statusType = item.stock !== undefined && item.stock > 0 ? "Бэлэн байгаа" : "Захиалгаар";
        
        const mappedItem = {
          id: item.id,
          name: item.name,
          priceNum: item.priceNum,
          price: item.price,
          img: item.img,
          modelNumber: item.modelNumber,
          color: item.color || null,
          size: item.size || null,
          brand: item.brand || null,
          theme: item.theme || null,
          qty: quantity, // Use validated quantity
          status_type: statusType, // Add status_type field
        };
        console.log(`📦 Item ${index + 1}:`, mappedItem);
        console.log(`📦 Item ${index + 1} quantity:`, quantity, "(original:", item.qty, ")");
        return mappedItem;
      }),
      status: "pending",
      createdAt: serverTimestamp(),
    };

    console.log("📦 Final quote data items count:", quoteData.items.length);
    
    const docRef = await addDoc(collection(db, "quotes"), quoteData);
    console.log("✅ Quote saved to Firestore with ID:", docRef.id);
    console.log("✅ Total items saved:", quoteData.items.length);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving quote to Firestore:", error);
    throw error;
  }
}

export type SpecialOrderData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  productName: string;
  productDescription: string;
  quantity: string;
  specifications: string;
  deliveryDate: string;
  additionalInfo: string;
  createdAt?: any;
  status?: "pending" | "processed" | "completed";
};

/**
 * Save a special order request to Firestore
 */
export async function saveSpecialOrderToFirestore(data: SpecialOrderData): Promise<string> {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized");
  }

  try {
    const specialOrderData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || "",
      productName: data.productName,
      productDescription: data.productDescription,
      quantity: data.quantity,
      specifications: data.specifications || "",
      deliveryDate: data.deliveryDate || "",
      additionalInfo: data.additionalInfo || "",
      status: "pending",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "special_quotes"), specialOrderData);
    console.log("✅ Special order saved to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving special order to Firestore:", error);
    throw error;
  }
}
