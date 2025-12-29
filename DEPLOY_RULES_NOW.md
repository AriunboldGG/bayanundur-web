# ⚠️ URGENT: Deploy Firestore Rules Now

You're getting "Missing or insufficient permissions" because the Firestore rules need to be deployed to Firebase.

## Quick Steps (2 minutes):

### 1. Open Firebase Console
- Go to: **https://console.firebase.google.com/**
- Select project: **bayanundur-backend**

### 2. Go to Firestore Rules
- Click **Firestore Database** in left sidebar
- Click **Rules** tab (at the top)

### 3. Copy Rules from `firestore.rules` file
Copy this ENTIRE content:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products collection (both authenticated and unauthenticated)
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow listing products collection
    match /products {
      allow read: if true;
      allow list: if true;
    }
    
    // Allow write access to quotes collection (anyone can create quotes)
    match /quotes/{quoteId} {
      allow create: if true;
      allow read: if false; // Only admins can read (handled separately)
      allow update, delete: if false;
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. Paste and Publish
- **Delete** everything in the Rules editor
- **Paste** the rules above
- Click **Publish** button (top right)
- Wait for "Rules published successfully" message

### 5. Test Immediately
- Go back to your app
- Try submitting a quote again
- It should work now! ✅

## Visual Guide:

1. **Firebase Console** → **Firestore Database** → **Rules** tab
2. **Delete old rules** → **Paste new rules** → **Publish**
3. **Done!** Rules are live immediately

## Important Notes:

- ✅ Rules take effect **immediately** after publishing
- ✅ **No restart needed** - changes are live right away
- ✅ **Test right away** to confirm it works

## Still Getting Errors?

1. **Refresh browser** and try again
2. **Check Rules tab** - make sure it shows the updated timestamp
3. **Verify project** - make sure you're in **bayanundur-backend** project
4. **Check console** - look for specific error messages

