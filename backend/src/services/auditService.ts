export interface AuditLogEntry {
  id: string;
  timestamp: string;
  performedBy: string;
  role: string;
  action: string;
  targetEntity: string;
  targetId: string;
  oldValue: Record<string, any>;
  newValue: Record<string, any>;
  notes?: string;
}

export const auditLogsStore: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    performedBy: 'admin@sujjufoods.com',
    role: 'super_admin',
    action: 'DISTRIBUTOR_APPROVAL',
    targetEntity: 'User',
    targetId: 'SF-DIST-8841',
    oldValue: { isApproved: false, status: 'pending' },
    newValue: { isApproved: true, status: 'active' },
    notes: 'Territory background check verified for Visakhapatnam zone',
  },
  {
    id: 'AUD-002',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    performedBy: 'finance@sujjufoods.com',
    role: 'finance_admin',
    action: 'COLLECTION_RECONCILIATION',
    targetEntity: 'Order',
    targetId: 'SF-2026-894120',
    oldValue: { status: 'collected', paymentSettled: false },
    newValue: { status: 'reconciled', paymentSettled: true },
    notes: 'Bank reference UPI-REF-884920 matched ICICI statement',
  },
];

export function logAuditAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  auditLogsStore.unshift(newEntry);
  if (auditLogsStore.length > 500) auditLogsStore.pop();

  return newEntry;
}

export function getAuditLogs(): AuditLogEntry[] {
  return auditLogsStore;
}
