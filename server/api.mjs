import { readFileSync } from 'node:fs';
import nodemailer from 'nodemailer';

const categories = ['Rough gemstones', 'Botanicals & superfoods', 'Trade or distribution partnership', 'Women’s teas', 'Other'];
const optional = ['company', 'country', 'phone', 'product', 'specifications', 'quantity', 'destination'];
const fields = ['fullName', 'email', 'interest', 'message', ...optional];
const limits = { fullName: 200, email: 254, interest: 100, message: 5000, specifications: 1000 };

export function validateEnquiry(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { error: 'Please provide an enquiry.' };
  const result = {};
  for (const field of fields) {
    if (data[field] !== undefined && typeof data[field] !== 'string') return { error: 'Please use text for enquiry fields.' };
    result[field] = (data[field] || '').trim();
    if (result[field].length > (limits[field] || 200)) return { error: 'One or more fields are too long.' };
  }
  if (!result.fullName || !result.message || !result.email || !result.interest) return { error: 'Please complete the required fields.' };
  if (!/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(result.email)) return { error: 'Please enter a valid email address.' };
  if (!categories.includes(result.interest)) return { error: 'Please choose an enquiry type.' };
  return { data: result };
}

export function getSettings() {
  let privacyNotice = '';
  if (process.env.PRIVACY_NOTICE_PATH) { try { privacyNotice = readFileSync(process.env.PRIVACY_NOTICE_PATH, 'utf8').trim(); } catch {} }
  const deliveryAvailable = process.env.PRIVACY_REVIEWED === 'true' && privacyNotice.length > 100 && Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_FROM);
  return { deliveryAvailable, privacyNotice: process.env.PRIVACY_REVIEWED === 'true' ? privacyNotice : '' };
}

async function deliver(data) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, requireTLS: port !== 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }, connectionTimeout: 15000, socketTimeout: 20000 });
  const result = await transporter.sendMail({ from: process.env.SMTP_FROM, to: 'info@bs-botanicals.com', replyTo: data.email, subject: `Website enquiry: ${data.interest}`, text: fields.filter(key => data[key]).map(key => `${key}: ${data[key]}`).join('\n\n') });
  if (!result.accepted?.length) throw new Error('Mail was not accepted.');
}

export function createApi({ settings = getSettings, sendMail = deliver, clock = Date.now } = {}) {
  const attempts = new Map();
  function json(res, code, data) { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(data)); }
  return async function api(req, res, next = () => json(res, 404, { error: 'Not found.' })) {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (!path.startsWith('/api/')) return next();
    if (path === '/api/config' && req.method === 'GET') return json(res, 200, settings());
    if (path !== '/api/enquiry') return json(res, 404, { error: 'Not found.' });
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
    if (!settings().deliveryAvailable) return json(res, 503, { error: 'Direct enquiries are not active. Please email info@bs-botanicals.com.' });
    let origin;
    try { origin = new URL(req.headers.origin); } catch { return json(res, 403, { error: 'Request origin is not allowed.' }); }
    if (!['http:', 'https:'].includes(origin.protocol) || origin.host !== req.headers.host) return json(res, 403, { error: 'Request origin is not allowed.' });
    if (!(req.headers['content-type'] || '').startsWith('application/json')) return json(res, 415, { error: 'Please use JSON.' });
    const now = clock();
    for (const [key, value] of attempts) if (now - value.start > 600000) attempts.delete(key);
    const ip = req.socket.remoteAddress || 'unknown';
    const entry = attempts.get(ip) || { start: now, count: 0 };
    if (entry.count >= 5) return json(res, 429, { error: 'Please wait a few minutes before trying again.' });
    attempts.set(ip, { ...entry, count: entry.count + 1 });
    let body = '';
    try {
      for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 20000) return json(res, 413, { error: 'Your enquiry is too large.' }); }
      const validation = validateEnquiry(JSON.parse(body));
      if (validation.error) return json(res, 400, { error: validation.error });
      await sendMail(validation.data);
      return json(res, 200, { success: true });
    } catch (error) {
      return json(res, error instanceof SyntaxError ? 400 : 502, { error: 'We couldn’t send your enquiry. Please try again or email info@bs-botanicals.com.' });
    }
  };
}

export const handleApi = createApi();
