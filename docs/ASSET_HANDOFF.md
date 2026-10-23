# Replacing the illustrative artwork with original assets

The supplied floral logo and two garden packaging images from `images.zip` are installed. Their original files are preserved unchanged. The six gemstone and eight botanical cards now have individual generated still-life illustrations. A dedicated rough-gemstone composition appears on the Gemstones hero and homepage category card. These images carry visible illustration labels and do not establish inventory or botanical/mineral identity. The instructions below apply to future original gemstone, botanical and company photographs, or replacement brand assets.

## Additional or replacement assets

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
2. Edit `src/content/assets.js`. Entries accept `{ src, alt, width, height }`; use the actual intrinsic dimensions. The `gemstones` entry controls the dedicated Gemstones banner and homepage category image; `hero`, `botanicals` and `zambia` control the other sourcing compositions.
The single-box home category image is configured by `teaFeature`; the five-box home and Wellness image is configured by `teaCollection`.

3. Add individual photos to `products`, using exact product names from `src/data.js`, for example:

```js
products: {
  Emerald: {
    src: '/images/emerald-original.webp',
    alt: 'Accurate description of the supplied photograph',
    width: 1536,
    height: 1024,
    illustrative: false,
  },
}
```

4. Product cards automatically show the supplied photograph in place of their illustration. Set `illustrative: true` for generated or drawn artwork so its label remains visible; use `false` only for an appropriate original photograph. Keep the main subject comfortably inside the frame, since cards use a wide crop. A supplied logo replaces the reconstructed identity in both header and footer. The two supplied tea images remain in the home category, home teaser and Wellness page; the development qualifications remain visible.
5. Check image framing on phones, tablets and desktop before updating the GitHub screenshots. If the hero path changes, update the image preload in `index.html` too.

Public founder details and photographs still require confirmation before adding them. The site’s credibility improvements currently use the approved company story and practical sourcing information, without publishing pending personal details or unsupported badges.
