# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Werewolf blog

The blog lives at `/blog/` (French), `/en/blog/`, `/es/blog/` and `/de/blog/`.
English copy uses American English. Each article has its own localized slug,
self-referencing canonical, reciprocal language links, and BlogPosting markup.

To add a guide, create one Markdown file per language under `src/data/blog/`.
Use an existing article as the frontmatter template:

- `translationKey`: shared identifier across the four translations.
- `locale`: `fr`, `en`, `es` or `de`.
- `slug`: unique URL slug in that language, without slashes.
- `title`, `description`, `category`: localized editorial copy.
- `image`: existing public asset path, starting with `/`.
- `published`: actual publication date as a quoted `YYYY-MM-DD` string.

Start article headings at H2; the page renders the H1 from `title`.
Link to the localized version of related guides. The build validates translation
coverage and generates article routes, contents lists, language switches and
sitemap entries. `src/data/existing-sitemap.xml` retains the pre-blog URLs.
Run `npm run build` before deploying using `DEPLOYMENT.md`.

After publication, submit `/sitemap.xml` in Google Search Console and inspect an
English article. Track US impressions, clicks and queries for `/en/blog/`;
keyword targets are editorial hypotheses, not measured search-volume estimates.
Reference: https://developers.google.com/search/docs/specialty/international/localized-versions
