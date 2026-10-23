const assert = require('assert');
const {
  DEFAULT_PROJECT_DEADLINES,
  normalizeProjectType,
  getDefaultDeadlineDays,
  validateDeadlineDays,
  calculateDueDate,
  calculateRemainingTime,
  recordBatchUnlock,
  getEffectiveProjectDueDate
} = require('../backend/src/utils/projectDeadlineUtils');

console.log('--- RUNNING DYNAMIC PROJECT DUE DATE UNIT TESTS ---');

// Test 1: Scenario 1 - Batch A unlocks a Mini Project on October 1 and Batch B unlocks it on October 10.
// Each batch must receive its own due date.
{
  console.log('\n[TEST 1] Batch A vs Batch B Independent Due Dates:');
  const project = {
    id: 'proj-101',
    title: 'E-Commerce Storefront',
    type: 'Mini',
    dueDate: 'Due Aug 30'
  };

  const projAfterBatchA = recordBatchUnlock(project, 'Batch_A', '2026-10-01');
  const projAfterBatchB = recordBatchUnlock(projAfterBatchA, 'Batch_B', '2026-10-10');

  const effBatchA = getEffectiveProjectDueDate(projAfterBatchB, 'Batch_A');
  const effBatchB = getEffectiveProjectDueDate(projAfterBatchB, 'Batch_B');

  console.log('Batch A Due Date:', effBatchA.dueDate, 'Formatted:', effBatchA.formattedDueDate);
  console.log('Batch B Due Date:', effBatchB.dueDate, 'Formatted:', effBatchB.formattedDueDate);

  // Mini project is 3 calendar days
  assert.strictEqual(effBatchA.dueDate, '2026-10-04', 'Batch A due date should be 2026-10-04 (Oct 1 + 3 days)');
  assert.strictEqual(effBatchB.dueDate, '2026-10-13', 'Batch B due date should be 2026-10-13 (Oct 10 + 3 days)');
  assert.notStrictEqual(effBatchA.dueDate, effBatchB.dueDate, 'Batches must have distinct due dates');
  console.log('? Passed: Scenario 1 verified successfully.');
}

// Test 2: Scenario 2 - Mini, Major, and Capstone Projects receive their respective configured deadlines.
{
  console.log('\n[TEST 2] Project Type Default and Configured Deadlines (Mini, Major, Capstone):');
  const unlockDate = '2026-10-01';

  // Mini: 3 calendar days
  const miniCalc = calculateDueDate(unlockDate, getDefaultDeadlineDays('Mini'));
  assert.strictEqual(miniCalc.dueDate, '2026-10-04');
  assert.strictEqual(miniCalc.durationDays, 3);
  console.log('Mini Project (3 days):', miniCalc.dueDate);

  // Major: 5 calendar days
  const majorCalc = calculateDueDate(unlockDate, getDefaultDeadlineDays('Major'));
  assert.strictEqual(majorCalc.dueDate, '2026-10-06');
  assert.strictEqual(majorCalc.durationDays, 5);
  console.log('Major Project (5 days):', majorCalc.dueDate);

  // Capstone: 10 calendar days default
  const capCalc = calculateDueDate(unlockDate, getDefaultDeadlineDays('Capstone'));
  assert.strictEqual(capCalc.dueDate, '2026-10-11');
  assert.strictEqual(capCalc.durationDays, 10);
  console.log('Capstone Project default (10 days):', capCalc.dueDate);

  // Capstone configurable within 8-10 days: test 8 days
  const valid8 = validateDeadlineDays('Capstone', 8);
  assert.strictEqual(valid8.isValid, true);
  const capCalc8 = calculateDueDate(unlockDate, valid8.days);
  assert.strictEqual(capCalc8.dueDate, '2026-10-09');
  console.log('Capstone Project configured (8 days):', capCalc8.dueDate);

  // Capstone validation bounds (clamp outside 8-10)
  const invalidLow = validateDeadlineDays('Capstone', 5);
  assert.strictEqual(invalidLow.isValid, false);
  assert.strictEqual(invalidLow.days, 8, 'Low out-of-range value clamped to 8');

  const invalidHigh = validateDeadlineDays('Capstone', 15);
  assert.strictEqual(invalidHigh.isValid, false);
  assert.strictEqual(invalidHigh.days, 10, 'High out-of-range value clamped to 10');

  console.log('? Passed: Scenario 2 verified successfully.');
}

// Test 3: Scenario 3 - Repeated unlock event does NOT reset an existing deadline.
{
  console.log('\n[TEST 3] Duplicate Unlock Event Prevention:');
  const project = {
    id: 'proj-202',
    title: 'Cloud DevOps Pipeline',
    type: 'Major',
    dueDate: 'Due Aug 30'
  };

  // First unlock: October 1 -> due October 6
  const p1 = recordBatchUnlock(project, 'Batch_A', '2026-10-01');
  assert.strictEqual(p1.batchDueDates.Batch_A.dueDate, '2026-10-06');

  // Repeated unlock event on October 5 (simulating repeat admin click or module update)
  const p2 = recordBatchUnlock(p1, 'Batch_A', '2026-10-05', null, false);
  assert.strictEqual(p2.batchDueDates.Batch_A.dueDate, '2026-10-06', 'Deadline must NOT be reset by duplicate unlock');
  assert.strictEqual(p2.batchDueDates.Batch_A.unlockDate, '2026-10-01', 'Unlock date must retain original timestamp');

  // Explicit authorized force reset
  const p3 = recordBatchUnlock(p2, 'Batch_A', '2026-10-05', null, true);
  assert.strictEqual(p3.batchDueDates.Batch_A.dueDate, '2026-10-10', 'Explicit forced reset allowed when authorized');

  console.log('? Passed: Scenario 3 verified successfully.');
}

// Test 4: Scenario 4 - Students in different batches see correct due dates for the same project.
{
  console.log('\n[TEST 4] Student Dashboard Batch Isolation:');
  const project = {
    id: 'proj-shared',
    title: 'AI Prompt Engineering Tool',
    type: 'Mini',
    batchDueDates: {
      'Batch_Alpha': {
        dueDate: '2026-10-04',
        formattedDueDate: 'Oct 4, 2026',
        dueDateTime: '2026-10-04T23:59:59.000Z'
      },
      'Batch_Beta': {
        dueDate: '2026-10-15',
        formattedDueDate: 'Oct 15, 2026',
        dueDateTime: '2026-10-15T23:59:59.000Z'
      }
    }
  };

  const studentAlphaView = getEffectiveProjectDueDate(project, 'Batch_Alpha');
  const studentBetaView = getEffectiveProjectDueDate(project, 'Batch_Beta');

  assert.strictEqual(studentAlphaView.formattedDueDate, 'Oct 4, 2026');
  assert.strictEqual(studentBetaView.formattedDueDate, 'Oct 15, 2026');
  console.log('Student Alpha views:', studentAlphaView.formattedDueDate);
  console.log('Student Beta views:', studentBetaView.formattedDueDate);

  console.log('? Passed: Scenario 4 verified successfully.');
}

// Test 5: Scenario 5 - Overdue status and submission validation use the correct deadline.
{
  console.log('\n[TEST 5] Overdue Status & Deadline Validation:');
  const dueDateTime = '2026-10-04T23:59:59.000Z';

  // Before deadline (October 3, 2026)
  const onTimeCheck = calculateRemainingTime(dueDateTime, new Date('2026-10-03T12:00:00.000Z').getTime());
  assert.strictEqual(onTimeCheck.isOverdue, false);
  console.log('Oct 3 remaining text:', onTimeCheck.text);

  // After deadline (October 6, 2026)
  const overdueCheck = calculateRemainingTime(dueDateTime, new Date('2026-10-06T12:00:00.000Z').getTime());
  assert.strictEqual(overdueCheck.isOverdue, true);
  assert.strictEqual(overdueCheck.label, 'OVERDUE');
  console.log('Oct 6 overdue text:', overdueCheck.text);

  console.log('? Passed: Scenario 5 verified successfully.');
}

// Test 6: Scenario 6 - Unlocked vs Pending Projects without dummy placeholder dates.
{
  console.log('\n[TEST 6] Pending Unlock Display (No Dummy "Sep 30" or 9154 days overdue):');
  const unreleasedProj = {
    id: 'proj-unreleased',
    title: 'Personal Project Versioning Workflow',
    type: 'Mini',
    dueDate: 'Due Sep 30' // Legacy string that used to cause 9154 days overdue
  };

  const eff = getEffectiveProjectDueDate(unreleasedProj, 'Weekday Batch');
  assert.strictEqual(eff.isOverdue, false, 'Unreleased project must NOT be overdue');
  assert.strictEqual(eff.remainingText, '', 'Unreleased project must have no overdue text');
  assert.strictEqual(eff.formattedDueDate, '3 days after unlock');
  console.log('Unreleased Mini Project display:', eff.formattedDueDate);

  const realDatedProj = {
    id: 'proj-dated',
    title: 'Graduation Capstone',
    type: 'Advanced',
    dueDate: '2026-11-20'
  };
  const effDated = getEffectiveProjectDueDate(realDatedProj, 'Weekday Batch');
  assert.strictEqual(effDated.formattedDueDate, '2026-11-20');
  console.log('Explicitly dated project display:', effDated.formattedDueDate);

  console.log('? Passed: Scenario 6 verified successfully.');
}

console.log('\n========================================');
console.log('? ALL 6 SCENARIOS PASSED WITH ZERO ERRORS');
console.log('========================================\n');
