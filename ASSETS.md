# Asset provenance

The gemstone, botanical and Zambia landscape images were generated for this project on 23 October 2026 using the supplied website references as visual direction. They are **illustrative artwork**, not evidence of real inventory, gemstone identity, provenance, supplier facilities or packaging.

| Website file | Source generated file | Purpose |
| --- | --- | --- |
| `public/images/hero.webp` | `exec-fb65aafb-c6f0-43dc-acb3-af5ab6442631.png` | Rough-crystal and botanical still life with an illustrative Zambian landscape |
| `public/images/botanicals.webp` | `exec-a1da79e4-bf41-47ce-8f08-a4d1a1f8f00a.png` | Illustrative raw ingredient still life |
| `public/images/zambia.webp` | `exec-ce9af4d2-b120-49b6-a8ce-38de7cb06eb6.png` | Illustrative Victoria Falls landscape |

Original generated PNGs remain in `/workspace/generated_images`; website versions are WebP encodings for bandwidth efficiency. They do not reproduce the inaccessible assets from the linked ChatGPT threads exactly.

The SVG botanical line art and monogram favicon are custom code. The supplied floral logo now replaces the reconstructed identity in the header and footer. The wellness gallery uses the five supplied individual packaging images with their original printed text. The earlier vector concept panels and unlabelled garden packaging images have been replaced at the owner’s request.

Cormorant Garamond and DM Sans are bundled from Fontsource, with their licences retained in the corresponding npm packages. Lucide icons are provided by `lucide-react` under the ISC licence. Dependencies and their versions are recorded in `package-lock.json`.

Product browsing uses individual generated still-life illustrations, with the custom vector artwork retained as a fallback for future entries without an assigned image. These are decorative representations, not supplier photographs. Approved replacements are configured in `src/content/assets.js`; see `docs/ASSET_HANDOFF.md`.

## Individual sourcing illustrations

Fifteen additional images were generated on 23 October 2026: six rough gemstone studies, eight raw botanical studies and one dedicated rough-gemstone banner. The shared visual treatment uses warm ivory limestone, diffuse daylight and restrained colour. Optimized WebP files retain the generated 1536 × 1024 resolution. Product images load lazily and reserve their display space to avoid layout shifts.

These are generated illustrative compositions, with visible labels on the product cards, Gemstones hero and Home gemstone category. They do not identify actual specimens, establish botanical morphology, represent stock or prove source. In particular, the seed and kernel studies are artistic representations, not identification guides. Original supplier photographs can replace them through the asset registry. The supplied logo and installed tea packaging files retain their original file contents.

| Website file | Source generated file | Placement |
| --- | --- | --- |
| `public/images/emerald.webp` | `exec-43b35e38-5e96-4b6c-a979-ae2af183d76b.png` | Individual sourcing card |
| `public/images/aquamarine.webp` | `exec-606eaaa4-872d-478c-a959-235e1e4adfa9.png` | Individual sourcing card |
| `public/images/tourmaline.webp` | `exec-558acbc7-9d05-4404-b628-02c059820038.png` | Individual sourcing card |
| `public/images/garnet.webp` | `exec-76768d38-45de-4707-9a32-32bb8464fdae.png` | Individual sourcing card |
| `public/images/amethyst.webp` | `exec-b908eec8-5b68-4152-86d6-cee8413c2acb.png` | Individual sourcing card |
| `public/images/citrine.webp` | `exec-bbf7c9be-a408-45fb-8f0a-6bad5457accf.png` | Individual sourcing card |
| `public/images/baobab.webp` | `exec-852d089f-217e-4821-97b3-c17b30f08dc9.png` | Individual sourcing card |
| `public/images/moringa.webp` | `exec-95a18f3c-9215-44f1-9235-867fcd1953a9.png` | Individual sourcing card |
| `public/images/hibiscus.webp` | `exec-f2687477-be1f-48c3-a0fc-ab09488acd5f.png` | Individual sourcing card |
| `public/images/lemongrass.webp` | `exec-0a441c64-62a7-48b0-8b10-5bf443c7b10c.png` | Individual sourcing card |
| `public/images/tamarind.webp` | `exec-b3d05442-9a9d-4073-bf7b-eb9c581062e2.png` | Individual sourcing card |
| `public/images/mongongo.webp` | `exec-0aca3279-d321-469a-8213-12b55e79cb61.png` | Individual sourcing card |
| `public/images/marula.webp` | `exec-6d25e870-64a7-4123-9339-4aff5690f612.png` | Individual sourcing card |
| `public/images/ximenia.webp` | `exec-df2d24ac-e0ff-470d-b945-baef01b8890a.png` | Individual sourcing card |
| `public/images/rough-gemstones.webp` | `exec-16c6a7f9-5322-4fc7-8309-dc83626c250e.png` | Gemstones hero and Home gemstone category |

## User-supplied assets from images.zip

| Website file | Placement |
| --- | --- |
| `public/images/logo-bs-botanicals-zambia.png` | Header and footer |
| `public/images/tea-box-fertility-wellness.webp` | Home tea category and Wellness gallery |
| `public/images/tea-box-weight-loss-detox.webp` | Wellness gallery |
| `public/images/tea-box-sexual-health-wellness.webp` | Wellness gallery |
| `public/images/tea-box-menopause-support.webp` | Wellness gallery |
| `public/images/tea-box-hormonal-balance.webp` | Wellness gallery |
| `public/images/tea-boxes-studio-lineup.webp` | Home wellness feature |

All seven files are byte-for-byte copies of the supplied archive files. The original printed artwork and transparency are preserved, with no redrawing or additional lossy conversion. The individual boxes display fully using `object-fit: contain` and link to their original website image for reading the printed labels. The gallery captions match the names printed on these images rather than the earlier placeholder concepts.

The previously selected unlabelled garden packaging files are no longer used or shipped. All variants remain in the original uploaded archive. The logo’s transparent canvas is framed through CSS only. The collection remains in development, with the existing pre-launch qualifications retained around the supplied artwork.
