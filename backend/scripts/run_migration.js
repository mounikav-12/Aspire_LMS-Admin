const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { supabase } = require('../src/config/supabase');
const {
  parseBatchDueDates,
  initializeBatchDueDates,
  calculateBatchProjectDueDate
} = require('../src/utils/projectDeadlineUtils');

(async () => {
  console.log('================================================================');
  console.log('--- STARTING DATABASE DUE DATE MIGRATION (KEY: BATCH CODE) ---');
  console.log('================================================================\n');

  // 1. Fetch batches
  const { data: batches, error: bErr } = await supabase.from('batches').select('*');
  if (bErr) throw bErr;
  console.log(`Found ${batches.length} batches:`, batches.map(b => `${b.code} (id: ${b.id})`));
  const allBatchCodes = batches.map(b => b.code);

  // 2. Fetch milestone locks
  const { data: locks, error: lErr } = await supabase.from('milestone_locks').select('*');
  if (lErr) throw lErr;
  console.log(`Found ${locks.length} milestone locks.`);

  // 3. Fetch projects
  const { data: projects, error: pErr } = await supabase.from('projects').select('*');
  if (pErr) throw pErr;
  console.log(`Found ${projects.length} projects to migrate.\n`);

  const cleanStr = (s) => String(s || '').toLowerCase().replace(/-(w|s)$/i, '').trim();

  let migratedCount = 0;
  let unlockedCount = 0;
  let lockedCount = 0;

  for (const proj of projects) {
    // Parse existing map and translate any batch ID keys to batch codes
    const currentMap = parseBatchDueDates(proj.due_date, batches);
    const newMap = initializeBatchDueDates(allBatchCodes, currentMap, batches);

    const pId = cleanStr(proj.id);
    const mId = cleanStr(proj.inner_topic_id);
    const sId = cleanStr(proj.subtopic_id);
    const stgId = cleanStr(proj.stage_id);

    for (const b of batches) {
      // If batch date is not yet established
      if (!newMap[b.code] || typeof newMap[b.code] !== 'string' || !newMap[b.code].match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Look for matching unlock in milestone_locks
        const matchingLock = locks.find((l) => {
          const lId = cleanStr(l.lesson_id);
          const isMatch = lId === pId || lId === mId || lId === sId || lId === stgId;
          if (!isMatch) return false;
          return l.batch_code === b.code || l.batch_code === b.id || l.batch_code === 'ALL';
        });

        if (matchingLock && !matchingLock.is_locked && matchingLock.unlock_date) {
          const calc = calculateBatchProjectDueDate(proj, matchingLock.unlock_date);
          newMap[b.code] = calc ? calc.dueDate : null;
          unlockedCount++;
        } else {
          // Requirement 3: Locked projects must have literal JSON null
          newMap[b.code] = null;
          lockedCount++;
        }
      } else {
        unlockedCount++;
      }
    }

    // Ensure all old batch ID keys or leftover test keys are completely removed
    for (const k of Object.keys(newMap)) {
      if (k.startsWith('batch-') || k.startsWith('batch_')) {
        delete newMap[k];
      }
    }

    const jsonStr = JSON.stringify(newMap);
    const { error: upErr } = await supabase
      .from('projects')
      .update({
        due_date: jsonStr
      })
      .eq('id', proj.id);

    if (upErr) {
      console.error(`Error updating project ${proj.id}:`, upErr.message);
    } else {
      migratedCount++;
    }
  }

  console.log(`\nMigration completed successfully!`);
  console.log(`Total projects migrated: ${migratedCount}`);
  console.log(`Unlocked batch entries: ${unlockedCount}`);
  console.log(`Locked batch entries (with literal null): ${lockedCount}`);

  // Sample check
  const { data: sample } = await supabase.from('projects').select('id, title, due_date').limit(4);
  console.log('\nSample migrated project records (keys are batch codes):');
  sample.forEach(s => {
    console.log(`Project ${s.id} (${s.title}):`);
    console.log(' due_date JSON:', s.due_date);
  });
})();
