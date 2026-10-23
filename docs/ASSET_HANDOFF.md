# Replacing the illustrative artwork with original assets

The website currently has no independently supplied logo, product or approved packaging originals. Existing generated compositions and vector illustrations are retained without claiming they show actual stock. No founder portraits or supplier photographs have been invented.

## What to supply

| Asset | Recommended file | Placement |
| --- | --- | --- |
| Official logo | SVG, or high-resolution transparent PNG | Header and footer |
| Main hero photograph | Landscape, at least 1920px wide, with room for text at left | Homepage |
| Gemstone photographs | At least 1200px wide, consistently lit, stones fully visible | Individual sourcing cards |
| Botanical photographs | At least 1200px wide, showing the relevant raw material | Individual sourcing cards |
| Approved five-tea packaging image | High-resolution original, full packaging visible | Home teaser and Wellness page |
| Genuine company/sourcing photographs | Landscape originals with permission to publish | About/company story |

Supply the product name for each photograph and any required credit. Do not infer a gemstone’s species, provenance, testing or certification solely from appearance. Clear product names and factual captions help keep the site accurate.

## Implementation

1. Put optimized website copies in `public/images/`, retaining the original high-resolution files separately.
2. Edit `src/content/assets.js`. `logo` and `teaCollection` accept `{ src, alt }`; the hero, botanical and Zambia entries can be replaced similarly.
3. Add individual photos to `products`, using exact product names from `src/data.js`, for example:

```js
products: {
  Emerald: {
    src: '/images/emerald-original.webp',
    alt: 'Accurate description of the supplied photograph',
  },
}
```

4. Product cards automatically show the supplied photograph in place of their illustration. A supplied logo replaces the reconstructed identity in both header and footer. A supplied tea collection photograph appears in the home category, home teaser and Wellness page; the development qualifications remain visible.
5. Check image framing on phones, tablets and desktop before updating the GitHub screenshots. If the hero path changes, update the image preload in `index.html` too.

Public founder details and photographs still require confirmation before adding them. The site’s credibility improvements currently use the approved company story and practical sourcing information, without publishing pending personal details or unsupported badges.
