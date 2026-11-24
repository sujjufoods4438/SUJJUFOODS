# SUJJU FOODS – Production Deployment Checklist

**Target Environments:** Frontend (Vercel / Netlify / Cloudflare Pages) | Backend (Render / AWS ECS / DigitalOcean) | Database (MongoDB Atlas)  

---

## Phase 1: Pre-Deployment Verification

- [x] All TypeScript compilation passes with zero errors (`npm --prefix backend run build`).
- [x] Frontend builds cleanly for production (`npm --prefix frontend run build`).
- [x] All 8 automated test verification suites pass with 100% assertions (`scripts/verify*.js`).
- [x] Authoritative server-side price formula verified (₹180 per 250g pack, 0% GST standard configuration).
- [x] Negative inventory protection and QC inspection gates active.
- [x] Customer AI chatbot and multi-channel notification engine tested.
- [x] Rate limiting middleware active on authentication and chatbot endpoints.

---

## Phase 2: Environment Configuration Checklist

Create a secure `.env` file in the backend production server with the following values:

```env
# Server Runtime
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1
FRONTEND_URL=https://sujjufoods.com

# Database Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sujju_foods?retryWrites=true&w=majority

# Security Secrets (Must be 32+ characters random string)
JWT_SECRET=production_ultra_secure_jwt_secret_key_sujju_foods_2026
SESSION_SECRET=production_session_signing_secret_key_2026

# Meta WhatsApp Cloud API (For Live WhatsApp Notifications)
WHATSAPP_API_TOKEN=your_meta_whatsapp_cloud_api_bearer_token
WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_meta_business_account_id

# SMS Gateway (Fast2SMS / Twilio)
SMS_PROVIDER_API_KEY=your_production_sms_api_key

# Transactional Email (SendGrid / AWS SES)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
EMAIL_FROM=orders@sujjufoods.com

# Cloud Storage (Cloudinary / AWS S3 for Delivery Proof & Batch Photos)
CLOUDINARY_CLOUD_NAME=sujju-foods
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Phase 3: Infrastructure & Hosting Execution

1. **Database Provisioning (MongoDB Atlas):**
   - Deploy M10+ replica set in AWS Mumbai (`ap-south-1`) for lowest latency to Andhra Pradesh users.
   - Enforce IP Access List (whitelist backend production servers only).
   - Enable Daily Automated Cloud Backups with point-in-time recovery (PITR).
2. **Backend Deployment (Render / AWS ECS / DigitalOcean App Platform):**
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/server.js`
   - Health Check Path: `/api/v1/health`
   - Enable Auto-Restart on uncaught exceptions.
3. **Frontend Deployment (Vercel / Netlify):**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Single Page Application (SPA) Rewrite: `/*` &rarr; `/index.html` (HTTP 200).
4. **Custom Domain & SSL Certificates:**
   - Point `sujjufoods.com` and `www.sujjufoods.com` via CNAME / ALIAS to frontend edge CDN.
   - Point `api.sujjufoods.com` via A / CNAME to backend cluster.
   - Confirm automatic Let's Encrypt TLS/SSL HTTPS termination.

---

## Phase 4: Business & Compliance Final Sign-off

- [ ] Confirm valid physical FSSAI certificate matches displayed licence (`10123999000123`).
- [ ] Confirm company chartered accountant verifies product classification and applicable GST rate (0% standard).
- [ ] Send test WhatsApp message to management device using live Meta Cloud API credentials.
- [ ] Conduct live test transaction: Customer order &rarr; Distributor dispatch &rarr; Delivery OTP &rarr; Cash/UPI settlement.
