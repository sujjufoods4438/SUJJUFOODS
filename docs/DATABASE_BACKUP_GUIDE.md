# SUJJU FOODS – Database Backup & Recovery Guide

**Database Architecture:** MongoDB Atlas Multi-AZ Replica Set  
**Primary Database Name:** `sujju_foods`  
**Target Recovery Point Objective (RPO):** < 1 Hour  
**Target Recovery Time Objective (RTO):** < 30 Minutes  

---

## 1. Automated Cloud Backups (MongoDB Atlas)

In production, MongoDB Atlas handles automated snapshots:
1. **Continuous Cloud Backups:** Point-in-time recovery (PITR) allows restoring to any second within the retention window (default: 7 days).
2. **Snapshot Schedule:**
   - Incremental snapshots taken every 6 hours.
   - Weekly snapshots retained for 4 weeks.
   - Monthly snapshots retained for 12 months for statutory accounting audits.

---

## 2. Manual Backup Procedures (`mongodump`)

For air-gapped on-premise backups or pre-upgrade snapshots:

### A. Full Database Backup
Run from a secured administrative bastion host:
```bash
mongodump --uri="mongodb+srv://<admin_user>:<password>@cluster0.mongodb.net/sujju_foods" \
          --archive="backup_sujju_foods_$(date +%Y%m%d_%H%M%S).gz" \
          --gzip
```

### B. Specific Critical Collections Backup
To archive only orders, audit logs, and manufacturing batches:
```bash
mongodump --uri="mongodb+srv://<admin_user>:<password>@cluster0.mongodb.net/sujju_foods" \
          --collection=orders \
          --out="./backup_orders_$(date +%Y%m%d)"

mongodump --uri="mongodb+srv://<admin_user>:<password>@cluster0.mongodb.net/sujju_foods" \
          --collection=production_batches \
          --out="./backup_batches_$(date +%Y%m%d)"
```

---

## 3. Database Restoration Procedures (`mongorestore`)

### A. Restoring from Full Archive
```bash
mongorestore --uri="mongodb+srv://<admin_user>:<password>@cluster0.mongodb.net/sujju_foods" \
             --archive="backup_sujju_foods_20261124.gz" \
             --gzip \
             --drop
```
*(Note: `--drop` clears existing collections before restoring to avoid duplicate key conflicts).*

### B. Disaster Recovery Dry-Run Verification
Every 30 days, the DevOps team must restore the latest archive onto an isolated staging database (`sujju_foods_staging`) and execute the automated test harness:
```bash
npm run test:verify
```
to verify that all data records, user hashes, and batch numbers remain intact.
