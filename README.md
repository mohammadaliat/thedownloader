# Dropwise

A clean, local-first download preparation workspace. It gives users a focused place to bring in a URL, select an audio, video, or file profile, receive a helpful recommendation, and save a prepared-download receipt.

> **Important:** This project is a front-end prototype. It does not fetch media from third-party services. Only download content you own or have permission to save.

## Features

- URL preparation flow for popular social/video sources and direct links.
- Video, audio, and file output profiles with quality and size context.
- AI-assist interaction that recommends a balanced output choice.
- Recent library and responsive layout, including a dark appearance toggle.
- A downloadable receipt so the complete prototype flow can be tested safely offline.

## Run locally

No dependency installation is required.

```bash
npm start
```

Open [http://localhost:4173](http://localhost:4173). To validate the JavaScript syntax:

```bash
npm test
```

## Preview and acceptance checklist

1. Start the preview with `npm start`, then open `http://localhost:4173` in your browser. The server prints each request in the terminal; use `Ctrl+C` when you are done.
2. Paste an `https://` link and select **Prepare**. Confirm that the source card changes to a ready state and the Download button becomes available.
3. Select each **Video**, **Audio**, and **File** tab, then choose a profile. Confirm that the ready message updates with the selected profile.
4. Select **Get smart recommendation** and confirm that the balanced video profile is selected.
5. Select **Choose a file** (or drag a file into the source panel). Confirm that the filename and browser-only privacy message appear. Selecting Download returns the unchanged local file.
6. For URL sources, selecting Download saves a small preparation receipt. This is intentional: the prototype never retrieves media from third-party platforms.

Before sharing a change, run the automated checks below:

```bash
npm test
git diff --check
python3 -m http.server 4173
```

In a second terminal, verify the served entry points:

```bash
curl --fail --silent http://127.0.0.1:4173/ | rg -q 'Anything in'
curl --fail --silent http://127.0.0.1:4173/sitemap.xml | rg -q '<urlset'
```

## Repository guidelines

- Keep the experience local-first and do not add third-party download or scraping logic without reviewing service terms and applicable law.
- Prefer accessible semantic HTML, keyboard-operable controls, and responsive CSS.
- Keep the interface lightweight: this starter intentionally has no build step or runtime dependencies.
- Update this README and `sitemap.xml` when adding public pages or changing the primary user flow.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Semantic application shell and accessible controls. |
| `styles.css` | Responsive visual design and dark appearance styles. |
| `app.js` | Profile selection, source preparation, recommendation, and safe demo download behavior. |
| `sitemap.xml` | Sitemap entry for the public root page. |
