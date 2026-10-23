import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { navigation, seo } from './data';
import { Logo, Button, BotanicalArt } from './components/ui';
import Home from './pages/Home';
import { About, Gemstones, Botanicals, Wellness, Privacy, NotFound } from './pages/Pages';
import Contact from './pages/Contact';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 1240px)').matches);
  const location = useLocation();
  const toggle = useRef(null);
  const nav = useRef(null);
  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1240px)');
    const updateLayout = () => { setCompact(media.matches); if (!media.matches) setMenuOpen(false); };
    media.addEventListener('change', updateLayout);
    return () => media.removeEventListener('change', updateLayout);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';
    const background = [...document.querySelectorAll('#main-content, .site-footer')].map(element => [element, element.inert]);
    background.forEach(([element]) => { element.inert = true; });
    nav.current?.querySelector('a')?.focus({ preventScroll: true });
    const keydown = e => {
      if (e.key === 'Escape') { e.preventDefault(); setMenuOpen(false); toggle.current?.focus({ preventScroll: true }); }
      if (e.key === 'Tab') {
        const stops = [...nav.current.querySelectorAll('a, button:not([disabled])'), toggle.current];
        const index = stops.indexOf(document.activeElement);
        const next = (index + (e.shiftKey ? -1 : 1) + stops.length) % stops.length;
        e.preventDefault(); stops[next].focus({ preventScroll: false });
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      background.forEach(([element, inert]) => { element.inert = inert; });
      document.removeEventListener('keydown', keydown);
    };
  }, [menuOpen]);
  const dismissMenu = () => { setMenuOpen(false); toggle.current?.focus({ preventScroll: true }); };
  return <><header className={`site-header ${menuOpen ? 'menu-is-open' : ''}`}><div className="header-inner">
    <Logo/>
    <nav ref={nav} aria-label="Main navigation" aria-hidden={compact && !menuOpen ? true : undefined} inert={compact && !menuOpen} className={menuOpen ? 'main-nav is-open' : 'main-nav'} id="main-navigation">
      <div className="menu-intro"><span>ROOTED IN ZAMBIA</span><p>A world of possibilities.</p></div>
      <div className="nav-links">{navigation.map(([path, title], index) => <NavLink to={path} end={path === '/'} key={path} style={{ '--nav-index': index }} onClick={() => setMenuOpen(false)}><span>{title}</span><ArrowUpRight className="menu-link-arrow" size={18} aria-hidden="true"/></NavLink>)}</div>
      <div className="menu-footer"><BotanicalArt className="menu-botanical"/><Link className="button button-primary menu-enquiry" to="/contact#enquiry-form" onClick={() => setMenuOpen(false)}>Make an Enquiry<ArrowRight size={17} aria-hidden="true"/></Link><a className="menu-email" href="mailto:info@bs-botanicals.com"><Mail size={15} aria-hidden="true"/>info@bs-botanicals.com</a><span>Zambian origins. International outlook.</span></div>
    </nav>
    <Button to="/contact#enquiry-form" className="header-cta">Make an Enquiry</Button>
    <button ref={toggle} type="button" className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}><span className="menu-icon" aria-hidden="true"><span/><span/><span/></span></button>
  </div></header><button type="button" className={`menu-scrim ${menuOpen ? 'is-open' : ''}`} tabIndex={-1} aria-label="Dismiss navigation" aria-hidden={!menuOpen} disabled={!menuOpen} onClick={dismissMenu}/></>;
}

function Footer() {
  return <footer className="site-footer"><BotanicalArt className="footer-leaf"/><div className="section-shell footer-top"><Logo/>
    <p>Distinctive Zambian resources.<br/>Meaningful global connections.</p><a href="mailto:info@bs-botanicals.com" className="footer-email">Let’s start a conversation <ArrowUpRight size={18}/><span>info@bs-botanicals.com</span></a>
  </div><div className="section-shell footer-links"><nav aria-label="Footer navigation">{navigation.map(([path, title]) => <Link to={path} key={path}>{title}</Link>)}</nav><span><MapPin size={16}/> Zambia-based. Internationally connected.</span></div>
  <div className="footer-bottom"><div className="section-shell"><p>© {new Date().getFullYear()} B’s Botanicals. A brand of B’s Botanicals & Naturals Limited.</p><Link to="/privacy">Privacy Notice</Link><a href="mailto:info@bs-botanicals.com" aria-label="Email B’s Botanicals"><Mail size={19}/></a></div></div></footer>;
}

export default function App() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const [title, description] = seo[pathname] || ['Page Not Found | B’s Botanicals', 'Return to B’s Botanicals to explore Zambian gemstones and botanicals.'];
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', description);
    if (previousPath.current !== pathname) document.getElementById('main-content')?.focus({ preventScroll: true });
    previousPath.current = pathname;
    const frame = requestAnimationFrame(() => {
      if (hash) {
        let id; try { id = decodeURIComponent(hash.slice(1)); } catch { id = ''; }
        const target = document.getElementById(id);
        if (target) { target.scrollIntoView({ behavior: 'instant' }); return; }
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content" tabIndex={-1}><Routes>
    <Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/gemstones" element={<Gemstones/>}/><Route path="/botanicals" element={<Botanicals/>}/><Route path="/womens-wellness" element={<Wellness/>}/><Route path="/contact" element={<Contact/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="*" element={<NotFound/>}/>
  </Routes></main><Footer/></>;
}
