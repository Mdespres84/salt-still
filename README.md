# Salt & Still Mobile Bar: website

A static three-page site for a trailer mobile bar serving Hillsborough County and Tampa Bay. It needs no build step and runs on GitHub Pages as-is.

```
index.html            home page
weddings.html         weddings page
parties.html          all other parties
404.html              not-found page
assets/css/styles.css styles
assets/js/main.js     nav, inquiry form and its estimate
assets/img/favicon.svg
.nojekyll             tells GitHub Pages to serve files as-is
```

## Put it on GitHub Pages

1. Create a new repository on GitHub (this one is `salt-still`).
2. Upload everything in this folder to the repository root, including `.nojekyll`.
3. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, and choose `main` and `/ (root)`.
4. After a minute the site will be live at `https://mdespres84.github.io/salt-still/`.

### Custom domain (optional)
In **Settings → Pages → Custom domain**, enter something like `saltandstill.com`. Then add the DNS records GitHub shows you at your domain registrar. GitHub will create a `CNAME` file for you.

The 404 page links to `/salt-still/` for the github.io address. If you move to a custom domain, change those two links in `404.html` back to `/`.

## Before you launch

Search all three pages (`index.html`, `weddings.html`, `parties.html`) for each of these and replace them. The menu card and inquiry form appear on more than one page, so price changes must be made on each page.

| What | Placeholder |
|---|---|
| Phone | `(813) 555-0142` (appears twice) |
| Email | `hello@saltandstill.com` (index.html and main.js) |
| Social links | `https://instagram.com/` and the others in the footer |
| Inquiry form | `YOUR_FORM_ID` |
| Trailer details | The "A little saloon on wheels" section. Check the setup description and the 32 × 10 ft footprint once the build is done. |
| Gallery note | The line saying these are stock photos. Remove it once you add your own. |

### Connect the inquiry form
GitHub Pages can't receive form submissions by itself, so the form posts to Formspree (free tier available).

1. Sign up at formspree.io and create a form.
2. Copy its ID (the part after `/f/`).
3. In `index.html`, replace `YOUR_FORM_ID` in the form's `action` with your ID.

Until you do this, the form shows visitors a message asking them to call or email instead.

## Pricing

The estimate on the inquiry card uses the prices set near the middle of `assets/js/main.js`:

```js
var RATE = 115;        // per bartender, per hour
var RIG = 750;         // trailer bar, Sport Coat and Black Tie
var MIXERS = 5;        // per guest
var ZERO_PROOF = 9;    // per guest for a zero-proof-only bar
var CONCIERGE = 350;   // Black Tie flat fee
var GUESTS_PER_BARTENDER = 60;
var CUSTOM = 125;      // per custom signature cocktail
var MIN_HOURS = 4;     // 2- and 3-hour parties are billed at this minimum
```

Travel fees live on the County dropdown in `index.html` (`data-fee` on each option: Hillsborough 0, Pinellas and Pasco 100, other = quoted), plus the menu card note and the travel FAQ.

The "from" prices on the menu card in `index.html` assume the 4-hour minimum and 50 guests:

- Boots & Jeans: $460
- Sport Coat: $1,460
- Black Tie: $1,810

If you change the numbers in `main.js`, update the menu card to match. Extras are priced in two places in `index.html`: the "On the side" list on the menu card, and the `data-price` on each extra in the inquiry form. The custom cocktail price is `CUSTOM` in `main.js` plus the two "$125 each" labels in `index.html`.

## Photos

All photos come from Unsplash (free under the Unsplash License) and are loaded directly from Unsplash's servers. To use your own:

1. Put the photos in `assets/img/`. Resize them to about 2000px wide for the full-width shots and about 1000px for the others.
2. Change each `src="https://images.unsplash.com/..."` to `src="assets/img/your-photo.jpg"`.

Replace the hero photo and the trailer photo with your own first. Those two carry the page.

If a photo fails to load, its frame shows a leather-brown tone instead of a broken image.

## Legal copy to check

The "How it works" section and the FAQ describe a Florida dry-hire model: the host buys all alcohol, there's no markup, and unopened bottles stay with the host. Have a Florida attorney or the Division of Alcoholic Beverages and Tobacco confirm this wording before you launch. Also confirm the deposit, cancellation, and insurance terms in the FAQ match your actual contract and policy.
