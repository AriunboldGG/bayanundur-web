# Quotes to Firestore Setup

## Overview

The quote form now saves all quote requests (including selected products and customer information) to Firebase Firestore in the `quotes` collection.

## What Was Implemented

### 1. Quotes Service (`src/lib/quotes.ts`)
- Created `saveQuoteToFirestore()` function
- Saves quote data including:
  - Customer information (name, email, phone, position, company)
  - Additional notes
  - All cart items with full product details
  - Timestamp (createdAt)
  - Status (defaults to "pending")

### 2. Updated QuoteModal (`src/components/QuoteModal.tsx`)
- Now saves quotes to Firestore when form is submitted
- Shows success/error messages
- Still sends email notification (optional)
- Automatically closes after successful submission

### 3. Firestore Security Rules (`firestore.rules`)
- Added rule to allow **create** access to `quotes` collection
- Anyone can create quotes (public access)
- Read access is restricted (only admins can view quotes)

## Quote Data Structure

Each quote document in Firestore contains:

```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note: string;
  position: string;
  company: string;
  items: Array<{
    id: number;
    name: string;
    priceNum: number;
    price: string;
    img: string;
    modelNumber: string;
    color?: string;
    size?: string;
    brand?: string;
    theme?: string;
    qty: number;
  }>;
  status: "pending" | "processed" | "completed";
  createdAt: Timestamp;
}
```

## How It Works

1. User adds products to cart
2. User clicks "Үнийн санал авах" (Get Quote) button
3. Quote modal opens with form
4. User fills in required information:
   - Name (Нэр)
   - Last Name (Овог)
   - Email (И-мэйл)
   - Phone (Утас)
   - Additional Info (Нэмэлт мэдээлэл)
   - Position (Албан тушаал)
   - Company (Компани)
5. User clicks "Илгээх" (Send)
6. Data is saved to Firestore `quotes` collection
7. Success message is shown
8. Email notification is also sent (optional)

## Viewing Quotes in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **bayanundur-backend**
3. Go to **Firestore Database**
4. Click on **quotes** collection
5. View all quote requests

## Next Steps

### Deploy Firestore Rules

You need to deploy the updated Firestore rules to allow quote creation:

1. Go to Firebase Console → Firestore Database → Rules
2. Copy the rules from `firestore.rules`
3. Paste into the Rules editor
4. Click **Publish**

### Optional: Add Admin Dashboard

You can create an admin page to:
- View all quotes
- Filter by status
- Update quote status
- Export quotes

## Testing

1. Add products to cart
2. Go to cart page
3. Click "Үнийн санал авах"
4. Fill in the form
5. Submit
6. Check Firebase Console → Firestore → quotes collection
7. Verify the quote was saved

## Troubleshooting

### Error: "Missing or insufficient permissions"
- **Solution**: Deploy the updated Firestore rules (see "Deploy Firestore Rules" above)

### Error: "Firebase Firestore is not initialized"
- **Solution**: Check `.env.local` file has all Firebase configuration variables

### Quotes not appearing in Firestore
- Check browser console for errors
- Verify Firestore rules are deployed
- Check network tab for failed requests

