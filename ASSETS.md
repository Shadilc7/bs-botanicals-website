# Asset provenance

The gemstone, botanical and Zambia landscape images were generated for this project on 23 October 2026 using the supplied website references as visual direction. They are **illustrative artwork**, not evidence of real inventory, gemstone identity, provenance, supplier facilities or packaging.

| Website file | Source generated file | Purpose |
| --- | --- | --- |
| `public/images/hero.webp` | `exec-fb65aafb-c6f0-43dc-acb3-af5ab6442631.png` | Rough-crystal and botanical still life with an illustrative Zambian landscape |
| `public/images/botanicals.webp` | `exec-a1da79e4-bf41-47ce-8f08-a4d1a1f8f00a.png` | Illustrative raw ingredient still life |
| `public/images/zambia.webp` | `exec-ce9af4d2-b120-49b6-a8ce-38de7cb06eb6.png` | Illustrative Victoria Falls landscape |

Original generated PNGs remain in `/workspace/generated_images`; website versions are WebP encodings for bandwidth efficiency. They do not reproduce the inaccessible assets from the linked ChatGPT threads exactly.

The SVG botanical line art and monogram favicon are custom code. The supplied floral logo now replaces the reconstructed identity in the header and footer. The five wellness panels remain decorative illustrations of the revised planned concepts; supplied garden packaging artwork is shown separately without changing those concept names.

Cormorant Garamond and DM Sans are bundled from Fontsource, with their licences retained in the corresponding npm packages. Lucide icons are provided by `lucide-react` under the ISC licence. Dependencies and their versions are recorded in `package-lock.json`.

The UI refresh adds clearly labelled vector illustrations for product browsing. These are decorative representations, not supplier photographs. Approved replacements are configured in `src/content/assets.js`; see `docs/ASSET_HANDOFF.md`.

## User-supplied assets from images.zip

| Website file | Placement |
| --- | --- |
| `public/images/logo-bs-botanicals-zambia.png` | Header and footer |
| `public/images/tea-box-monogram-garden.webp` | Home women’s herbal tea category card |
| `public/images/tea-boxes-garden-lineup.webp` | Home wellness feature and Wellness collection figure |

All three are byte-for-byte copies of the supplied archive files. The logo's generous transparent canvas is framed through CSS only, without redrawing or changing the original image. The supplied WebP versions are reused without additional lossy conversion. PNG duplicates and macOS metadata are not included in the website payload.

The garden images were selected for their consistent visual style and compatibility with the revised developing-collection wording. The alternate individual boxes and studio lineup contain different names and printed benefit or sourcing statements; they have not replaced the revised concept names or been added as product listings. All source variants remain in the original uploaded archive.
