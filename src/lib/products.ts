import { db, storage } from "./firebase";
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, startAfter, type QuerySnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { log } from "console";

export type Product = {
  id: number;
  firestoreId: string; // Unique Firestore document ID
  name: string;
  price: string;
  img: string;
  images?: string[]; // Multiple images for gallery
  modelNumber: string;
  category: "ppe" | "rescue" | "workplace" | "other";
  mainCategory?: "ppe" | "rescue" | "workplace" | "other"; // Main category from backend
  subcategory: string;
  subleaf: string;
  color: string;
  brand: string;
  size: string;
  priceNum: number;
  stock: number; // Stock count from Firebase: > 0 means in stock, 0 means preorder
  theme: string;
  material?: string;
  description?: string;
  feature?: string;
  productType?: string; // "best", "new", "discount", "promo", "suggest"
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
  if (!data) return defaultValue;
  
  // Try exact field name first
  if (data[field] !== undefined && data[field] !== null) {
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
  
  // Try camelCase variations
  const camelCaseField = field.charAt(0).toLowerCase() + field.slice(1);
  if (data[camelCaseField] !== undefined && data[camelCaseField] !== null) {
    return data[camelCaseField];
  }
  
  // Try snake_case variations
  const snakeCaseField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
  if (data[snakeCaseField] !== undefined && data[snakeCaseField] !== null) {
    return data[snakeCaseField];
  }
  
  return defaultValue;
}

// Convert Firestore document to Product type
function firestoreDocToProduct(docId: string, data: any): Product {
  // Try to parse document ID as number if id field is missing
  const docIdNum = parseInt(docId, 10) || 0;
  
  // DEBUG: Log raw Firestore data for first few products to see actual structure
  if (typeof window !== 'undefined') {
    // Log first 3 documents to see structure
    const logKey = `_logged_doc_${docId}`;
    if (!(window as any)[logKey] && Math.random() < 0.3) {
      (window as any)[logKey] = true;
      console.log('🔍 RAW FIRESTORE DOCUMENT:', {
        docId,
        allFields: Object.keys(data || {}),
       
        productType: data?.productType,
        product_type: data?.product_type,
        ProductType: data?.ProductType,
        PRODUCT_TYPE: data?.PRODUCT_TYPE,
        productType_raw: data?.productType,
        fullDataSample: data ? Object.keys(data).reduce((acc: any, key: string) => {
          acc[key] = typeof data[key] === 'object' ? '[object]' : data[key];
          return acc;
        }, {}) : null
      });
    }
  }
  
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
  
  // Read mainCategory field from Firestore (field name is mainCategory)
  const mainCategoryValue = getFirestoreValue(data, "mainCategory");
  const categoryValue = getFirestoreValue(data, "category") || "other";
  
  return {
    id: getFirestoreValue(data, "id") || docIdNum,
    firestoreId: docId, // Always use Firestore document ID as unique identifier
    name: getFirestoreValue(data, "name") || "",
    price: getFirestoreValue(data, "price") || "0₮",
    img: getFirestoreValue(data, "img") || getFirestoreValue(data, "image") || "",
    images: images, // Multiple images for gallery
    modelNumber: getFirestoreValue(data, "modelNumber") || "",
    category: categoryValue as Product["category"],
    mainCategory: mainCategoryValue ? (mainCategoryValue as Product["mainCategory"]) : undefined,
    subcategory: getFirestoreValue(data, "subcategory") || "",
    subleaf: getFirestoreValue(data, "subleaf") || "",
    color: getFirestoreValue(data, "color") || "",
    brand: getFirestoreValue(data, "brand") || "",
    size: getFirestoreValue(data, "size") || "",
    priceNum: getFirestoreValue(data, "priceNum") || 0,
    stock: getFirestoreValue(data, "stock") || 0, // Number: > 0 = in stock, 0 = preorder
    theme: getFirestoreValue(data, "theme") || "",
    material: getFirestoreValue(data, "material") || "",
    description: getFirestoreValue(data, "description") || "",
    feature: getFirestoreValue(data, "feature") || "",
    productType: (() => {
      if (!data || typeof data !== 'object') return undefined;
      
      // Check productType field directly from raw Firestore data
      if (data.hasOwnProperty('productType') && data.productType !== null && data.productType !== undefined && data.productType !== '') {
        const pt = data.productType;
        if (typeof pt === 'string' && pt.trim() !== '') {
          return pt.trim();
        }
        if (typeof pt === 'object' && pt.stringValue && typeof pt.stringValue === 'string' && pt.stringValue.trim() !== '') {
          return pt.stringValue.trim();
        }
      }
      
      // Check product_type (snake_case)
      if (data.hasOwnProperty('product_type') && data.product_type !== null && data.product_type !== undefined && data.product_type !== '') {
        const pt = data.product_type;
        if (typeof pt === 'string' && pt.trim() !== '') {
          return pt.trim();
        }
        if (typeof pt === 'object' && pt.stringValue && typeof pt.stringValue === 'string' && pt.stringValue.trim() !== '') {
          return pt.stringValue.trim();
        }
      }
      
      // Try getFirestoreValue
      const pt1 = getFirestoreValue(data, "productType", undefined);
      if (pt1 && typeof pt1 === 'string' && pt1.trim() !== '') {
        return pt1.trim();
      }
      
      const pt2 = getFirestoreValue(data, "product_type", undefined);
      if (pt2 && typeof pt2 === 'string' && pt2.trim() !== '') {
        return pt2.trim();
      }
      
      return undefined;
    })(),
  };
}

/**
 * Fetch all products from Firestore
 * Uses pagination if there are many products (Firestore default limit is ~1000 documents per query)
 */
export async function getAllProducts(): Promise<Product[]> {
  if (!db) {
    console.error("Firebase db is not initialized");
    return [];
  }

  try {
    const productsRef = collection(db, "products");
    const products: Product[] = [];
    let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
    const batchSize = 1000; // Firestore's maximum batch size
    
    // Paginate through all products using document ID ordering
    while (true) {
      let q;
      if (lastDoc) {
        // Paginate using document ID (requires orderBy)
        q = query(productsRef, orderBy("__name__"), startAfter(lastDoc), limit(batchSize));
      } else {
        q = query(productsRef, orderBy("__name__"), limit(batchSize));
      }
      
      const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      
      if (snapshot.empty) {
        break; // No more documents
      }
      
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        try {
          const product = firestoreDocToProduct(doc.id, doc.data());
          products.push(product);
        } catch (err) {
          console.error(`Error processing product ${doc.id}:`, err);
        }
      });
      
      // Check if there are more documents to fetch
      if (snapshot.size < batchSize) {
        break; // We've fetched all documents
      }
      
      // Get the last document for pagination
      lastDoc = snapshot.docs[snapshot.docs.length - 1];
    }

    console.log(`Successfully fetched ${products.length} products from Firestore`);
    return products;
  } catch (error: any) {
    console.error("Error fetching products from Firestore (with pagination):", error);
    
    // If orderBy("__name__") fails (e.g., index not created), try without pagination
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      console.log("Index not found, attempting to fetch without pagination...");
      try {
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);
        const products: Product[] = [];
        snapshot.forEach((doc) => {
          try {
            const product = firestoreDocToProduct(doc.id, doc.data());
            products.push(product);
          } catch (err) {
            console.error(`Error processing product ${doc.id}:`, err);
          }
        });
        console.log(`Fetched ${products.length} products (without pagination - may be limited to first batch)`);
        if (snapshot.size >= 1000) {
          console.warn("Warning: Query returned 1000+ documents. Some products may be missing. Consider creating a Firestore index.");
        }
        return products;
      } catch (fallbackError) {
        console.error("Error fetching products (fallback method):", fallbackError);
        return [];
      }
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

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch products by category from Firestore
 */
export async function getProductsByCategory(category: Product["category"]): Promise<Product[]> {
  if (!db) {
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
    return [];
  }
}

/**
 * Main Category type from Firestore
 */
export type MainCategory = {
  id: string;
  name: string;
  label: string; // Display label in Mongolian
  slug: Product["category"]; // ppe, rescue, workplace, other
  order?: number;
  icon?: string; // Icon name or identifier
};

/**
 * Subcategory type from Firestore
 */
export type Subcategory = {
  id: string;
  name: string;
  category: Product["category"];
  order?: number;
};

/**
 * Fetch main categories from Firestore
 * Expected collection structure: "main_categories" or "categories"
 * Each document should have: { name: string, label: string, mainCategory: string, order?: number }
 * The mainCategory field should be: "ppe", "rescue", "workplace", or "other"
 */
export async function getMainCategories(): Promise<MainCategory[]> {
  if (!db) {
    return [];
  }

  try {
    // Try "main_categories" collection first, fallback to "categories"
    let categoriesRef = collection(db, "main_categories");
    let snapshot;
    
    try {
      const q = query(categoriesRef, orderBy("order", "asc"));
      snapshot = await getDocs(q);
    } catch (error) {
      // If "main_categories" doesn't exist or has no order field, try "categories"
      try {
        categoriesRef = collection(db, "categories");
        snapshot = await getDocs(categoriesRef);
      } catch (err) {
        // If both fail, return empty array
        return [];
      }
    }

    const categories: MainCategory[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Use mainCategory field instead of slug
      const mainCategory = data.mainCategory || data.slug; // Fallback to slug for backward compatibility
      
      if (mainCategory) {
        // Validate mainCategory is one of the allowed category types
        const validCategories: Product["category"][] = ["ppe", "rescue", "workplace", "other"];
        if (validCategories.includes(mainCategory as Product["category"])) {
          categories.push({
            id: doc.id,
            name: data.name || "",
            label: data.label || data.name || "",
            slug: mainCategory as Product["category"],
            order: data.order || 0,
            icon: data.icon || "",
          });
        }
      }
    });

    // Sort by order
    categories.sort((a, b) => (a.order || 0) - (b.order || 0));

    return categories;
  } catch (error) {
    // Return empty array if collection doesn't exist
    return [];
  }
}

/**
 * Fetch subcategories from Firestore
 * Expected collection structure: "subcategories" or "categories"
 * Each document should have: { name: string, category: string, order?: number }
 */
export async function getSubcategories(category?: Product["category"]): Promise<Subcategory[]> {
  if (!db) {
    return [];
  }

  try {
    // Try "subcategories" collection first, fallback to "categories"
    let subcategoriesRef = collection(db, "subcategories");
    let snapshot;
    
    if (category) {
      const q = query(subcategoriesRef, where("category", "==", category), orderBy("order", "asc"));
      snapshot = await getDocs(q);
    } else {
      const q = query(subcategoriesRef, orderBy("order", "asc"));
      snapshot = await getDocs(q);
    }

    const subcategories: Subcategory[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      subcategories.push({
        id: doc.id,
        name: data.name || "",
        category: (data.category || "other") as Product["category"],
        order: data.order || 0,
      });
    });

    // If no results from "subcategories", try "categories" collection
    if (subcategories.length === 0) {
      subcategoriesRef = collection(db, "categories");
      if (category) {
        const q = query(subcategoriesRef, where("category", "==", category), orderBy("order", "asc"));
        snapshot = await getDocs(q);
      } else {
        const q = query(subcategoriesRef, orderBy("order", "asc"));
        snapshot = await getDocs(q);
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        subcategories.push({
          id: doc.id,
          name: data.name || "",
          category: (data.category || "other") as Product["category"],
          order: data.order || 0,
        });
      });
    }

    return subcategories.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    // If collection doesn't exist, return empty array (will fallback to extracting from products)
    return [];
  }
}

