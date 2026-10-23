import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApi, validateEnquiry } from '../server/api.mjs';

const enquiry = { fullName: 'Test Buyer', email: 'buyer@example.com', interest: 'Rough gemstones', message: 'Please discuss a sample parcel of rough emeralds for our destination market.' };

async function fixture(options, run) {
  const server = createServer(createApi(options));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const post = (body = enquiry, headers = {}) => fetch(`${origin}/api/enquiry`, { method: 'POST', headers: { origin, 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
  try { await run({ origin, post }); } finally { await new Promise(resolve => server.close(resolve)); }
}

test('four required fields suffice; optional details remain optional', () => {
  const result = validateEnquiry(enquiry);
  assert.equal(result.error, undefined);
  assert.equal(result.data.email, enquiry.email);
  assert.equal(result.data.company, '');
  for (const key of ['fullName', 'email', 'interest', 'message']) assert.ok(validateEnquiry({ ...enquiry, [key]: ' ' }).error);
});

test('rejects invalid types, invalid categories, email injection and excessive lengths', () => {
  for (const data of [null, [], { ...enquiry, fullName: {} }, { ...enquiry, email: 'buyer@example.com\r\nBcc: victim@example.com' }, { ...enquiry, interest: 'invented category' }, { ...enquiry, message: 'x'.repeat(5001) }]) assert.ok(validateEnquiry(data).error);
});

test('direct collection is disabled until deployment prerequisites are satisfied', async () => {
  let called = false;
  await fixture({ settings: () => ({ deliveryAvailable: false, privacyNotice: '' }), sendMail: async () => { called = true; } }, async ({ origin, post }) => {
    const config = await fetch(`${origin}/api/config`).then(r => r.json());
    assert.equal(config.deliveryAvailable, false);
    assert.equal((await post()).status, 503);
    assert.equal(called, false);
  });
});

test('returns success only after the mail adapter accepts the validated enquiry', async () => {
  let sent;
  await fixture({ settings: () => ({ deliveryAvailable: true }), sendMail: async data => { sent = data; } }, async ({ post }) => {
    const response = await post({ ...enquiry, fullName: '  Test Buyer  ', product: 'Emerald' });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(sent.fullName, 'Test Buyer');
    assert.equal(sent.product, 'Emerald');
  });
});

test('mail failures cannot display a success response', async () => {
  await fixture({ settings: () => ({ deliveryAvailable: true }), sendMail: async () => { throw new Error('Provider unavailable'); } }, async ({ post }) => {
    const response = await post();
    assert.equal(response.status, 502);
    assert.ok((await response.json()).error);
  });
});

test('blocks foreign origins, malformed origins, malformed JSON, oversized bodies and invalid input before sending', async () => {
  let count = 0;
  await fixture({ settings: () => ({ deliveryAvailable: true }), sendMail: async () => { count++; } }, async ({ post }) => {
    assert.equal((await post(enquiry, { origin: 'https://another.example' })).status, 403);
    assert.equal((await post(enquiry, { origin: 'malformed' })).status, 403);
    assert.equal((await post('{')).status, 400);
    assert.equal((await post('x'.repeat(21000))).status, 413);
    assert.equal((await post({ ...enquiry, email: 'not-an-email' })).status, 400);
    assert.equal(count, 0);
  });
});

test('rate limits direct delivery', async () => {
  let count = 0;
  await fixture({ settings: () => ({ deliveryAvailable: true }), sendMail: async () => { count++; } }, async ({ post }) => {
    for (let i = 0; i < 5; i++) assert.equal((await post()).status, 200);
    assert.equal((await post()).status, 429);
    assert.equal(count, 5);
  });
});
