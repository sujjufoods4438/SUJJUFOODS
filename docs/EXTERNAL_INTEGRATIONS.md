# SUJJU FOODS – External Integrations & Service Directory

**Document Purpose:** Directory of external third-party communication, mapping, and cloud storage providers integrated into SUJJU FOODS.

---

## 1. Integrated Service Matrix

| Service | Provider Option | Protocol / SDK | Purpose | Integration Status |
| :--- | :--- | :--- | :--- | :--- |
| **WhatsApp Business** | Meta WhatsApp Cloud API | Graph API v19.0 (HTTP POST) | Automated order notifications, delivery OTP, PDF invoice delivery | Ready for live Meta Bearer Token |
| **SMS OTP Gateway** | Fast2SMS / Twilio | REST API | 6-digit customer phone verification & delivery security pin | Ready for live SMS API Key |
| **Transactional Email** | SendGrid / AWS SES | SMTP / REST API | Registration confirmations, invoices, support updates | Ready for live SMTP Credentials |
| **Cloud Storage** | Cloudinary / AWS S3 | REST SDK | Delivery handover proof photos, plant QC batch photos | Configured via env variables |
| **Mapping & Location** | Google Maps / Leaflet | Web Geolocation API / REST | Territory routing, GPS lat/lon delivery proof | Native HTML5 Geolocation active |
| **Payment Collection** | Doorstep Cash / UPI QR | Static & Dynamic UPI URI | Distributor cash collection & instant bank reference reconciliation | UPI QR string generation active |

---

## 2. Meta WhatsApp Cloud API Production Setup

1. Register on [developers.facebook.com](https://developers.facebook.com).
2. Create a Business App and select **WhatsApp**.
3. Obtain a **System User Access Token** with `whatsapp_business_messaging` permissions.
4. Register the official SUJJU FOODS customer support phone number.
5. Populate environment variables:
   ```env
   WHATSAPP_API_TOKEN=<your_token>
   WHATSAPP_PHONE_NUMBER_ID=<your_phone_number_id>
   ```
6. The built-in service `backend/src/services/notificationService.ts` automatically detects these keys and routes live messages directly through Meta's graph endpoints.
