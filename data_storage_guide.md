# 📊 Data Storage & Admin Access Guide — Nagpur Street Dogs

## Where is Your Data Stored?

All data is stored in **MongoDB Atlas** on cluster `cluster0.yha4pwj.mongodb.net`. Here's the exact breakdown:

| Feature | MongoDB Collection | What's Stored |
|---------|-------------------|---------------|
| **User Login / Registration** | `users` | Name, email, hashed password, phone, DOB, occupation, address, profile image URL |
| **Volunteer Form** | `volunteers` | Name, email, phone, address, city, state, country, pincode |
| **Donations** | `donations` | Donor name, email, phone, amount, Razorpay order/payment IDs, status (paid/failed) |
| **Blog Posts** | `blogs` | Title, banner, content, author, tags, activity stats |
| **Dog Adoption Listings** | `dogs` | Name, breed, age, description, images, owner, adoption status |
| **Lost Dog Reports** | `lostdogs` | Name, description, breed, color, contact, location (lat/lng), date lost |
| **Vet Clinics** | `vetclinics` | Name, address, phone, hours, location (lat/lng) |
| **User Profile Images** | **Cloudinary** (not MongoDB) | Stored at cloud `doczqznfj` in `user_uploads` folder |

---

## How to Access Data as Admin

### Option 1: MongoDB Atlas Dashboard (Recommended)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Log in with the **nagpurstreetdogs** MongoDB account
3. Click on **Cluster0** → **Browse Collections**
4. You'll see all the collections listed above
5. You can:
   - **View** all entries (users, volunteers, donations, etc.)
   - **Search/Filter** by any field
   - **Edit** individual records
   - **Delete** records
   - **Export** data as JSON or CSV

### Option 2: MongoDB Compass (Desktop App)

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Paste your connection string:
   ```
   mongodb+srv://nagpurstreetdogs:<password>@cluster0.yha4pwj.mongodb.net/
   ```
3. You get a full visual GUI to browse, filter, and manage all collections

---

## 🗺️ Maps Bug Fix

**Problem:** The Maps page was broken in production because `MapComponent.jsx` was using `VITE_BACKEND_URL` (which doesn't exist), while the rest of the app uses `VITE_SERVER_DOMAIN`.

**Fix Applied:** Changed all 3 occurrences of `VITE_BACKEND_URL` → `VITE_SERVER_DOMAIN` in `MapComponent.jsx`. This has been committed and pushed — both Render and Vercel will auto-redeploy.

---

## 🔗 Your Live URLs

| Component | URL |
|-----------|-----|
| **Frontend** | `https://nsd-website-oef9.vercel.app` |
| **Backend API** | `https://nsd-backend-wooferz-v1234.onrender.com` |
| **Database** | MongoDB Atlas `cluster0.yha4pwj.mongodb.net` |
| **Image Storage** | Cloudinary cloud `doczqznfj` |
