import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { navigation, seo } from './data';
import { Logo, Button, BotanicalArt } from './components/ui';
import Home from './pages/Home';
import { About, Gemstones, Botanicals, Wellness, Privacy, NotFound } from './pages/Pages';
import Contact from './pages/Contact';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef(null);
  const nav = useRef(null);
  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1241px)');
    const closeOnDesktop = () => { if (media.matches) setMenuOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nav.current?.querySelector('a')?.focus();
    const keydown = e => {
      if (e.key === 'Escape') { e.preventDefault(); setMenuOpen(false); toggle.current?.focus(); }
      if (e.key === 'Tab') {
        const links = [...nav.current.querySelectorAll('a')];
        const first = links[0], last = toggle.current;
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keydown); };
  }, [menuOpen]);
  return <header className="site-header"><div className="header-inner">
    <Logo/>
    <nav ref={nav} aria-label="Main navigation" className={menuOpen ? 'main-nav is-open' : 'main-nav'} id="main-navigation">{navigation.map(([path, title]) => <NavLink to={path} end={path === '/'} key={path}>{title}</NavLink>)}</nav>
    <Button to="/contact#enquiry-form" className="header-cta">Make an Enquiry</Button>
    <button ref={toggle} type="button" className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
  </div>{menuOpen && <button type="button" className="menu-scrim" tabIndex={-1} aria-label="Dismiss navigation" onClick={() => { setMenuOpen(false); toggle.current?.focus(); }}/>}</header>;
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
