import { useEffect, useState } from 'react';
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
  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = e => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menuOpen]);
  return <header className="site-header"><div className="header-inner">
    <Logo/>
    <nav aria-label="Main navigation" className={menuOpen ? 'main-nav is-open' : 'main-nav'} id="main-navigation">{navigation.map(([path, title]) => <NavLink to={path} end={path === '/'} key={path}>{title}</NavLink>)}</nav>
    <Button to="/contact" className="header-cta">Make an Enquiry</Button>
    <button className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
  </div></header>;
}

function Footer() {
  return <footer className="site-footer"><BotanicalArt className="footer-leaf"/><div className="section-shell footer-top"><Logo/>
    <p>Distinctive Zambian resources.<br/>Meaningful global connections.</p><a href="mailto:info@bs-botanicals.com" className="footer-email">Let’s start a conversation <ArrowUpRight size={18}/><span>info@bs-botanicals.com</span></a>
  </div><div className="section-shell footer-links"><nav aria-label="Footer navigation">{navigation.map(([path, title]) => <Link to={path} key={path}>{title}</Link>)}</nav><span><MapPin size={14}/> Zambia-based. Internationally connected.</span></div>
  <div className="footer-bottom"><div className="section-shell"><p>© {new Date().getFullYear()} B’s Botanicals. A brand of B’s Botanicals & Naturals Limited.</p><Link to="/privacy">Privacy Notice</Link><a href="mailto:info@bs-botanicals.com" aria-label="Email B’s Botanicals"><Mail size={15}/></a></div></div></footer>;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, description] = seo[pathname] || ['Page Not Found | B’s Botanicals', 'Return to B’s Botanicals to explore Zambian gemstones and botanicals.'];
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', description);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content" tabIndex={-1}><Routes>
    <Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/gemstones" element={<Gemstones/>}/><Route path="/botanicals" element={<Botanicals/>}/><Route path="/womens-wellness" element={<Wellness/>}/><Route path="/contact" element={<Contact/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="*" element={<NotFound/>}/>
  </Routes></main><Footer/></>;
}
