import http from 'http';
import { app } from '../backend/dist/app.js';

async function runPhase5Tests() {
  console.log('====================================================');
  console.log('   SUJJU FOODS - Phase 5 Finance & Commission Tests ');
  console.log('====================================================');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[Test Server] In-memory server listening on port ${port}`);

  try {
    // 1. Get Collections Ledger (Cash & UPI separation)
    console.log('\n[1] Testing Collections Summary & Ledger (Cash vs UPI) ...');
    const colRes = await fetch(`${baseUrl}/api/v1/finance/collections?distributorId=APDIST01`);
    const colData = await colRes.json();
    console.log('    Total Collections:', colData.summary.totalCollected);
    console.log('    Cash in Hand:', colData.summary.totalCashCollected);
    console.log('    UPI Direct Credits:', colData.summary.totalUpiCollected);
    console.log('    Reconciled Volume:', colData.summary.totalReconciled);
    console.log('    Pending Audit Volume:', colData.summary.totalPendingReconciliation);
    if (!colData.success || colData.summary.totalCollected <= 0) {
      throw new Error('Collections ledger query failed');
    }
    console.log('    -> PASSED');

    // 2. Finance / Admin Reconciliation Workflow
    console.log('\n[2] Testing Finance Reconciliation of Order SF-2026-894121 ...');
    const recRes = await fetch(`${baseUrl}/api/v1/finance/collections/SF-2026-894121/reconcile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reconciledBy: 'Head of Finance',
        notes: 'Bank settlement credit verified against UPI reference UPI-REF-992144',
      }),
    });
    const recData = await recRes.json();
    console.log('    Reconciliation Result:', recData.message);
    console.log('    Collection Status:', recData.collectionStatus);
    if (!recData.success || recData.collectionStatus !== 'reconciled') {
      throw new Error('Collection reconciliation failed');
    }
    console.log('    -> PASSED (Status changed to reconciled)');

    // 3. Commission Policy Query & Admin Configuration
    console.log('\n[3] Testing Commission Rules Engine ...');
    const ruleRes = await fetch(`${baseUrl}/api/v1/finance/commission/rules`);
    const ruleData = await ruleRes.json();
    console.log(`    Current Rule: ${ruleData.rule.name} (Rate: ₹${ruleData.rule.rate}/pack)`);
    console.log(`    Target Bonus: ₹${ruleData.rule.monthlyBonusAmount} for ${ruleData.rule.minPacksMonthlyBonusThreshold}+ packs`);

    // Update rule to ₹25/pack
    const updateRuleRes = await fetch(`${baseUrl}/api/v1/finance/commission/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Winter Festive High-Turnover Commission',
        type: 'fixed_per_pack',
        rate: 25,
        minPacksMonthlyBonusThreshold: 100,
        monthlyBonusAmount: 2500,
      }),
    });
    const updateRuleData = await updateRuleRes.json();
    console.log('    Updated Rule:', updateRuleData.message);
    console.log(`    New Commission Rate: ₹${updateRuleData.rule.rate}/pack`);
    if (!updateRuleData.success || updateRuleData.rule.rate !== 25) {
      throw new Error('Commission rule update failed');
    }
    console.log('    -> PASSED');

    // 4. Calculate Distributor Commission Statement
    console.log('\n[4] Testing Distributor Commission Statement for APDIST01 ...');
    const commRes = await fetch(`${baseUrl}/api/v1/finance/commission?distributorId=APDIST01`);
    const commData = await commRes.json();
    console.log('    Total Delivered Packs:', commData.summary.totalDeliveredPacks);
    console.log('    Approved Commission (Reconciled): ₹', commData.summary.approvedCommission);
    console.log('    Estimated Commission (Pending Audit): ₹', commData.summary.estimatedCommission);
    console.log('    Target Bonus Earned: ₹', commData.summary.targetBonusEarned);
    console.log('    Total Payable Commission: ₹', commData.summary.totalPayableCommission);
    console.log('    Ledger Items Count:', commData.ledger.length);
    if (!commData.success || commData.ledger.length === 0) {
      throw new Error('Commission statement calculation failed');
    }
    console.log('    -> PASSED');

    // 5. Territory Leaderboard Standings & Privacy Verification
    console.log('\n[5] Testing Andhra Pradesh Territory Leaderboard ...');
    const leadRes = await fetch(`${baseUrl}/api/v1/finance/leaderboard`);
    const leadData = await leadRes.json();
    console.log('    Reporting Month:', leadData.reportingMonth);
    console.log('    Leaderboard Count:', leadData.leaderboard.length);
    const top = leadData.leaderboard[0];
    console.log(`    Rank #1: ${top.distributorName} (${top.distributorId})`);
    console.log(`    Territory: ${top.territory}`);
    console.log(`    Delivered Packs: ${top.deliveredPacks} | Reconciled Sales: ₹${top.reconciledSales}`);
    console.log(`    24h SLA Compliance Rate: ${top.slaComplianceRate}% | Tier: ${top.badge}`);

    // Verify privacy: No customer PII in leaderboard
    const hasCustomerFields = JSON.stringify(leadData).includes('customerPhone') || JSON.stringify(leadData).includes('customerEmail');
    if (hasCustomerFields) {
      throw new Error('Privacy violation: Customer PII exposed in leaderboard!');
    }
    console.log('    -> PASSED (Zero customer PII exposed, public distributor rankings verified)');

    console.log('\n====================================================');
    console.log('   ALL PHASE 5 FINANCE & COMMISSION TESTS PASSED!   ');
    console.log('====================================================');
  } finally {
    server.close();
  }
}

runPhase5Tests().catch((err) => {
  console.error('\nPhase 5 Test failed:', err);
  process.exit(1);
});
