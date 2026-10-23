import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Copy, Mail, Gem, Leaf, Handshake, Flower2, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Button, Eyebrow, ContactDetails, FAQ, BotanicalArt } from '../components/ui';
import { categories, categoryMap } from '../data';

const blank = { fullName: '', email: '', interest: '', message: '', company: '', country: '', phone: '', product: '', specifications: '', quantity: '', destination: '' };
const labels = { fullName: 'Full name', email: 'Email address', interest: 'I am interested in', message: 'Your message', company: 'Company / organisation', country: 'Country', phone: 'Telephone / WhatsApp', product: 'Product / variety / ingredient', specifications: 'Preferred form or specifications', quantity: 'Estimated quantity', destination: 'Destination market' };

export default function Contact() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ ...blank, interest: categoryMap[params.get('category')] || '', product: (params.get('product') || '').slice(0, 200) });
  const [delivery, setDelivery] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const resultHeading = useRef(null);
  const inFlight = useRef(false);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    fetch('/api/config', { signal: controller.signal }).then(r => r.ok ? r.json() : null).then(data => { if (active) setDelivery(data?.deliveryAvailable === true && Boolean(data?.privacyNotice)); }).catch(() => { if (active) setDelivery(false); }).finally(() => clearTimeout(timer));
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, []);
  useEffect(() => {
    setForm(f => ({ ...f, interest: categoryMap[params.get('category')] || '', product: (params.get('product') || '').slice(0, 200) }));
    setStatus('idle'); setErrors({}); setError('');
  }, [params]);
  useEffect(() => { if (status === 'sent' || status === 'draft') resultHeading.current?.focus(); }, [status]);
  const update = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value, ...(name === 'interest' && value !== f.interest ? { product: '' } : {}) }));
    setErrors(existing => ({ ...existing, [name]: undefined })); setError('');
  };
  const draft = Object.entries(form).filter(([, value]) => value.trim()).map(([key, value]) => `${labels[key]}: ${value.trim()}`).join('\n\n');
  const mailto = `mailto:info@bs-botanicals.com?subject=${encodeURIComponent(`Website enquiry — ${form.interest}`)}&body=${encodeURIComponent(draft)}`;
  async function submit(e) {
    e.preventDefault();
    if (inFlight.current || delivery === null) return;
    const invalid = {};
    for (const name of ['fullName', 'email', 'interest', 'message']) if (!form[name].trim()) invalid[name] = name === 'interest' ? 'Please choose an enquiry type.' : 'Please complete this field.';
    if (form.email.trim() && !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(form.email.trim())) invalid.email = 'Please enter a valid email address.';
    if (Object.keys(invalid).length) {
      setErrors(invalid);
      requestAnimationFrame(() => document.getElementById(Object.keys(invalid)[0])?.focus());
      return;
    }
    setErrors({});
    if (!delivery) { setStatus('draft'); return; }
    inFlight.current = true; setStatus('sending'); setError('');
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) throw new Error(response.status === 429 ? 'Please wait a few minutes before trying again, or prepare an email below.' : 'We couldn’t send your enquiry. Please try again or email info@bs-botanicals.com.');
      setStatus('sent'); setForm(blank);
    } catch (err) { setError(err.message); setStatus('idle'); }
    finally { inFlight.current = false; }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft); setCopied(true); }
    catch { setError('Your browser could not copy the draft. Please select and copy the text below.'); }
  }
  const field = (name, options = {}) => {
    const invalid = errors[name];
    const shared = { id: name, name, required: options.required, value: form[name], onChange: update, 'aria-invalid': invalid ? true : undefined, 'aria-describedby': [invalid ? `${name}-error` : '', name === 'message' ? 'message-hint' : ''].filter(Boolean).join(' ') || undefined };
    return <div className={`form-field ${options.wide ? 'field-wide' : ''}`} key={name}><label htmlFor={name}>{labels[name]}{options.required && <span aria-hidden="true"> *</span>}</label>{options.multiline ? <textarea {...shared} rows={options.rows || 5} maxLength={name === 'message' ? 5000 : 1000} placeholder={options.placeholder}/> : <input {...shared} type={options.type || 'text'} autoComplete={options.autoComplete} maxLength={name === 'email' ? 254 : 200} placeholder={options.placeholder}/>}{name === 'message' && <div className="field-hint" id="message-hint"><span>Product, preferred form, quantity and destination are helpful.</span><span>{form.message.length.toLocaleString()} / 5,000</span></div>}{invalid && <p className="field-error" id={`${name}-error`}>{invalid}</p>}</div>;
  };
  return <><section className="contact-hero"><BotanicalArt className="contact-hero-art" flower/><div className="section-shell"><Eyebrow>Partnerships & enquiries</Eyebrow><h1>Let’s Connect.</h1><p className="contact-subtitle">Zambian resources. International opportunities.<br/>Long-term partnerships.</p><p>We welcome enquiries from gemstone buyers, jewellery businesses, botanical ingredient importers, manufacturers, distributors and strategic sourcing partners.</p><a className="text-link" href="#enquiry-form">Start your enquiry <ArrowRight size={18}/></a></div></section>
    <section className="contact-main section-shell"><aside className="contact-aside"><Eyebrow>A conversation worth starting</Eyebrow><h2>How We Can<br/>Work Together</h2><p>Tell us what you are looking for. We would be pleased to discuss availability, sourcing requirements and opportunities to work together.</p><div className="partnership-types">{[[Gem, 'Gemstone Sourcing', 'Rough gemstones, individual specimens, samples and parcels, subject to availability.'], [Leaf, 'Botanical Ingredients', 'Zambian raw and minimally processed botanicals, seeds and kernels for commercial applications.'], [Handshake, 'Trade & Distribution', 'Conversations with importers, distributors, manufacturers and strategic sourcing partners.'], [Flower2, 'Women’s Tea Collection', 'Early partnership enquiries for a collection that remains in development.']].map(([Icon, title, text]) => <div key={title}><Icon strokeWidth={1}/><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><ContactDetails/></aside>
    <div className="enquiry-panel" id="enquiry-form">{status === 'sent' ? <div className="form-result"><span className="result-icon"><Check/></span><Eyebrow>A new conversation begins</Eyebrow><h2 ref={resultHeading} tabIndex={-1}>Thank You for<br/>Getting in Touch.</h2><p>Your enquiry has been received. We appreciate your interest in B’s Botanicals and will review the details you have shared.</p><Button to="/">Return to Home</Button></div> : status === 'draft' ? <div className="form-result"><span className="result-icon"><Mail/></span><Eyebrow>Ready for your email app</Eyebrow><h2 ref={resultHeading} tabIndex={-1}>Your Enquiry Draft<br/>Is Ready.</h2><p>Open the draft in your email app, then send it to <strong>info@bs-botanicals.com</strong>. Your enquiry has not been sent yet.</p><div className="draft-actions"><a className="button button-primary" href={mailto}>Open Email App <ArrowRight size={18}/></a><button type="button" className="copy-button" onClick={copy}>{copied ? <Check size={18}/> : <Copy size={18}/>} {copied ? 'Enquiry copied' : 'Copy enquiry text'}</button></div><p className="draft-help">No email app set up? Copy the text below into your usual email service.</p><p className="sr-only" role="status">{copied ? 'Enquiry text copied to clipboard.' : ''}</p><pre className="draft-preview" tabIndex={0} aria-label="Your enquiry text">{draft}</pre>{error && <p role="alert" className="form-error">{error}</p>}<button type="button" className="text-link" onClick={() => { setStatus('idle'); setCopied(false); }}>Edit your enquiry</button></div> : <><Eyebrow>Your next step</Eyebrow><h2>Tell Us About Your Enquiry</h2><p>A few details are enough to get started; additional product specifications can help us respond more precisely.</p>{form.product && <div className="selected-product"><Gem size={19}/><span>Enquiring about <strong>{form.product}</strong></span><button type="button" aria-label="Clear selected product" onClick={() => setForm(f => ({ ...f, product: '' }))}><X size={17}/></button></div>}
    {delivery !== true && <div className="email-mode-note"><Mail size={20}/><p>{delivery === null ? 'Checking enquiry options…' : 'Prepare your enquiry here, then send it through your email app. This form does not send or store your details.'}</p></div>}
    <form onSubmit={submit} noValidate aria-busy={status === 'sending'}><p className="required-note">Just four required fields <span aria-hidden="true">·</span> <span>* Required</span></p>{Object.values(errors).some(Boolean) && <p className="validation-summary" role="alert"><AlertCircle size={18}/>Please check the highlighted fields below.</p>}<div className="form-grid">{field('fullName', { required: true, autoComplete: 'name', placeholder: 'Your full name' })}{field('email', { required: true, type: 'email', autoComplete: 'email', placeholder: 'you@company.com' })}<div className="form-field field-wide"><label htmlFor="interest">I am interested in <span aria-hidden="true">*</span></label><select id="interest" name="interest" required value={form.interest} onChange={update} aria-invalid={errors.interest ? true : undefined} aria-describedby={errors.interest ? 'interest-error' : undefined}><option value="">Select an enquiry type</option>{categories.map(c => <option key={c}>{c}</option>)}</select>{errors.interest && <p className="field-error" id="interest-error">{errors.interest}</p>}</div>{field('message', { required: true, wide: true, multiline: true, placeholder: 'Tell us a little about what you need…' })}</div><details className="optional-fields"><summary>Additional details <span>Optional · Helps us respond faster</span></summary><div className="form-grid">{field('company', { autoComplete: 'organization' })}{field('country', { autoComplete: 'country-name' })}{field('phone', { type: 'tel', autoComplete: 'tel' })}{field('product')}{field('quantity', { placeholder: 'e.g. 25 kg or a sample parcel' })}{field('destination')}{field('specifications', { multiline: true, wide: true, rows: 3 })}</div></details><p className="form-consent">{delivery ? 'We use the information you provide to respond to your enquiry.' : 'Your details stay on this page until you choose to send them through your email provider.'} Please read our <Link to="/privacy" target="_blank" rel="noopener noreferrer" aria-label="Privacy Notice (opens in a new tab)">Privacy Notice</Link> for details about how your information is handled.</p>{error && <div className="submission-error"><p className="form-error" role="alert">{error}</p><button type="button" className="text-link" onClick={() => { setError(''); setStatus('draft'); }}>Prepare an email instead <ArrowRight size={17}/></button></div>}<Button type="submit" disabled={status === 'sending' || delivery === null}>{status === 'sending' ? 'Sending your enquiry…' : delivery === null ? 'Checking enquiry options…' : delivery ? 'Send Enquiry' : 'Prepare Email Enquiry'}</Button><p className="sr-only" role="status">{status === 'sending' ? 'Sending your enquiry. Please wait.' : ''}</p></form></>}</div></section><FAQ compact/></>;
}
