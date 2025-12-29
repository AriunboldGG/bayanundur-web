import { db, storage } from "./firebase";
import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

export type Product = {
  id: number;
  firestoreId: string; // Unique Firestore document ID
  name: string;
  price: string;
  img: string;
  images?: string[]; // Multiple images for gallery
  modelNumber: string;
  category: "ppe" | "rescue" | "workplace" | "other";
  subcategory: string;
  subleaf: string;
  color: string;
  brand: string;
  size: string;
  priceNum: number;
  stock: "in_stock" | "preorder";
  stockCount: number;
  theme: string;
};

/**
 * Get Firebase Storage URL for an image path
 * If the path is already a full URL, return it as-is
 * If it's a Firebase Storage path, get the download URL
 * Otherwise, return the path as-is (for local images)
 */
export async function getImageUrl(imagePath: string): Promise<string> {
  // If already a full URL (http/https), return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a Firebase Storage path (starts with gs:// or doesn't start with /)
  // Try to get download URL from Firebase Storage
  if (storage && !imagePath.startsWith("/")) {
    try {
      const storageRef = ref(storage, imagePath);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.warn(`Failed to get Firebase Storage URL for ${imagePath}:`, error);
      // Fallback to the path as-is
      return imagePath;
    }
  }

  // For local paths (starting with /), return as-is
  return imagePath;
}

/**
 * Get multiple image URLs from Firebase Storage
 */
export async function getImageUrls(imagePaths: string[]): Promise<string[]> {
  return Promise.all(imagePaths.map(path => getImageUrl(path)));
}

// Helper function to extract value from Firestore data (handles both direct values and Firestore format)
function getFirestoreValue(data: any, field: string, defaultValue: any = ""): any {
  if (!data || !data[field]) return defaultValue;
  const value = data[field];
  // Firestore might return values in different formats
  // Handle direct values
  if (typeof value !== "object" || value === null) return value;
  // Handle Firestore typed values (for REST API compatibility)
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
  if (value.doubleValue !== undefined) return parseFloat(value.doubleValue);
  if (value.booleanValue !== undefined) return value.booleanValue;
  // Return as-is if it's already the correct format
  return value;
}

// Convert Firestore document to Product type
function firestoreDocToProduct(docId: string, data: any): Product {
  // Try to parse document ID as number if id field is missing
  const docIdNum = parseInt(docId, 10) || 0;
  
  // Handle images array
  const imagesValue = getFirestoreValue(data, "images");
  let images: string[] | undefined;
  if (imagesValue) {
    if (Array.isArray(imagesValue)) {
      images = imagesValue;
    } else if (typeof imagesValue === "string") {
      // If it's a comma-separated string, split it
      images = imagesValue.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
  }
  
  return {
    id: getFirestoreValue(data, "id") || docIdNum,
    firestoreId: docId, // Always use Firestore document ID as unique identifier
    name: getFirestoreValue(data, "name") || "",
    price: getFirestoreValue(data, "price") || "0₮",
    img: getFirestoreValue(data, "img") || getFirestoreValue(data, "image") || "",
    images: images, // Multiple images for gallery
    modelNumber: getFirestoreValue(data, "modelNumber") || "",
    category: (getFirestoreValue(data, "category") || "other") as Product["category"],
    subcategory: getFirestoreValue(data, "subcategory") || "",
    subleaf: getFirestoreValue(data, "subleaf") || "",
    color: getFirestoreValue(data, "color") || "",
    brand: getFirestoreValue(data, "brand") || "",
    size: getFirestoreValue(data, "size") || "",
    priceNum: getFirestoreValue(data, "priceNum") || 0,
    stock: (getFirestoreValue(data, "stock") || "preorder") as Product["stock"],
    stockCount: getFirestoreValue(data, "stockCount") || 0,
    theme: getFirestoreValue(data, "theme") || "",
  };
}

/**
 * Fetch all products from Firestore
 */
export async function getAllProducts(): Promise<Product[]> {
  if (!db) {
    console.warn("Firestore not initialized. Returning empty array.");
    return [];
  }

  try {
    console.log("Fetching products from Firestore...");
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const product = firestoreDocToProduct(doc.id, doc.data());
      products.push(product);
    });

    console.log(`Successfully fetched ${products.length} products from Firestore`);
    return products;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return [];
  }
}

/**
 * Fetch a single product by ID from Firestore
 * Can search by firestoreId (document ID) or numeric id field
 */
export async function getProductById(productId: string | number): Promise<Product | null> {
  if (!db) {
    console.warn("Firestore not initialized. Returning null.");
    return null;
  }

  try {
    // First try to get by document ID (firestoreId)
    const productRef = doc(db, "products", String(productId));
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return firestoreDocToProduct(productSnap.id, productSnap.data());
    }

    // If not found by document ID, try to find by numeric id field
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("id", "==", typeof productId === "number" ? productId : parseInt(String(productId), 10)));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return firestoreDocToProduct(doc.id, doc.data());
    }

    console.warn(`Product with ID ${productId} not found`);
    return null;
  } catch (error) {
    console.error(`Error fetching product ${productId} from Firestore:`, error);
    return null;
  }
}

/**
 * Fetch products by category from Firestore
 */
export async function getProductsByCategory(category: Product["category"]): Promise<Product[]> {
  if (!db) {
    console.warn("Firestore not initialized. Returning empty array.");
    return [];
  }

  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const product = firestoreDocToProduct(doc.id, doc.data());
      products.push(product);
    });

    return products;
  } catch (error) {
    console.error(`Error fetching products by category ${category} from Firestore:`, error);
    return [];
  }
}

