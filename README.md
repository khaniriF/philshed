# Phil Philshed Learning Center — Website

A complete, responsive, static website for Phil Philshed Learning Center.
Built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no
build step, no dependencies to install.

## 1. File / folder structure

```
philshed-site/
├── index.html          All page content and structure (one page, anchor-linked sections)
├── css/
│   └── style.css       All styling: design tokens, layout, responsive rules, animations
├── js/
│   └── main.js         All interactivity: nav, gallery, lightbox, slider, form validation
├── images/
│   ├── og-cover.svg     Social-media share image placeholder
│   └── README.md         Notes on where to add real photos
└── README.md            This file
```

Everything is self-contained and works by simply opening `index.html` — there
is no backend, database, or build tool required for the site to run.

## 2. Running it locally in VS Code

1. Open the `philshed-site` folder in VS Code (`File → Open Folder…`).
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have
   it — search "Live Server" in the Extensions panel.
3. Right-click `index.html` in the file explorer and choose
   **"Open with Live Server"**. Your default browser will open the site at
   an address like `http://127.0.0.1:5500` and auto-refresh whenever you
   save a file.

   *Alternative without an extension:* open `index.html` directly in a
   browser (double-click the file). Everything works the same, but you
   won't get auto-refresh on save.

## 3. Where to replace placeholder school information

Search `index.html` for the marker `[PLACEHOLDER:` — every instance is a
piece of contact or location information you should replace with real
details. Currently these appear in two places:

- The **Contact section** (`id="contact"`): address, phone, email, opening
  hours.
- The **Footer**: the same contact details repeated.

Also review and edit as needed:

- **Programs** (`id="programs"`): six example program cards — rename,
  reorder, add, or remove cards to match your real offering.
- **News & Events** (`id="news"`): three example articles with placeholder
  dates and text.
- **Testimonials** (`id="testimonials"`): three example quotes — replace
  with real (permission-given) feedback from parents, students, and alumni.
- **Statistics** in the hero (`data-count` attributes): example numbers for
  educators, students, programs, and years — update to your real figures.
- **Social links** in the footer currently point to `#` — replace `href="#"`
  with your real Facebook, Instagram, TikTok, and WhatsApp links.
- **Google Map**: the Contact section has a placeholder box
  (`.map-placeholder`) — replace it with a real embedded map, e.g.:
  ```html
  <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="300" style="border:0;" loading="lazy"></iframe>
  ```
  (Get the embed URL from Google Maps → Share → Embed a map.)

## 4. Where to replace images

See `images/README.md` for full details. In short: the site currently uses
hand-drawn inline SVG illustrations and colored placeholder tiles (so
nothing is ever a broken image link). To swap in real photography:

- Add image files to the `images/` folder.
- For the **gallery**, set the `src` value in the `GALLERY_ITEMS` array at
  the top of `js/main.js`.
- For the **hero/about illustrations** and **facility/news tiles**, replace
  the relevant `<svg>...</svg>` or colored `<div>` block in `index.html`
  with an `<img src="images/your-photo.jpg" alt="...">` tag.

## 5. The contact form and backend note

The enquiry form in the Contact section has full client-side validation
(required fields, email format, phone format, minimum message length) and
shows success/error feedback. **It does not currently send email anywhere**
— there is no backend attached, since this is a static frontend-only site.

To make it actually deliver messages, you have two simple options:

- **No-code**: use a form backend service like
  [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) —
  sign up, then point the form's `action` attribute at the endpoint they
  give you (a couple of lines of change in `index.html` and `js/main.js`).
- **Custom backend**: build a small serverless function (e.g. on Netlify
  Functions, Vercel, or AWS Lambda) that receives the form's fields as JSON
  and sends an email via a provider like SendGrid or Mailgun, then update
  the `fetch()` call inside the `submit` handler in `js/main.js`
  (`initContactForm` function) to call that endpoint.

## 6. Publishing on GitHub Pages

1. Create a new repository on GitHub (e.g. `philshed-learning-center`).
2. Push this folder's contents to the repository root:
   ```bash
   cd philshed-site
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. On GitHub, go to your repository's **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, select `main` and folder `/ (root)`, then **Save**.
6. Wait a minute or two — GitHub will publish your site at:
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`
7. Every time you push new commits to `main`, the live site updates
   automatically within a minute or so.

*Tip:* if you want the site at the root of a custom domain, add a `CNAME`
file with your domain name to the repository root and configure your DNS as
described in GitHub's custom domain documentation.

## 7. Notes on what's already handled

- **Fully responsive**: tested breakpoints down to small phones (mobile nav
  becomes a slide-out hamburger menu at 760px and below).
- **Accessibility**: skip link, semantic landmarks, visible keyboard focus
  states, `aria-*` attributes on interactive widgets (nav, hamburger,
  gallery filters, lightbox, form errors), alt text/labels throughout.
- **`prefers-reduced-motion`** is respected — all animation and smooth
  scrolling is disabled for users who request it at the OS level.
- **SEO basics**: descriptive title/meta description, Open Graph tags,
  semantic heading hierarchy, alt text on all imagery.
- **Performance**: no external JS frameworks, gallery images use
  `loading="lazy"`, fonts are loaded from Google Fonts with `preconnect`.
