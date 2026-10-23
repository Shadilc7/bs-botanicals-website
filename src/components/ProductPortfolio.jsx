import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X, Leaf } from 'lucide-react';
import { gemstones, botanicals } from '../data';
import { assets } from '../content/assets';

const ingredientGroups = {
  Baobab: 'Fruits', Tamarind: 'Fruits',
  Moringa: 'Leaves & flowers', Hibiscus: 'Leaves & flowers', Lemongrass: 'Leaves & flowers',
  'Mongongo / Manketti': 'Seeds & kernels', Marula: 'Seeds & kernels', Ximenia: 'Seeds & kernels',
};

function ProductArt({ name, color, gemstone, index }) {
  const photo = assets.products[name];
  if (photo) return <div className="product-art product-photo"><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async"/>{photo.illustrative && <span className="art-caption">Illustration</span>}</div>;
  return <div className={`product-art ${gemstone ? 'crystal-art' : `plant-art plant-art-${index % 4}`}`} style={{ '--product-color': color || '#7a8b66' }}>
    {gemstone ? <svg viewBox="0 0 240 170" fill="none" aria-hidden="true">
      <ellipse cx="125" cy="143" rx="71" ry="10" fill="currentColor" opacity=".08"/>
      <path d="m68 129 10-77 38-29 43 17 20 65-26 35-58 8Z" fill="currentColor" opacity=".15"/>
      <path d="m78 52 38-29 43 17 20 65-26 35-58 8-27-19 10-77Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="m116 23-9 53 52-36-23 68 43-3-26 35-17-32-41 40 12-72-29-24m29 24 29 32M68 129l39-53" stroke="currentColor" strokeWidth="1" opacity=".6"/>
      <path d="m116 23-9 53 52-36Z" fill="currentColor" opacity=".16"/><path d="m136 108 17 32-58 8Z" fill="currentColor" opacity=".2"/>
      <path d="m173 135 8-33 19-9 14 17-5 29-20 8Z" fill="currentColor" opacity=".13" stroke="currentColor"/>
    </svg> : <svg viewBox="0 0 240 170" fill="none" aria-hidden="true">
      {index === 2 ? <g transform="translate(120 82)" fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeWidth="1.2">
        {[0,72,144,216,288].map(angle => <ellipse key={angle} cy="-23" rx="23" ry="39" transform={`rotate(${angle})`}/>)}
        <circle r="10" fill="#b18a58" stroke="none"/><path d="M0 0 20-37"/>
      </g> : index >= 5 ? <g fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.3">
        <ellipse cx="94" cy="93" rx="28" ry="39" transform="rotate(-28 94 93)"/><ellipse cx="147" cy="81" rx="25" ry="35" transform="rotate(31 147 81)"/><ellipse cx="139" cy="123" rx="27" ry="20"/>
        <path d="M77 67c18 16 26 38 32 59m52-70c-15 14-22 32-23 52m-18 16 37-4" opacity=".6"/>
      </g> : <g stroke="currentColor" strokeWidth="1.3">
        <path d="M112 148c7-45 13-80 27-124M120 112C82 109 64 86 62 60c37 2 64 21 58 52Zm11-37c2-28 27-47 51-49-3 28-24 48-51 49ZM113 142c28-1 52-18 61-41-31-2-59 14-61 41Z"/>
        <path d="M120 112C82 109 64 86 62 60c37 2 64 21 58 52Zm11-37c2-28 27-47 51-49-3 28-24 48-51 49Z" fill="currentColor" opacity=".12"/>
      </g>}
    </svg>}
    <span className="art-caption">Illustration</span>
  </div>;
}

export default function ProductPortfolio({ kind }) {
  const gemstone = kind === 'gemstones';
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All ingredients');
  const products = gemstone ? gemstones : botanicals.map(([name, type, description], index) => ({ name, type, description, group: ingredientGroups[name], index }));
  const normalized = query.trim().toLocaleLowerCase();
  const matches = products.filter(product => (!normalized || `${product.name} ${product.description} ${product.type || ''}`.toLocaleLowerCase().includes(normalized)) && (gemstone || group === 'All ingredients' || product.group === group));
  function reset() { setQuery(''); setGroup('All ingredients'); }
  return <div className="portfolio-browser">
    <div className="portfolio-toolbar"><div className="product-search"><Search size={19} aria-hidden="true"/><label className="sr-only" htmlFor={`${kind}-search`}>Search {gemstone ? 'gemstones' : 'ingredients'}</label><input id={`${kind}-search`} type="search" placeholder={gemstone ? 'Find a gemstone variety…' : 'Find an ingredient…'} value={query} onChange={e => setQuery(e.target.value)}/>{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={17}/></button>}</div><p className="results-count" role="status">{matches.length} {gemstone ? matches.length === 1 ? 'variety' : 'varieties' : matches.length === 1 ? 'ingredient' : 'ingredients'} to explore</p></div>
    {!gemstone && <div className="portfolio-filters" role="group" aria-label="Ingredient groups">{['All ingredients', 'Leaves & flowers', 'Fruits', 'Seeds & kernels'].map(value => <button type="button" aria-pressed={group === value} onClick={() => setGroup(value)} key={value}>{value}</button>)}</div>}
    <p className="portfolio-availability"><span/>Sourcing interests · Availability and specifications confirmed on enquiry</p>
    <div className={`product-grid ${gemstone ? 'gem-grid' : 'ingredient-grid'}`}>{matches.map((product, i) => <article className="product-card" key={product.name}>
      <ProductArt name={product.name} color={product.color} gemstone={gemstone} index={product.index ?? i}/>
      <div className="product-card-copy"><span className="ingredient-type">{gemstone ? 'ROUGH GEMSTONES' : product.type}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-form"><Leaf size={15} aria-hidden="true"/>{gemstone ? 'Specimens, samples & parcels' : product.group === 'Seeds & kernels' ? 'Raw materials for further processing' : 'Available forms discussed on enquiry'}</div><Link className="text-link product-enquiry" to={`/contact?category=${kind}&product=${encodeURIComponent(product.name)}#enquiry-form`}>Enquire about {product.name.split(' / ')[0]}<ArrowRight size={17}/></Link></div>
    </article>)}</div>
    {!matches.length && <div className="empty-results"><Search strokeWidth={1}/><h3>No matching {gemstone ? 'varieties' : 'ingredients'}</h3><p>Try a different search, or ask us about your sourcing requirements.</p><button className="button button-secondary" type="button" onClick={reset}>Clear filters</button><Link className="text-link" to={`/contact?category=${kind}#enquiry-form`}>Ask about another {gemstone ? 'gemstone' : 'ingredient'} <ArrowRight size={16}/></Link></div>}
  </div>;
}
