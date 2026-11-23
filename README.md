# SiNE Archives - React Systems

The Systems experiment lets visitors explore Redactory, Divination and Bloom in English or Brazilian Portuguese. Select Redactory and then Examine the Anchor to follow the first concept.

## Run locally

On Windows, double-click **Start-React-Systems.cmd** and leave its window open. The launcher installs dependencies on first use. It opens http://localhost:5174/#/systems in your default browser when Vite is ready.

From a terminal with Node.js 22 and npm, run:

```sh
npm ci
npm run dev
```

Edit components, navigation, and styles in `src/`. The six Markdown records in `src/content/` and three illustrations in `src/art/` supply the experience. The full archive lives on the main branch.

Run `npm run build` to type-check and build. Run `npx playwright install chromium` once for browser tests, then `npm test` after building. Tests use a separate local port.
