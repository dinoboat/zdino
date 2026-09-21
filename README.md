# anthropos.live

Two pages, two text files to edit.

| Page | Address | What it shows |
|------|---------|---------------|
| Home | `/` | Spinning DINO, your bio, and every publication drifting across the screen |
| Work | `/work/` | All publications, grouped in green category boxes |

**Two plain-text files hold everything you will want to change:**

| File | Controls |
|------|----------|
| `content/work.md` | the Work page **and** every floating line on the Home page |
| `content/bio.md` | the bio box on the Home page (bio text and contact line) |

You never edit the HTML. Edit those files and the pages update.

---

## How to edit `content/work.md`

Open it in any text editor (Notepad is fine). It has two kinds of lines:

```
## selected academic essays          <- a CATEGORY (one green box on the Work page)

- 2027, [My New Paper](https://link), *Journal Name*, 12:3, pp.1-20. ([pdf](pdfs/my-new-paper.pdf)) [with Someone]
                                     <- one PUBLICATION under that category
```

### Add a publication
Add one line starting with `- ` under the category you want. It appears on the Work page **and** on the Home page's floating text.

### Add a category
Add a line starting with `## ` followed by the name, then its publications underneath:

```
## book reviews

- 2028, [Title of the Review](https://link), *Journal Name*.
```

### Remove or reorder
Delete the line, or move it. Order in the file is the order on the page. Put the newest first if you like.

### The only symbols you need

| You type | You get |
|----------|---------|
| `[words](address)` | a link |
| `*words*` | *italics* |
| `([pdf](pdfs/file.pdf))` | the `(pdf)` link |

Everything else is plain text, so keep writing years, commas and `[with Someone]` exactly as you do now.
No link yet? Write the title with no `[ ]( )`.

**One publication = one line.** Do not break a line in the middle.

### Adding a PDF
Your 17 existing PDFs are already in the `pdfs` folder and linked. For a new one:
1. Put the file in the `pdfs` folder. Name it `year-short-title.pdf`, all lower case, hyphens instead of spaces
   (like the existing ones, e.g. `2021-unlocked-memories-of-wuhan.pdf`).
2. Link it in the entry as `([pdf](pdfs/2028-my-new-paper.pdf))`.
That path works from both pages. The file name in the link must match the uploaded file exactly.

### Notes
- The Home page uses **every** entry. With only a few entries they repeat to fill the screen; with many, each appears once.
- Changes take effect as soon as the file is saved and published. There is nothing to build or compile.
- The top of `work.md` has a short reminder of these rules inside `<!-- ... -->`. Leave that in.

---

## How to edit the bio box (`content/bio.md`)

Open `content/bio.md`. Under the note at the top is your bio, then a blank line, then the contact line:

```
Dino Ge Zhang is a media anthropologist and non-fiction writer. His research ... [Bureau of Low Theory](https://lowtheory.org), a web database ...

contact: *dino.zhang[at]uib.no*
```

- **Each paragraph is separated by a blank line** and becomes a separate line in the box. Add or delete paragraphs freely.
- Use the same two symbols as `work.md`: `[words](address)` for a link and `*words*` for italics. (`**words**` gives bold.)
- Save and publish. There is nothing else to change.
- Keep the note inside `<!-- ... -->` at the top. It is a reminder to you and does not show on the site.

Note: the short description shown when your link is shared, and the description search engines use, is written separately in the
`<head>` of `index.html` (the lines containing `description`). If you rewrite your bio substantially, update those lines too.

---

## See it on your computer

The site reads `content/work.md`, so it has to be opened through a small web server, not by double-clicking `index.html`.

In PowerShell, from this folder:

```
.\serve.ps1
```

Then open <http://localhost:8080/>. Press Ctrl+C to stop.

## Put it online (free, GitHub Pages, domain zdi.no)

Full step-by-step guide: `HOW-TO-PUBLISH-ON-GITHUB.txt` (next to this folder). In short:

1. Create a free GitHub account and a **public** repository named exactly `YOURNAME.github.io` (so the site sits at the top of the address).
2. Upload everything in this folder to it (select all files inside the folder and drag them into the browser).
3. Repository **Settings > Pages**: source "Deploy from a branch", branch `main`, folder `/ (root)`. Test the site at `https://YOURNAME.github.io/`.
4. Then **Settings > Pages > Custom domain**: type `zdi.no`. GitHub adds a `CNAME` file to the repository (never delete it).
5. At your domain registrar, add four `A` records for `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153),
   optionally the four `AAAA` records, and a `CNAME` record `www` pointing to `YOURNAME.github.io`.
6. When GitHub reports "DNS check successful", tick **Enforce HTTPS**.

After that, updating the site = editing `content/work.md` on GitHub (open the file, click the pencil, change it, click **Commit changes**). It goes live in about a minute.

## What is where

```
index.html            Home page
work/index.html       Work page  (this is what makes the address /work/)
404.html              shown for any address that does not exist (GitHub uses it automatically)
favicon.ico           browser-tab icon (more sizes in assets/icons/)
content/work.md       publications: THE FILE YOU EDIT most
content/bio.md        the bio box on the Home page (edit this too)
pdfs/                 put your PDFs here
assets/style.css      colours, fonts, layout
assets/content.js     reads work.md            (no need to touch)
assets/home.js        DINO + floating text     (no need to touch)
assets/work.js        draws the Work page      (no need to touch)
serve.ps1             local preview
```

Things you might change later, all in `assets/style.css` at the top: the green (`--green`), the red (`--red`) and the two fonts.
The bio and contact line are in `content/bio.md`.

## The link-preview card

When someone shares your link (WhatsApp, WeChat, Slack, iMessage, X, LinkedIn, email), apps show a card with
`assets/share-preview.jpg` (1200 x 630, the "DINO ZHANG / zdi.no" image), the title "Dino Ge Zhang" and a short description.
The card is set up in the `<head>` of `index.html` and `work/index.html` (the lines starting `<meta property="og:...`).

- The addresses in those lines are written out in full (`https://zdi.no/...`) because sharing apps require that.
  If your domain ever changes, replace `zdi.no` in those two files.
- To change the picture, replace `assets/share-preview.jpg` with a new 1200 x 630 image (keep it under about 300 KB).
- Apps remember old cards for a while. If you change the image and an app still shows the old one, use that app's
  "refresh" tool (e.g. Facebook's Sharing Debugger, LinkedIn's Post Inspector) or wait a few days.

## Good to know
- `404.html` loads its styles from the top of the domain (`/assets/style.css`), so that it works at any address.
  This is right when the site lives at the top of a domain (e.g. yourname.com). If you ever host it in a
  sub-folder (e.g. yourname.github.io/anthropos-site/), those paths would need adjusting.
- Fonts (Bungee, Barlow Condensed) load from Google Fonts. Self-hosting them later is easy if you prefer no third-party requests.
- Search engines that run JavaScript (Google does) will read the publications; a few simple crawlers will not. If that ever matters, the list can be pre-built into plain HTML.
