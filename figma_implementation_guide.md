# 🎨 Figma UI/UX Implementation Specification & Handoff Guide

This document contains the context, URLs, design structure, and instructions for implementing the UI/UX changes for the **Nagpur Street Dogs (NSD)** website from Figma.

---

## 🔗 Figma Project Coordinates

* **Figma File URL**: [Figma Design Canvas](https://www.figma.com/design/05iPGHccJPqx4gH36ABIwr/NSD)
* **Target Node ID (Direct Link)**: [Specific Frame Node `6-3`](https://www.figma.com/design/05iPGHccJPqx4gH36ABIwr/NSD?node-id=6-3)
* **Configured Figma token**: Loaded in your global configuration [`mcp_config.json`](file:///C:/Users/LENOVO/.gemini/config/mcp_config.json)

---

## 🗂️ Figma Design Structure (Page & Frame Hierarchy)

The project has three main Figma pages with their respective design frames:

### 1. Desktop Designs (`Final_Design_Desktop` - Node ID `6:3`)
These are the reference layouts for the desktop website:
* **`NSD_Home`** (Node ID `40:1133`) - Main home landing page layout.
* **`NSD_AboutUs`** (Node ID `42:1436`) - About Us story and vision layout.
* **`NSD_Adopt`** (Node ID `22:887`) - Dog listings for adoption layout.
* **`NSD_Volunteer`** (Node ID `45:1662`) - Form page to apply as a volunteer.
* **`NSD_Donate`** (Node ID `22:563`) - Donation platform layout.
* **`NSD_Founder`** (Node ID `49:1993`) - Founder profile/message layout.
* **`NSD_Maps`** (Node ID `47:1866`) - Interactive map for vets and lost dogs.
* **`NSD_UPI_Payment_Flow`** (Node ID `51:2109`) - Flow interface for checkout/payment verification.

### 2. Mobile Designs (`Final_Design_Mobile` - Node ID `71:2378`)
Responsive layout targets for mobile devices:
* **`home_mobile`** (Node ID `130:2`)
* **`about_mobile`** (Node ID `82:2685`)
* **`adopt_mobile`** (Node ID `82:2911`)
* **`volunteer_mobile`** (Node ID `88:3201`)
* **`donate_mobile`** (Node ID `82:2911`)
* **`maps_mobile`** (Node ID `96:3399`)
* **`founder_mobile`** (Node ID `100:3516`)

### 3. Documentation (`Documentation` - Node ID `2:4`)
* **`Project Brief`** (Node ID `2:6`)
* **`Website Audit`** (Node ID `2:18`)
* **`Sitemap`** (Node ID `2:23`)
* **`User Flow`** (Node ID `2:71`)

---

## 🚀 Accomplished Tasks

Here is the work we have completed so far:
1. **Repository Setup**: Initialized and run both frontend (port `5173`) and backend (port `8000`) servers.
2. **Local Database Fallback**: Implemented a mock database client in [`Backend/Utils/supabase.js`](file:///E:/NSD/Backend/Utils/supabase.js) that saves users and profiles locally inside [`Backend/local_db.json`](file:///E:/NSD/Backend/local_db.json) (or in-memory when deployed on Vercel to avoid read-only filesystem errors). This allows local/offline testing without needing to resolve the original paused/deleted Supabase database.
3. **DOB Field Removal**: Removed the Date of Birth field from the frontend [`Register.jsx`](file:///E:/NSD/Frontend/src/Components/Register.jsx) registration state, validation, and UI input form.
4. **Profile Loading URL Fix**: Corrected the fetch URL in [`Frontend/src/Pages/UserPage.jsx`](file:///E:/NSD/Frontend/src/Pages/UserPage.jsx) to query the correct backend endpoint `/api/profile/${userId}`.

---

## 🛠️ Instructions for the Next Agent / Model

When you resume this project, please follow these instructions:

1. **Check Server Status**: Run `npm start` in `Backend` and `npm run dev` in `Frontend`.
2. **Read Saved Figma Structure**: The complete fetched Figma JSON schema was saved during our session to the local workspace scratch folder at:
   `C:\Users\LENOVO\.gemini\antigravity-cli\brain\11e88dc5-f18b-41d7-a2b2-f6f13a8ea1a0\scratch\figma_file.json`
   * You can read this JSON file to see all properties (colors, text, styles) of the frames.
3. **Retrieve Figma Assets/SVG**: If you need to fetch specific layout details or SVGs, write a Node.js fetch script using the provided Figma token (`figd_...`) and the file key `05iPGHccJPqx4gH36ABIwr`.
4. **Update UI/UX**:
   * Inspect a specific frame (e.g. `NSD_Home`) from the JSON file or Figma URL.
   * Edit the corresponding React component inside `Frontend/src/Components/` or `Frontend/src/Pages/` to align with the visual and responsive specifications.
