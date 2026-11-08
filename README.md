# ArtistFolio — Portfolio Template

A responsive, lightweight portfolio template inspired by [ArtistFolio](https://portfolio.tailwindtemplate.net/artistfolio/). Built with vanilla HTML, CSS, and JavaScript — no frameworks or build steps required.

## Purpose

This project is a **reusable template** intended as a starting point for personal portfolios, artist showcases, or small project sites. Fork it, customize it, and deploy it as your own.

## Features

- Fully responsive (mobile-first breakpoints at 480px / 768px)
- Fixed side navigation with social media icons
- Fullscreen hero section
- Image gallery with lightbox (keyboard, swipe, fullscreen)
- **Project data driven by a single JSON file** — no code changes needed to add/remove projects
- Work detail pages (auto-populated from JSON)
- About section with skill tags and social links
- Contact form with validation + mailto delivery
- Open Graph / Twitter Card meta tags for social sharing
- Zero build dependencies (only Font Awesome CDN for icons)

## Getting Started

1. **Clone or download** this repository.
2. **Open `index.html`** in a browser — that's it. No build step.
3. **Customize** using the steps below.

## What to Edit

### 1. Project Data (most important)

All portfolio projects live in **`data/work.json`**. This is the single source of truth for:

- Project titles, types, and descriptions
- Image URLs
- Tags, year, client, and live links
- The `id` slug used for detail page routing

**To add a new project**, append a new object to the JSON array:

```json
{
  "id": "my-new-project",
  "title": "Project Title",
  "type": "UI Design",
  "description": "One-line summary shown on the card.",
  "fullDescription": "Longer description shown on the detail page.",
  "image": "https://images.unsplash.com/photo-XXXX?w=1200&q=80",
  "tags": ["Tag1", "Tag2"],
  "year": "2026",
  "client": "Client Name",
  "link": "https://example.com"
}   
```

To remove a project, delete its object from the array. No other file changes needed.
> ⚠️ Keep valid JSON — no trailing commas, no comments. Use a JSON validator if unsure.

### 2. Contact Email
Open js/script.js and find the boxed comment at the top:
```
const CONTACT_EMAIL = 'hello@yourdomain.com'; // ← EDIT THIS   
```
Replace with your receiving email address.

### 3. Social Media Links
Search for yourhandle in index.html and work-detail.html — replace each with your actual profile URL. Links appear in:
* Side navigation panel
* About section (LinkedIn, GitHub, Dribbble, Behance)
* Footer
* Open Graph / <link rel="me"> tags


### 4. Brand Colors & Fonts
Edit the CSS custom properties in css/style.css → :root:
```css
:root {
  --color-bg: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-text: #f5f5f5;
  --color-muted: #999;
  --color-accent: #e0c8ff;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}   
```

### 5. Open Graph / SEO
In index.html → <head>, search for the <!-- SEO & OPEN GRAPH --> comment block. Update:
* og:url / twitter:url → your deployed domain
* og:title / og:description → your name and tagline
* og:image / twitter:image → a 1200×630 px image URL
* twitter:creator → your @handle
* All <link rel="me"> URLs → your actual profiles

### 6. Text Content
Search for EDIT: comments in index.html:
| Section | What to change |
|---|---|
| Hero | Name, tagline, background image |
| About | Bio paragraphs, portrait, skill tags |
| Contact | Public email display |
| Footer | Copyright year + name |

All placeholder images are from Unsplash (royalty-free). Replace them with your own.

## Project Structure
```
├── index.html
├── work-detail.html
├── data/
│   └── work.json       ← EDIT: Add/remove projects here
├── css/
│   └── style.css
├── js/
│   └── script.js       ← EDIT: CONTACT_EMAIL at the top
├── README.md
└── LICENSE   
```
### Browser Support
Modern evergreen browsers (Chrome, Firefox, Safari, Edge). No IE support.

### Deployment
Any static host works:
* GitHub Pages – push to a gh-pages branch or enable Pages on main
* Netlify – drag-and-drop the folder at netlify.com/drop
* Vercel – vercel deploy from the project root
* Cloudflare Pages – connect the repo
> ⚠️ The fetch() call for work.json requires the site to be served over HTTP(S). Opening index.html via file:// will not load the gallery. Use a local server (npx serve, python -m http.server) for development.

### License
Distributed under the MIT License. Use it for personal or commercial projects without attribution, though a credit link is appreciated.

