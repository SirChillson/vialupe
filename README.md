# Via Lupe

Personal site of William Summers: [vialupe.com](https://vialupe.com). Built with [Eleventy](https://www.11ty.dev/) and hosted on Cloudflare Pages.

## Run locally

```sh
npm install
npm start        # dev server at http://localhost:8080
npm run build    # writes the site to _site/
```

## Connecting Substack

Essays are published on Substack. Once the publication exists, fill in `src/_data/site.json`:

```json
"substackUrl": "https://vialupe.substack.com",
"substackFeed": "https://vialupe.substack.com/feed"
```

With those set, the nav and home page show a Subscribe link, and the Writing page lists Substack posts, pulled from the feed each time the site builds. Use your custom domain in both fields if you add one (e.g. `https://letters.vialupe.com`).

Because the post list is built at deploy time, the site needs a rebuild to show a new post. Add a Cloudflare Pages deploy hook and trigger it after publishing, or on a schedule.

## Layout

- `src/_includes/base.njk`: page shell, nav, theme toggle
- `src/_data/substack.js`: fetches the Substack feed at build time
- `src/pirates/`: the Faster Than Wind game, served at `/pirates/` but not linked from the nav
