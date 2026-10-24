const assert = require('assert');
const http = require('http');
const path = require('path');
require(path.join(__dirname, '../backend/node_modules/dotenv')).config({ path: path.join(__dirname, '../backend/.env') });

const app = require('../backend/src/server');

const makeRequest = (server, method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const port = address.port;

    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

(async () => {
  console.log('================================================================');
  console.log('--- RUNNING BACKEND HTTP ENDPOINTS INTEGRATION TEST SUITE ---');
  console.log('--- (VALIDATING STORAGE KEY: BATCH CODE) ---');
  console.log('================================================================\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Test server running on port ${port}\n`);

  try {
    let sampleProjectId = null;
    const testBatchId = `batch-test-${Date.now()}`;
    const testBatchCode = `TB${Date.now().toString().slice(-4)}`;

    // 1. GET /api/projects
    console.log('[TEST 1] GET /api/projects');
    const res1 = await makeRequest(server, 'GET', '/api/projects');
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res1.body.success, true);
    assert(Array.isArray(res1.body.data) && res1.body.data.length > 0);
    sampleProjectId = res1.body.data[0].id;
    assert(typeof res1.body.data[0].due_date === 'object');
    console.log(`✓ Retrieved ${res1.body.data.length} projects. Sample due_date keys:`, Object.keys(res1.body.data[0].due_date));

    // 2. GET /api/projects?batch=A26W1
    console.log('\n[TEST 2] GET /api/projects?batch=A26W1');
    const res2 = await makeRequest(server, 'GET', '/api/projects?batch=A26W1');
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.body.success, true);
    const pFiltered = res2.body.data[0];
    assert('effective_due_date' in pFiltered);
    assert('effective_formatted_due_date' in pFiltered);
    assert('is_locked' in pFiltered);
    console.log(`✓ Filtered due date: ${pFiltered.effective_due_date}, formatted: "${pFiltered.effective_formatted_due_date}", locked: ${pFiltered.is_locked}`);

    // 3. GET /api/batches
    console.log('\n[TEST 3] GET /api/batches');
    const res3 = await makeRequest(server, 'GET', '/api/batches');
    assert.strictEqual(res3.status, 200);
    assert.strictEqual(res3.body.success, true);
    console.log(`✓ Total batches registered in DB: ${res3.body.data.length}`);

    // 4. POST /api/batches - creates batch and verifies null initialization under batch code
    console.log(`\n[TEST 4] POST /api/batches - create batch code ${testBatchCode}`);
    const res4 = await makeRequest(server, 'POST', '/api/batches', {
      id: testBatchId,
      code: testBatchCode,
      category: 'Weekday'
    });
    assert.strictEqual(res4.status, 201);
    assert.strictEqual(res4.body.success, true);

    // Verify projects now have testBatchCode initialized to null
    const res4Proj = await makeRequest(server, 'GET', '/api/projects');
    const targetProj = res4Proj.body.data.find(p => p.id === sampleProjectId);
    assert.strictEqual(targetProj.due_date[testBatchCode], null, 'New batch code due date must be initialized to literal null');
    console.log(`✓ New batch code ${testBatchCode} initialized to literal null in project ${sampleProjectId}:`, targetProj.due_date);

    // 5. PUT /api/projects/:id/batch-due-date - update and lock by batch code
    console.log(`\n[TEST 5] PUT /api/projects/${sampleProjectId}/batch-due-date`);
    const res5 = await makeRequest(server, 'PUT', `/api/projects/${sampleProjectId}/batch-due-date`, {
      batch_code: testBatchCode,
      due_date: '2026-11-20'
    });
    assert.strictEqual(res5.status, 200);
    assert.strictEqual(res5.body.due_date[testBatchCode], '2026-11-20');
    console.log(`✓ Batch code ${testBatchCode} due date updated to:`, res5.body.due_date[testBatchCode]);

    // Lock it back
    const res5Lock = await makeRequest(server, 'PUT', `/api/projects/${sampleProjectId}/batch-due-date`, {
      batch_code: testBatchCode,
      due_date: null
    });
    assert.strictEqual(res5Lock.status, 200);
    assert.strictEqual(res5Lock.body.due_date[testBatchCode], null);
    console.log(`✓ Batch code ${testBatchCode} locked back to literal null:`, res5Lock.body.due_date[testBatchCode]);

    // 6. POST /api/projects/sync-milestones by batch code
    console.log('\n[TEST 6] POST /api/projects/sync-milestones');
    const res6 = await makeRequest(server, 'POST', '/api/projects/sync-milestones', {
      milestoneId: 'mod-git',
      batchCode: testBatchCode,
      unlockDate: '2026-11-10',
      isLocked: false
    });
    assert.strictEqual(res6.status, 200);
    assert.strictEqual(res6.body.success, true);
    console.log(`✓ Synced milestone to ${res6.body.affectedCount} matching projects for batch code ${testBatchCode}`);

    console.log('\n================================================================');
    console.log('★ ALL BACKEND INTEGRATION TESTS PASSED WITH 100% ACCURACY!');
    console.log('================================================================\n');
  } finally {
    server.close();
  }
})();
