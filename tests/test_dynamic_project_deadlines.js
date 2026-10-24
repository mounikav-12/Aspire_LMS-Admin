const assert = require('assert');
const {
  DEFAULT_PROJECT_DEADLINES,
  normalizeProjectType,
  getDefaultDeadlineDays,
  validateDeadlineDays,
  calculateDueDate,
  calculateRemainingTime,
  parseBatchDueDates,
  initializeBatchDueDates,
  updateProjectBatchDueDate,
  atomicMergeBatchDueDates,
  calculateBatchProjectDueDate,
  recordBatchUnlock,
  getEffectiveProjectDueDate,
  checkSubmissionDeadline
} = require('../backend/src/utils/projectDeadlineUtils');

console.log('================================================================');
console.log('--- DYNAMIC PROJECT DUE DATES: 11 SCENARIO VALIDATION TESTS ---');
console.log('--- STORAGE KEY: BATCH CODE (e.g. A26W1, A26S1, A26W2, A26S2) ---');
console.log('================================================================\n');

const mockBatches = [
  { id: 'batch-101', code: 'A26W1', category: 'Weekday' },
  { id: 'batch-102', code: 'A26S1', category: 'Weekend' },
  { id: 'batch-103', code: 'A26W2', category: 'Weekday' },
  { id: 'batch-104', code: 'A26S2', category: 'Weekend' }
];
const allBatchCodes = mockBatches.map(b => b.code);

// -----------------------------------------------------------------------------
// Scenario 1: An unlocked batch receives the correct due date based on its milestone schedule
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 1] Unlocked batch receives correct due date based on milestone schedule:');
  const project = {
    id: 'proj-001',
    title: 'E-Commerce Storefront',
    type: 'Mini', // 3 calendar days
    deadlineDuration: 3,
    due_date: initializeBatchDueDates(allBatchCodes, {}, mockBatches)
  };

  const milestoneUnlockDate = '2026-11-02';
  const calc = calculateBatchProjectDueDate(project, milestoneUnlockDate);
  assert.strictEqual(calc.dueDate, '2026-11-05', 'Mini project unlocked on Nov 2 must be due Nov 5 (Nov 2 + 3 days)');

  const updatedDueDates = updateProjectBatchDueDate(project.due_date, 'A26W1', calc.dueDate, allBatchCodes, mockBatches);
  assert.strictEqual(updatedDueDates['A26W1'], '2026-11-05', 'Due date must be stored under batch code A26W1');
  console.log('✓ Batch A26W1 due date correctly calculated and stored by batch code:', updatedDueDates['A26W1']);
  console.log('✓ Scenario 1 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 2: An existing batch with a locked project has a "null" due date
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 2] Existing batch with a locked project has a literal null due date:');
  const project = {
    id: 'proj-002',
    title: 'Cloud DevOps Pipeline',
    type: 'Major', // 5 calendar days
    due_date: {
      'A26W1': '2026-11-10',
      'A26S1': null,
      'A26W2': '2026-11-15',
      'A26S2': null
    }
  };

  // Batches A26S1 and A26S2 are locked
  assert.strictEqual(project.due_date['A26S1'], null, 'Locked batch A26S1 must have literal null value');
  assert.strictEqual(project.due_date['A26S2'], null, 'Locked batch A26S2 must have literal null value');
  assert.notStrictEqual(project.due_date['A26S1'], '', 'Must not be empty string');
  assert.notStrictEqual(project.due_date['A26S1'], 'null', 'Must not be string "null"');
  assert.notStrictEqual(project.due_date['A26S1'], 'None', 'Must not be string "None"');

  const effA26S1 = getEffectiveProjectDueDate(project, 'A26S1', null, [], null, mockBatches);
  assert.strictEqual(effA26S1.dueDate, null, 'Effective due date must be null');
  assert.strictEqual(effA26S1.formattedDueDate, 'Not unlocked', 'Formatted display must be "Not unlocked"');
  assert.strictEqual(effA26S1.isLocked, true, 'isLocked must be true');

  // Also verify legacy batch ID query 'batch-102' resolves to 'A26S1'
  const effLegacyId = getEffectiveProjectDueDate(project, 'batch-102', null, [], null, mockBatches);
  assert.strictEqual(effLegacyId.dueDate, null);
  assert.strictEqual(effLegacyId.formattedDueDate, 'Not unlocked');

  console.log('✓ Batch A26S1 due date is literal null, display is:', effA26S1.formattedDueDate);
  console.log('✓ Legacy ID lookup batch-102 properly mapped to A26S1:', effLegacyId.formattedDueDate);
  console.log('✓ Scenario 2 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 3: A newly created batch has a "null" due date until its project is unlocked
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 3] Newly created batch initialized to null until unlocked:');
  const existingProject = {
    id: 'proj-003',
    title: 'AI Prompt Engineering Platform',
    type: 'Mini',
    due_date: {
      'A26W1': '2026-11-05',
      'A26S1': null,
      'A26W2': '2026-11-15'
    }
  };

  const newBatchCode = 'A26W3';
  const updatedAllBatches = [...allBatchCodes, newBatchCode];
  const initializedDueDates = initializeBatchDueDates(updatedAllBatches, existingProject.due_date);

  assert.strictEqual(initializedDueDates[newBatchCode], null, 'New batch code must be initialized with literal null');
  assert.strictEqual(initializedDueDates['A26W1'], '2026-11-05', 'Existing batch A26W1 must be preserved');
  assert.strictEqual(initializedDueDates['A26S1'], null, 'Existing batch A26S1 null must be preserved');
  assert.strictEqual(initializedDueDates['A26W2'], '2026-11-15', 'Existing batch A26W2 must be preserved');

  const effNew = getEffectiveProjectDueDate({ ...existingProject, due_date: initializedDueDates }, newBatchCode);
  assert.strictEqual(effNew.dueDate, null);
  assert.strictEqual(effNew.formattedDueDate, 'Not unlocked');

  console.log('✓ New batch A26W3 successfully initialized to null without affecting existing batches');
  console.log('✓ Scenario 3 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 4: Unlocking one batch does not affect other batches
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 4] Unlocking one batch does not affect other batches:');
  const initialDueDates = {
    'A26W1': '2026-11-05',
    'A26S1': null,
    'A26W2': '2026-11-15',
    'A26S2': null
  };

  // Unlock Batch A26S1 on Nov 10 for a Major project (5 days -> due Nov 15)
  const afterUnlockBatchA26S1 = updateProjectBatchDueDate(initialDueDates, 'A26S1', '2026-11-15', allBatchCodes);

  assert.strictEqual(afterUnlockBatchA26S1['A26S1'], '2026-11-15', 'Batch A26S1 must have its new due date');
  assert.strictEqual(afterUnlockBatchA26S1['A26W1'], '2026-11-05', 'Batch A26W1 must remain completely unchanged');
  assert.strictEqual(afterUnlockBatchA26S1['A26W2'], '2026-11-15', 'Batch A26W2 must remain completely unchanged');
  assert.strictEqual(afterUnlockBatchA26S1['A26S2'], null, 'Batch A26S2 must remain locked null');

  console.log('✓ Batch A26S1 unlocked to 2026-11-15, all other batch codes strictly preserved');
  console.log('✓ Scenario 4 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 5: Updating one batch\'s milestone changes only the appropriate due dates
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 5] Milestone schedule update affects only target batch:');
  const initialDueDates = {
    'A26W1': '2026-11-05',
    'A26S1': '2026-11-20',
    'A26W2': '2026-11-15'
  };

  // Milestone schedule for Batch A26W1 shifts to unlock on Nov 6 (Mini project -> due Nov 9)
  const updatedDueDates = updateProjectBatchDueDate(initialDueDates, 'A26W1', '2026-11-09', allBatchCodes);

  assert.strictEqual(updatedDueDates['A26W1'], '2026-11-09', 'Batch A26W1 due date updated to Nov 9');
  assert.strictEqual(updatedDueDates['A26S1'], '2026-11-20', 'Batch A26S1 due date must remain Nov 20');
  assert.strictEqual(updatedDueDates['A26W2'], '2026-11-15', 'Batch A26W2 due date must remain Nov 15');

  console.log('✓ Batch A26W1 shifted to 2026-11-09; Batch A26S1 and A26W2 untouched');
  console.log('✓ Scenario 5 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 6: Different batches can have different due dates for the same project
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 6] Different batches have distinct due dates for the same project:');
  const project = {
    id: 'proj-006',
    title: 'Full-Stack Graduation Project',
    type: 'Capstone', // 10 days default
    due_date: {
      'A26W1': '2026-11-05',
      'A26S1': '2026-11-18',
      'A26W2': '2026-12-01',
      'A26S2': null
    }
  };

  const effW1 = getEffectiveProjectDueDate(project, 'A26W1', null, [], null, mockBatches);
  const effS1 = getEffectiveProjectDueDate(project, 'A26S1', null, [], null, mockBatches);
  const effW2 = getEffectiveProjectDueDate(project, 'A26W2', null, [], null, mockBatches);
  const effS2 = getEffectiveProjectDueDate(project, 'A26S2', null, [], null, mockBatches);

  assert.strictEqual(effW1.dueDate, '2026-11-05');
  assert.strictEqual(effS1.dueDate, '2026-11-18');
  assert.strictEqual(effW2.dueDate, '2026-12-01');
  assert.strictEqual(effS2.dueDate, null);

  assert.notStrictEqual(effW1.dueDate, effS1.dueDate);
  assert.notStrictEqual(effS1.dueDate, effW2.dueDate);

  console.log('✓ Batch A26W1:', effW1.formattedDueDate);
  console.log('✓ Batch A26S1:', effS1.formattedDueDate);
  console.log('✓ Batch A26W2:', effW2.formattedDueDate);
  console.log('✓ Batch A26S2 (Locked):', effS2.formattedDueDate);
  console.log('✓ Scenario 6 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 7: Locking a project updates its due-date value appropriately
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 7] Locking a project updates its due date value to literal null:');
  const initialDueDates = {
    'A26W1': '2026-11-05',
    'A26S1': '2026-11-18',
    'A26W2': '2026-12-01'
  };

  // Admin locks the project for Batch A26S1
  const afterLock = updateProjectBatchDueDate(initialDueDates, 'A26S1', null, allBatchCodes);

  assert.strictEqual(afterLock['A26S1'], null, 'Locked project for Batch A26S1 must have literal null value');
  assert.strictEqual(afterLock['A26W1'], '2026-11-05', 'Batch A26W1 must remain intact');
  assert.strictEqual(afterLock['A26W2'], '2026-12-01', 'Batch A26W2 must remain intact');

  const effS1 = getEffectiveProjectDueDate({ due_date: afterLock }, 'A26S1');
  assert.strictEqual(effS1.dueDate, null);
  assert.strictEqual(effS1.formattedDueDate, 'Not unlocked');
  assert.strictEqual(effS1.isLocked, true);

  console.log('✓ Batch A26S1 successfully locked to null. Status:', effS1.formattedDueDate);
  console.log('✓ Scenario 7 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 8: Existing project and batch data remains intact after migration
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 8] Migration preserves existing project and batch data and maps to batch codes:');
  const existingProjectRow = {
    id: 'proj-existing',
    title: 'Microservices Gateway API',
    type: 'Major',
    category: 'Backend Architecture',
    due_date: 'Due Aug 30', // Legacy scalar string
    description: '{"courseId":"crs-101","stageId":"stg-1"}'
  };

  // Migration should parse legacy, initialize all batch codes to null if locked
  const migratedBatchDueDates = initializeBatchDueDates(allBatchCodes, parseBatchDueDates(existingProjectRow.due_date, mockBatches), mockBatches);

  assert.strictEqual(typeof migratedBatchDueDates, 'object');
  for (const bCode of allBatchCodes) {
    assert.strictEqual(migratedBatchDueDates[bCode], null, `Batch code ${bCode} must be initialized with literal null`);
  }

  // If previous DB had legacy batch IDs:
  const legacyMap = {
    'batch-101': '2026-11-05',
    'batch-102': null
  };
  const converted = initializeBatchDueDates(allBatchCodes, legacyMap, mockBatches);
  assert.strictEqual(converted['A26W1'], '2026-11-05', 'Legacy batch-101 must be converted to A26W1');
  assert.strictEqual(converted['A26S1'], null, 'Legacy batch-102 null must be converted to A26S1');
  assert.strictEqual(converted['batch-101'], undefined, 'Old batch-101 key must be removed');

  console.log('✓ Migration safely mapped legacy batch IDs to batch codes:', converted);
  console.log('✓ Scenario 8 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 9: The frontend displays the correct date for each selected batch
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 9] Frontend displays correct date per selected batch:');
  const project = {
    id: 'proj-009',
    title: 'Interactive Dashboard',
    type: 'Mini',
    due_date: {
      'A26W1': '2026-11-05',
      'A26S1': null,
      'A26W2': '2026-11-15'
    }
  };

  // User selects Batch A26W1 (Unlocked)
  const viewBatchW1 = getEffectiveProjectDueDate(project, 'A26W1', null, [], null, mockBatches);
  assert.strictEqual(viewBatchW1.formattedDueDate, 'Nov 5, 2026');
  assert.strictEqual(viewBatchW1.isLocked, false);

  // User changes dropdown to Batch A26S1 (Locked)
  const viewBatchS1 = getEffectiveProjectDueDate(project, 'A26S1', null, [], null, mockBatches);
  assert.strictEqual(viewBatchS1.dueDate, null);
  assert.strictEqual(viewBatchS1.formattedDueDate, 'Not unlocked');
  assert.strictEqual(viewBatchS1.isLocked, true);

  // User changes dropdown to Batch A26W2 (Unlocked)
  const viewBatchW2 = getEffectiveProjectDueDate(project, 'A26W2', null, [], null, mockBatches);
  assert.strictEqual(viewBatchW2.formattedDueDate, 'Nov 15, 2026');
  assert.strictEqual(viewBatchW2.isLocked, false);

  // Alias lookups
  const viewWeekday = getEffectiveProjectDueDate(project, 'Weekday Batch', null, [], null, mockBatches);
  assert.strictEqual(viewWeekday.formattedDueDate, 'Nov 5, 2026');

  console.log('✓ Batch A26W1 view: Due', viewBatchW1.formattedDueDate);
  console.log('✓ Batch A26S1 view:', viewBatchS1.formattedDueDate);
  console.log('✓ Batch A26W2 view: Due', viewBatchW2.formattedDueDate);
  console.log('✓ Batch Alias (Weekday Batch) view: Due', viewWeekday.formattedDueDate);
  console.log('✓ Scenario 9 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 10: Concurrent updates do not overwrite other batches\' due dates
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 10] Concurrent updates do not clobber other batches:');
  // Initial database state keyed by batch codes
  const baseDbState = {
    'A26W1': '2026-11-05',
    'A26S1': null,
    'A26W2': null
  };

  // Request 1: Admin A updates Batch A26S1 to '2026-11-10'
  const stateAfterReq1 = atomicMergeBatchDueDates(baseDbState, 'A26S1', '2026-11-10');

  // Request 2: Simultaneously, Admin B updates Batch A26W2 to '2026-11-25'
  // When Request 2 merges into the latest state, Request 1\'s change is preserved:
  const stateAfterReq2 = atomicMergeBatchDueDates(stateAfterReq1, 'A26W2', '2026-11-25');

  assert.strictEqual(stateAfterReq2['A26W1'], '2026-11-05', 'Original Batch A26W1 must be preserved');
  assert.strictEqual(stateAfterReq2['A26S1'], '2026-11-10', 'Concurrent update for Batch A26S1 must be preserved');
  assert.strictEqual(stateAfterReq2['A26W2'], '2026-11-25', 'Concurrent update for Batch A26W2 must be applied');

  console.log('✓ State after simulated concurrent requests:', stateAfterReq2);
  console.log('✓ Scenario 10 PASSED.\n');
}

// -----------------------------------------------------------------------------
// Scenario 11: Existing application features that depend on project due dates continue to work correctly
// -----------------------------------------------------------------------------
{
  console.log('[SCENARIO 11] Existing features (deadline calculation, submission checks, remaining time) function correctly:');

  // Feature A: Submission deadline check (on-time vs overdue)
  const onTimeCheck = checkSubmissionDeadline('2026-11-04 18:00:00', '2026-11-05 23:59:59');
  assert.strictEqual(onTimeCheck.isLate, false);
  assert.strictEqual(onTimeCheck.label, 'ON_TIME');

  const lateCheck = checkSubmissionDeadline('2026-11-07 10:00:00', '2026-11-05 23:59:59');
  assert.strictEqual(lateCheck.isLate, true);
  assert.strictEqual(lateCheck.label, 'OVERDUE');

  // Feature B: Remaining time calculation
  const rem = calculateRemainingTime('2026-11-05T23:59:59.000Z', new Date('2026-11-03T12:00:00.000Z').getTime());
  assert.strictEqual(rem.isOverdue, false);
  assert.strictEqual(rem.daysLeft, 2);

  // Feature C: Configurable project deadlines (Mini=3, Major=5, Capstone=8..10)
  assert.strictEqual(getDefaultDeadlineDays('Mini'), 3);
  assert.strictEqual(getDefaultDeadlineDays('Major'), 5);
  assert.strictEqual(getDefaultDeadlineDays('Capstone'), 10);
  assert.strictEqual(validateDeadlineDays('Capstone', 9).isValid, true);
  assert.strictEqual(validateDeadlineDays('Capstone', 15).isValid, false);

  console.log('✓ Submission checks, remaining time calculations, and type validation working perfectly');
  console.log('✓ Scenario 11 PASSED.\n');
}

console.log('================================================================');
console.log('★ ALL 11 TEST SCENARIOS PASSED WITH 100% ACCURACY & ZERO ERRORS');
console.log('================================================================\n');
