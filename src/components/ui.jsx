import { ArrowRight, Globe2, Leaf, Handshake, Gem, Mail, MapPin, Plus, Minus, Sprout, Flower2, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { concepts, faqs, navigation } from '../data';
import { assets } from '../content/assets';

export function Button({ to, children, secondary = false, className = '', ...props }) {
  const classes = `button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`;
  return to ? <Link to={to} className={classes} {...props}>{children}<ArrowRight size={16} strokeWidth={1.4} /></Link>
    : <button className={classes} {...props}>{children}<ArrowRight size={16} strokeWidth={1.4} /></button>;
}

export function Eyebrow({ children, light = false }) { return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</p>; }

export function BotanicalArt({ className = '', flower = false }) {
  return <svg className={`botanical-art ${className}`} viewBox="0 0 220 360" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1">
      <path d="M63 355C90 267 93 171 146 41M87 276C64 238 44 212 12 202M100 219c38-10 68-34 96-67M114 164C87 142 63 104 62 57M132 93c38-13 52-35 68-70" />
      <path d="M87 278C45 273 24 240 12 202c40 8 77 27 75 76ZM100 219c3-37 47-62 96-67-25 43-58 64-96 67ZM113 166C74 151 60 103 62 57c29 28 57 57 51 109ZM131 94c2-31 34-61 69-71-12 36-33 61-69 71ZM146 42c-18-17-16-33-5-41 10 14 12 28 5 41Z" />
      <path d="m18 210 57 56m-7-188 39 75m82 5-76 56m79-181-55 54M78 319C115 296 150 293 195 310c-40 27-84 35-117 9Z" />
    </g>
    {flower && <g transform="translate(85 190)" fill="currentColor" opacity=".18"><ellipse rx="30" ry="55" transform="rotate(-16)"/><ellipse rx="30" ry="55" transform="rotate(56)"/><ellipse rx="30" ry="55" transform="rotate(128)"/><ellipse rx="30" ry="55" transform="rotate(200)"/><ellipse rx="30" ry="55" transform="rotate(272)"/><circle r="10" fill="#ad895b"/></g>}
  </svg>;
}

export function Logo({ light = false }) {
  if (assets.logo) return <Link to="/" className="brand brand-official" aria-label="B’s Botanicals home"><img src={assets.logo.src} alt={assets.logo.alt} width={assets.logo.width} height={assets.logo.height} decoding="async"/></Link>;
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="B’s Botanicals home">
    <span className="brand-mark" aria-hidden="true"><span>B</span><svg viewBox="0 0 60 60"><g fill="currentColor"><ellipse cx="29" cy="17" rx="7" ry="13" transform="rotate(-18 29 28)"/><ellipse cx="29" cy="17" rx="7" ry="13" transform="rotate(54 29 28)"/><ellipse cx="29" cy="17" rx="7" ry="13" transform="rotate(126 29 28)"/><ellipse cx="29" cy="17" rx="7" ry="13" transform="rotate(198 29 28)"/><ellipse cx="29" cy="17" rx="7" ry="13" transform="rotate(270 29 28)"/></g><circle cx="29" cy="28" r="4" fill="#b28d5f"/></svg><i>’s</i></span>
    <span className="brand-type"><strong>B’S BOTANICALS</strong><span>Rooted in Zambia. Connected to the World.</span></span>
  </Link>;
}

export function TrustStrip() {
  return <div className="trust-strip">
    <div><Globe2/><span><strong>Zambia-based</strong><small>Internationally connected</small></span></div>
    <div><Leaf/><span><strong>Natural resources</strong><small>Buyer-led sourcing</small></span></div>
    <div><Handshake/><span><strong>Real partnerships</strong><small>A long-term outlook</small></span></div>
  </div>;
}

export function FAQ({ compact = false }) {
  const [open, setOpen] = useState(null);
  return <section className={`faq-section section-shell ${compact ? 'faq-compact' : ''}`}>
    <BotanicalArt className="faq-leaf" />
    <div className="faq-intro"><Eyebrow>A few things to know</Eyebrow><h2>Common Questions<br/>from Our Partners.</h2><p>A little clarity before<br/>our first conversation.</p></div>
    <div className="faq-list">{faqs.map(([question, answer], i) => <div className={`faq-item ${open === i ? 'is-open' : ''}`} key={question}>
      <h3><button type="button" aria-expanded={open === i} aria-controls={`faq-answer-${i}`} onClick={() => setOpen(open === i ? null : i)}><span className="faq-toggle">{open === i ? <Minus size={16}/> : <Plus size={16}/>}</span>{question}</button></h3>
      <div id={`faq-answer-${i}`} hidden={open !== i}><p>{answer}</p></div>
    </div>)}</div>
    <div className="faq-quote"><Sprout size={35} strokeWidth={.8}/><p>Different resources.<br/>Shared opportunities.<br/>A more natural tomorrow.</p><span>✦</span></div>
  </section>;
}

export function CollectionCards({ large = false }) {
  return <div className={`concept-grid ${large ? 'concept-grid-large' : ''}`}>{concepts.map(({ name, color, motif }, i) => {
    const Icon = motif === 'leaf' ? Sprout : motif === 'sun' ? Sun : Flower2;
    return <article className="concept-card" style={{ '--concept-color': color }} key={name}>
      <div className="concept-art" aria-hidden="true"><span className="concept-number">0{i + 1}</span><Icon strokeWidth={.6}/><span className="concept-watermark">B</span></div>
      <h3>{name}</h3><span className="development-tag">In development</span>
    </article>;
  })}</div>;
}

export function ContactDetails() {
  return <div className="contact-details">
    <a href="mailto:info@bs-botanicals.com"><span><Mail/></span><div><small>Email us</small>info@bs-botanicals.com</div></a>
    <a href="https://www.bs-botanicals.com"><span><Globe2/></span><div><small>Find us online</small>www.bs-botanicals.com</div></a>
    <div><span><MapPin/></span><div><small>Our roots</small>Zambia-based<br/><span className="muted-detail">Internationally connected</span></div></div>
  </div>;
}

export function PartnershipCTA({ title = 'Let’s Build Something Meaningful Together', text = 'Zambian natural resources. International markets. Long-term partnerships.' }) {
  return <section className="partnership-cta" style={{ backgroundImage: `url(${assets.zambia.src})` }}><div className="partnership-shade"/><div className="section-shell partnership-inner"><div><Eyebrow>Rooted in possibility</Eyebrow><h2>{title}</h2><p>{text}</p></div><Button to="/contact?category=partnership">Make an Enquiry</Button></div></section>;
}

export function PageHero({ eyebrow, title, children, image = 'hero', category, imagePosition }) {
  const { pathname } = useLocation();
  const label = navigation.find(([path]) => path === pathname)?.[1];
  return <section className={`page-hero page-hero-${image}`}><div className="page-hero-image" style={{ backgroundImage: `url(${assets[image].src})`, backgroundPosition: imagePosition }}/><BotanicalArt className="page-hero-leaf"/><div className="section-shell"><div className="page-hero-copy"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{children}<Button to={`/contact${category ? `?category=${category}` : ''}#enquiry-form`}>Make an Enquiry</Button></div></div></section>;
}

export function BulletList({ items }) { return <ul className="bullet-list">{items.map(text => <li key={text}><span>✓</span>{text}</li>)}</ul>; }

export function MiniValues() {
  return <div className="mini-values">{[[Gem, 'Zambian resources'], [Leaf, 'Buyer-led sourcing'], [Handshake, 'Trusted partnerships'], [Globe2, 'International markets']].map(([Icon, text]) => <div key={text}><Icon strokeWidth={1}/><span>{text}</span></div>)}</div>;
}
