# Jennifer Phung — Personal Portfolio

A static, dependency-free portfolio site: plain HTML, CSS, and JS. No build
step — open `index.html` in a browser, or host the folder anywhere that
serves static files (GitHub Pages, Netlify, Vercel, etc.).

## File structure

```
jennifer-portfolio/
├── index.html          All page content (semantic HTML5)
├── css/
│   └── styles.css      Design tokens + all styling, mobile-first breakpoints at the bottom
├── js/
│   └── main.js         Nav toggle, experience-card tap behavior, contact form logic
└── assets/
    └── images/         Placeholder SVGs — swap these for real photos/logos
```

## Replacing the placeholder images

Every image in `assets/images/` is a simple generated placeholder so the
site works out of the box. Swap them for real files with the same names
(or update the `src` in `index.html` if you rename them):

- `profile.svg` → your headshot (used in the hero, displayed in a circle)
- `logo-*.svg` → each organization's logo, one per experience card
- `gallery-*.svg` → event/experience photos in the gallery grid

Recommended: JPG/PNG around 800px on the long edge for photos, and square
logos with some breathing room around the mark.

## Adding or editing an experience card

Each card in the `<ul class="exp-grid">` (in `index.html`) is self-contained:

```html
<li class="exp-card" tabindex="0">
  <img src="assets/images/logo-example.svg" alt="Company Name" loading="lazy">
  <div class="exp-card__overlay">
    <p class="exp-card__title">Company Name</p>
    <ul class="exp-card__skills">
      <li>Skill one</li>
      <li>Skill two</li>
    </ul>
  </div>
</li>
```

Duplicate the `<li>`, then change the image, title, and skill list. To make
a card link out (e.g. to a company site or write-up), wrap the image and
overlay in an `<a href="...">` inside the `<li>` and add `display:block` /
`height:100%` to that anchor in `styles.css` — the hover/tap behavior
already targets `.exp-card` regardless of what's inside it.

## Adding a gallery photo

Duplicate a `<li>` inside `<ul class="gallery-grid">` and swap the `src`
and `alt` text. The grid re-flows automatically (3 columns → 2 → 1 as the
screen narrows).

## Connecting the contact form to a real backend

Right now, submitting the form runs a placeholder in `js/main.js`
(`sendMessage()`) that just simulates success after ~1 second so you can
see the full validation/loading/success flow without a backend. Swap in
one of the following (full snippets are also commented directly above
`sendMessage()` in `js/main.js`):

- **EmailJS** — include the EmailJS SDK script tag in `index.html`, then
  call `emailjs.send(...)` inside `sendMessage()`.
- **Formspree** — `fetch()` your Formspree endpoint from inside
  `sendMessage()`, or simplify further by setting the `<form>`'s `action`
  to the Formspree URL and letting it submit natively.
- **Netlify Forms** — add `data-netlify="true"` and a hidden `form-name`
  input to the `<form>` in `index.html`; Netlify handles the rest without
  any JS.
- **Custom API** — `fetch()` your own endpoint inside `sendMessage()`.

The honeypot field (`#company`, visually hidden) is a lightweight spam
trap — leave it in place regardless of which backend you choose.

## Accessibility & responsiveness notes

- Skip link, visible focus states, and `aria-live` status messages are
  built in.
- Experience cards are keyboard-operable (`Tab` + `Enter`/`Space`) and
  tap-toggle on touch devices; hover is used only on pointer devices via
  `@media (hover: hover)`.
- All motion respects `prefers-reduced-motion`.
- Layout is fluid from ~360px phones up through desktop, with breakpoints
  at 900px, 640px, and 420px in `styles.css`.
