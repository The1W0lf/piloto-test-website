# Pollito Chicken (Salé) — Website Design Spec

Date: 2026-08-04
Status: Approved by user, ready for implementation planning

## Purpose

A single-page marketing/menu website for Pollito Chicken, a fried chicken fast-food
restaurant in Salé, Morocco. Replaces the current image-only site (pollito.ma) with a
real, accessible, mobile-first site built from the restaurant's own branding and menu.
Ordering is click-to-call only — no cart, no backend.

## Brand Facts (source of truth)

- Name: **Pollito Chicken**
- Location: Salé 11000, Morocco (Plus Code `358X+76 Salé`)
  - Google Maps coords: `34.0656571, -6.8019299`
  - Maps listing: https://www.google.com/maps/place/Pollito+Chicken/@34.0656571,-6.8045048,17z/data=!3m1!4b1!4m6!3m5!1s0xda7692af291495f:0xc22f956e4c6daf16!8m2!3d34.0656571!4d-6.8019299
- Phone: `05 38 10 70 53` (landline — voice calls only, no WhatsApp)
- Instagram: `@pollito_chicken_sale`
- Hours: every day, 12:00 – 01:00
- Language: French only
- Ordering: click-to-call (`tel:+212538107053`) only — explicitly no Glovo link, no cart/checkout

## Assets Inventory

Local (`media/`):
- `logo.jpg` — square logo, red gradient bg, white rooster mascot mark, hand-lettered "POLLITO CHICKEN" wordmark
- `nos boka.png` — Bokka (sub sandwiches) flyer, hero shot: Bokka Spicy
- `nos burgers.png` — Burgers flyer, hero shot: El Capo Spicy
- `nos crunshy.png` — Crunchy (fried sides) flyer, hero shot: Crunchy Box
- `nos tacos.png` — Tacos flyer, hero shot: Tacos Boursin

Pulled from current site (pollito.ma) during brainstorming, to be saved into `media/`:
- `plat.jpeg` — Plats (5th category) flyer, hero shot: King Strips combo
- `socials.jpeg` — reference only (QR codes, review banner) — not used directly on new site, but confirms phone + Instagram handle

These flyer images are **reference/source material only**. The live site does not embed
them as-is (baked-in text fails accessibility/responsiveness); instead each category's
hero photo is cropped from these flyers and paired with real HTML text for name/description/price.

## Full Menu (transcribed, DH = Moroccan Dirham)

### Nos Bokka
| Item | Description | Price |
|---|---|---|
| Bokka Spicy (hero) | Pain spicy, strips, dinde fumée, cheddar, laitue, sauce algérienne | 39 DH |
| Pizza | Pain méga en thym, strips, pepperoni, cheddar, mozzarella, olives noires, ketchup & mayo | 39 DH |
| Original | Pain original, strips, dinde fumée, laitue, fromage, mayo & ketchup | 39 DH |
| Jalapiño | Strips, dinde fumée, cheddar, sauce samouraï | 39 DH |
| Chilli | Pain spicy, strips, dinde fumée, cheddar, laitue, sauce chilli thaï | 39 DH |
| Mini Bokka | Pain original, strips, dinde fumée, cheddar, mayo & ketchup | 33 DH |
| Swiss | Pain original, strips, dinde fumée, cheddar, sautée champignons, creamy fromager swiss | 50 DH |

### Nos Burgers
| Item | Description | Price |
|---|---|---|
| El Capo Spicy (hero) | Double steak, cheddar, sauce algérienne | 42 DH |
| El Pollo | 2 strips crispy, cheddar, sauce biggy | 28 DH |
| Suprimo | Double steak, cheddar, sauce biggy | 28 DH |
| El Classico | 4 strips crispy, cheddar, sauce biggy | 42 DH |
| El Capo | Steak, cheddar, sauce biggy | 42 DH |
| Jalapiño | Double steak, jalapeños, spicy special | 45 DH |
| Swiss | Double steak, sautée champignons, creamy fromager swiss | 50 DH |

### Nos Crunchy
| Item | Description | Price |
|---|---|---|
| Crunchy Box (hero) | Mixed fried box | 45 DH |
| Chili Cheese | — | 25 DH |
| Mozzastick | — | 25 DH |
| Onion Ring | — | 15 DH |
| Nugget | — | 15 DH |
| Potatos Crispe | — | 15 DH |

### Nos Tacos
| Item | Description | Price |
|---|---|---|
| Tacos Boursin (hero) | Steak poulet, cheddar, sauce biggy, fromage Boursin | 42 DH |
| Viande Hachée | Viande hachée, cheddar, sauce au choix | 40 DH |
| Poulet | Steak poulet, cheddar, sauce au choix | 37 DH |
| Tacos Crispé | Strips crispy, cheddar, sauce biggy | 38 DH |
| Cordon Bleu | Cordon bleu, cheddar, sauce au choix | 38 DH |
| Jalapiño | Viande hachée et poulet, jalapeños, spicy algérien | 45 DH |
| Swiss | Steak poulet, sautée champignons, creamy fromager swiss | 50 DH |

### Plats
| Item | Description | Price | Badge |
|---|---|---|---|
| Tenders x5 | — | 35 DH | |
| Chicken Box | — | 45 DH | |
| King Strips (hero) | Combo: strips, burger, frites, boisson | 49 DH | |
| Mac & Cheese | — | 35 DH | Quantité limitée |
| Kabsa | — | 29 DH | Quantité limitée |
| Tiramisu | Dessert | 20 DH | |

## Site Structure (single page, anchored sections)

1. **Header** — logo, sticky nav (Menu / Notre Histoire / Galerie / Offres / Nous Trouver), persistent "Appeler pour commander" button linking to `tel:+212538107053`. Collapses to hamburger + logo on mobile.
2. **Hero** — full-bleed red-gradient section, mascot/food imagery, tagline, primary CTA "Commander Maintenant" (click-to-call), secondary CTA "Voir le Menu" (scrolls to #menu)
3. **Trust strip** — 3–4 short icon+label items: "Ouvert jusqu'à 1h", "Fait minute", "4.3★ sur Google", "Salé"
4. **Menu** (`#menu`) — category tab bar (Bokka / Burgers / Tacos / Crunchy / Plats), one active category shown at a time. Each category: one large hero photo (cropped from source flyer) + grid of item cards (name, description, price, optional badge)
5. **Notre Histoire** (`#histoire`) — short brand story paragraph + mascot/logo graphic
6. **Galerie** (`#galerie`) — photo grid using food photography from assets, Instagram callout linking to `@pollito_chicken_sale`
7. **Offres** (`#offres`) — 2–3 highlighted deal cards (e.g. Crunchy Box, King Strips, Bokka Spicy)
8. **Nous Trouver** (`#contact`) — embedded Google Maps iframe centered on the coords above, address text, hours, call button
9. **Footer** — logo, section links, phone, Instagram, hours, address, copyright line

## Visual System

- Colors (CSS custom properties):
  - `--color-primary: #E31E24` (brand red, sampled from logo)
  - `--color-primary-dark: #A81419` (gradients, hover states)
  - `--color-cream: #FFF8F0` (page background, matches flyer paper texture)
  - `--color-ink: #1A1A1A` (body text)
  - `--color-gold: #F5A623` (secondary accent — badges, highlights)
  - `--color-white: #FFFFFF`
- Typography:
  - Headings: **Fredoka** (rounded, playful, closest web font to the hand-lettered logo wordmark)
  - Body: **Nunito** (clean, good French accent support)
  - Google Fonts import, base size 16px, line-height 1.5
- Icons: Phosphor Icons, outline style, no emoji
- Motion: fade/slide-in on scroll (200–300ms), respects `prefers-reduced-motion`
- Layout: mobile-first, breakpoints at 375 / 768 / 1024 / 1440, no horizontal scroll, touch targets ≥ 44×44px

## Technical Approach

- Plain HTML5 + hand-authored CSS (custom properties per above, no Tailwind/build step) + vanilla JS
- JS responsibilities: mobile nav toggle, menu category tab switching, smooth scroll to anchors, scroll-triggered fade-in
- Fully static — opens directly from file system or any basic static host, no backend, no dependencies to install
- Images: convert/compress source flyers to WebP where practical, lazy-load below-the-fold images, `alt` text on every image, `srcset` for hero images
- Accessibility: 4.5:1 text contrast minimum, visible focus states, keyboard-navigable nav and tabs, semantic HTML landmarks

## Explicitly Out of Scope

- Online cart/checkout or payment
- WhatsApp ordering (phone is voice-only)
- Glovo or other delivery-app integration
- Arabic or English translations (French only)
- CMS/backend for editing menu content (menu is hand-coded from the table above)
