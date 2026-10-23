import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, MessageSquare, ClipboardList, Handshake } from 'lucide-react';
import { Eyebrow, Button, BotanicalArt, TrustStrip, FAQ, PartnershipCTA, MiniValues } from '../components/ui';
import { assets } from '../content/assets';

function Categories() {
  const cards = [
    { path: '/gemstones', title: 'Rough Gemstones', image: assets.hero, number: '01', type: 'gemstone-image', description: 'Explore rough gemstones, individual specimens, samples and parcels, with buyer-specific sourcing on request.', action: 'Explore Gemstones' },
    { path: '/botanicals', title: 'Botanicals & Superfoods', image: assets.botanicals, number: '02', description: 'Discover Zambian raw and minimally processed botanical materials for food, beverage, beauty and wellness applications.', action: 'Explore Botanicals' },
    { path: '/womens-wellness', title: 'Women’s Herbal Teas', image: assets.teaCollection, number: '03', description: 'Get an introduction to our developing women’s botanical tea collection, inspired by tradition and everyday self-care.', action: 'Discover the Collection' },
  ];
  return <section className="offer-section section-shell" id="our-products"><div className="section-heading"><div><Eyebrow>Distinctive by nature</Eyebrow><h2>What We Offer</h2></div><p>Zambian natural resources.<br/>Considered sourcing. Global possibilities.</p></div><div className="category-grid">
    {cards.map(card => <Link to={card.path} className="category-card" key={card.path}><div className={`category-image ${card.type || ''} ${!card.image ? 'wellness-art' : ''}`}>
      {card.image ? <img src={card.image.src} alt={card.image.alt} loading="lazy"/> : <><BotanicalArt flower/><div className="wellness-art-copy"><Sprout strokeWidth={1}/><span>Botanically inspired.<br/>Thoughtfully developed.</span></div></>}
      <span className="image-label">{card.number} / {card.path === '/womens-wellness' ? 'IN DEVELOPMENT' : 'ZAMBIAN RESOURCES'}</span></div><div className="category-copy"><h3>{card.title}</h3><p>{card.description}</p><span className="text-link">{card.action}<ArrowRight size={18}/></span></div></Link>)}
  </div></section>;
}

export default function Home() {
  return <>
    <section className="home-hero"><div className="hero-image" style={{ backgroundImage: `url(${assets.hero.src})` }}/><div className="hero-wash"/><BotanicalArt className="hero-botanical"/><div className="section-shell hero-inner"><div className="hero-copy"><Eyebrow>Zambia-based · Internationally connected</Eyebrow><h1><span>Rooted in Zambia.</span><span>Connected to the World.</span></h1><p className="hero-introduction">Rough gemstones and raw botanical ingredients sourced in Zambia, with buyer-specific sourcing and international partnership opportunities.</p><div className="hero-actions"><Button to="/contact#enquiry-form">Make an Enquiry</Button><a className="button button-secondary" href="#our-products">Explore Our Products <ArrowRight size={17}/></a></div><p className="hero-qualification">Availability and specifications confirmed on enquiry.</p></div></div><span className="hero-caption">Zambian origins. Extraordinary possibilities.</span></section>
    <div className="hero-trust"><div className="section-shell"><TrustStrip/></div></div>
    <Categories/>
    <section className="origins-section"><div className="origins-image"><img src={assets.zambia.src} alt={assets.zambia.alt} loading="lazy"/><div className="image-caption"><span>OUR HOME. OUR INSPIRATION.</span><span>Zambia, naturally.</span></div></div><div className="origins-copy"><BotanicalArt className="origins-leaf"/><Eyebrow>About B’s Botanicals</Eyebrow><h2>Zambian Origins.<br/>International Outlook.</h2><p>B’s Botanicals is a Zambian sourcing and trading company connecting international buyers, manufacturers and distributors with gemstones and botanical raw materials sourced in Zambia.</p><Button to="/about" secondary>Our Story</Button></div><MiniValues/></section>
    <section className="process-section section-shell"><div className="process-heading"><Eyebrow>A considered approach</Eyebrow><h2>Sourcing Starts With<br/>Your Requirements.</h2><p>We begin with what you need, then discuss what can be confirmed.</p><Link className="text-link" to="/about#sourcing-standards">What we discuss before a transaction <ArrowRight size={17}/></Link></div><div className="process-steps">{[
      [MessageSquare, 'Tell us what you need', 'Share the gemstone variety or botanical ingredient, preferred form, quantity and destination market.'],
      [ClipboardList, 'Explore availability', 'We review available stock or potential sourcing options for your requirements.'],
      [Handshake, 'Discuss next steps', 'We discuss product details, documentation needs and the practical steps towards a potential transaction.'],
    ].map(([Icon, title, text], i) => <div className="process-step" key={title}><div className="process-icon"><Icon strokeWidth={1.2}/><span>0{i + 1}</span></div><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="wellness-section"><BotanicalArt className="wellness-leaf" flower/><div className="section-shell wellness-inner"><div className="wellness-copy"><Eyebrow>A developing collection</Eyebrow><h2>A Women’s Wellness<br/>Collection in Development.</h2><p>Alongside our sourcing business, we are developing an elegant women’s herbal tea collection inspired by botanical traditions and everyday self-care. The collection is not yet commercially launched.</p><Button to="/womens-wellness" secondary>Explore the Collection</Button></div><div className="wellness-teaser-art">{assets.teaCollection ? <img src={assets.teaCollection.src} alt={assets.teaCollection.alt} loading="lazy"/> : <><Sprout strokeWidth={.7}/><p>Inspired by nature.<br/><em>Thoughtfully taking shape.</em></p><span className="status-pill">Five planned concepts · In development</span></>}</div></div></section>
    <FAQ/><PartnershipCTA/>
  </>;
}
