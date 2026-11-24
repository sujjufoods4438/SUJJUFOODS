# SUJJU FOODS – Production Deployment Guide

**Target Architectures:** Full-Stack Monorepo Deployment  
**Frontend Stack:** React 18, Vite, TypeScript, Tailwind CSS  
**Backend Stack:** Node.js 20 LTS, Express.js, MongoDB 7.0  

---

## 1. Hosting Architecture Overview

```
                      [End Users (Mobile & Web)]
                                  │
                                  ▼
                     [Cloudflare / DNS & SSL]
                      ┌───────────┴───────────┐
                      ▼                       ▼
            [Vercel / Netlify]       [Render / AWS ECS]
             Frontend Edge CDN        Backend API Cluster
            (sujjufoods.com)         (api.sujjufoods.com)
                      │                       │
                      │ (REST & WebSocket)    │
                      └───────────┬───────────┘
                                  ▼
                      [MongoDB Atlas Replica Set]
                       AWS Mumbai (ap-south-1)
```

---

## 2. Step-by-Step Deployment Procedure

### Step 1: Deploy Backend API Cluster (Render or AWS)
1. Link GitHub repository root.
2. Set Root Directory: `backend`.
3. Set Build Command: `npm install && npm run build`.
4. Set Start Command: `node dist/server.js`.
5. Add Environment Variables (see `docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md`).
6. Deploy service. Once live, verify health endpoint:
   `curl https://api.sujjufoods.com/api/v1/health`
   Expected response: `{"status":"online","system":"SUJJU FOODS Enterprise Platform",...}`.

### Step 2: Deploy Frontend Application (Vercel)
1. Import GitHub repository.
2. Set Root Directory: `frontend`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   `VITE_API_BASE_URL=https://api.sujjufoods.com/api/v1`
7. Ensure SPA redirect rule is present in `frontend/vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
8. Deploy and verify responsive rendering on mobile and desktop devices.

---

## 3. Post-Deployment Verification

1. **Public Site:** Open `https://sujjufoods.com` &rarr; Verify Home page, Products page, Pincode modal, and Customer AI Chatbot.
2. **Customer Order Flow:** Register customer &rarr; Verify OTP &rarr; Place 4-pack order (₹720, 0% GST) &rarr; Verify invoice generation.
3. **Distributor Handover:** Accept order in distributor portal &rarr; Input 6-digit Customer Delivery OTP &rarr; Confirm completion.
4. **Excel Exports:** In Admin portal, verify instant CSV downloads for Orders, Collections, and Inventory.
