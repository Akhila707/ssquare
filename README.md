# S & S — portfolio & booking site

A single-page portfolio for **Naresh (stand-up comedy)** and **Akhila (storytelling)** —
one shared brand, two performers, 50-50 billing. Beige, minimalist, formal.

> Storytelling × Stand-up Comedy

## Files

```
index.html      All page content & structure
styles.css      Beige minimalist theme + responsive layout
script.js       Nav, mobile menu, scroll reveal, booking form
assets/         Put photos & videos here (see assets/README.md)
```

## View it locally

Just double-click `index.html` — it opens in any browser, no server needed.

(Optional) To preview with a local server:

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

## What to customize

1. **Photos & videos** — see `assets/README.md`. Replace the dotted placeholder
   boxes with real `<img>` / `<video>` tags.
2. **Booking email / form** — already wired to real emails (no backend needed).
   - The Send Request form opens the visitor's email app with every field
     pre-filled, addressed to the right person based on the Book button:
     Book Naresh → nareshchml.09@gmail.com, Book Akhila → pvakhila06@gmail.com,
     Book the Duo (default) → both.
   - To change recipients later, edit `data-mail-naresh` / `data-mail-akhila`
     on the `<form id="form">` in `index.html`.
   - Direct email + phone for both are also listed in the Book section and footer.
3. **Social links** — replace the `#` in the footer Instagram / YouTube links.
4. **Show details & dates** — the two shows (Enna Solla Pogiraai??, Nesippaya)
   have placeholder descriptions in the `#shows` section; add real dates/links.

## Deploy for free

Any static host works. Easiest options:

- **Netlify** — drag the whole folder onto https://app.netlify.com/drop
- **Vercel** — `vercel` in this folder, or import from Git
- **GitHub Pages** — push to a repo, enable Pages on the `main` branch

## Sections (in page order)

Hero → Who We Are → Meet the Performers → The Mashup → Our Shows →
See Us Live → What We Do → Performance Formats → Our Journey → Gallery → Book Us
