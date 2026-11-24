# SUJJU FOODS – Known Issues & Operational Considerations

**Document Version:** 1.0.0  
**Current Status:** Production Candidate  
**Total Critical Defects:** 0  
**Total High-Priority Defects:** 0  

---

## 1. Operational Dependencies for Commercial Launch

1. **Production External Gateway Secrets:**
   - *Detail:* The notification engine dispatches simulated logs in development/testing mode when live API tokens are omitted.
   - *Action:* Management must supply live production tokens in `.env` for Meta WhatsApp Cloud API and SMS provider before live customer rollout.
2. **FSSAI Licence Number Confirmation:**
   - *Detail:* The platform displays FSSAI Lic. `10123999000123` on the QR verification certificate and invoice footers.
   - *Action:* Confirm that this matches the official physical registration document issued by the Food Safety and Standards Authority of India for the Visakhapatnam packaging facility.
3. **Accounting & GST Rate Sign-off:**
   - *Detail:* The platform calculates all orders, invoices, and reports with **0% GST** under the standard agricultural tea packaging configuration.
   - *Action:* Have company accountants review product trademark status to confirm whether 0% or 5% GST is applicable upon crossing turnover thresholds.

---

## 2. Minor Non-Blocking Observations

1. **Vite Minified Chunk Size (>500 kB):**
   - *Observation:* `dist/assets/index-CAow3CUn.js` measures `501 kB` after minification.
   - *Impact:* Harmless warning. Browser caching and Gzip compression reduce effective wire transfer size to ~125 kB.
   - *Recommendation:* Code-splitting via `React.lazy()` can be applied in future maintenance sprints if initial page weight reduction is desired.
