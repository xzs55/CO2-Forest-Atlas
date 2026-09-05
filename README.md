# CO2 Forest Atlas

This project is built on the MIT-licensed Replantio codebase (`gdavidss/replantio`) and narrows the product toward climate resilience screening.

The core question is: species that look suitable under the 2015-2024 climate baseline, do they remain suitable in a 2036-2045 climate outlook?

This is not a planting recommendation, forestry prescription, carbon-credit tool, or formal offset calculator. It shows CO2 context for screening, not claim-grade carbon accounting.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Verify a Release

```bash
npm test
npm run build
```

The production files are generated in `dist/`. The app remains a static browser
application: no backend, database, environment variables, or API keys are
required for the MVP.

## Publish

### GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. Every push to
`main` runs the checks, builds the app, and deploys `dist/` to GitHub Pages.

For the first deployment, open the repository's **Settings > Pages** and set
**Source** to **GitHub Actions**. The published URL will then appear in the
workflow summary and the repository's **Deployments** section.

`vite.config.js` uses relative production asset paths, so the build works under
a repository path such as `https://<username>.github.io/CO2-Forest-Atlas/` as
well as on a custom domain.

### Vercel

Import the GitHub repository in Vercel and keep the detected Vite defaults:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

No secrets or environment variables are needed. Open-Meteo, SoilGrids and the
map layers are requested directly by the browser at runtime.

## Data Sources

- Current baseline: Open-Meteo Historical Weather API, 2015-01-01 to 2024-12-31.
- 2040 outlook: Open-Meteo Climate API, 2036-01-01 to 2045-12-31.
- Climate model: `MRI_AGCM3_2_S`.
- Daily variables: `temperature_2m_mean`, `temperature_2m_min`, `precipitation_sum`.
- Species suitability model and data structure: adapted from Replantio's EcoCrop-based scoring engine.
- CO2 emissions history: Our World in Data annual CO2 emissions chart, sourced from Global Carbon Budget.

Atmospheric CO2 concentration history is a different dataset. Use NOAA GML Trends in CO2 for ppm concentration records; use OWID / Global Carbon Budget for annual emissions by country and world.

## Product Direction

The UI is intentionally moving away from Replantio's restoration marketplace feel. CO2 Forest Atlas focuses on:

- Current suitability vs. 2040 climate resilience.
- Area-level 20-year CO2e screening estimates.
- Low-to-high CO2e sensitivity ranges with explicit class-level confidence.
- Historical CO2 emissions context for the selected country and the world.
- Simple future pathway sketches from the latest emissions data point.

The future emissions lines are not official forecasts. They are lightweight interpretive paths: recent trend, managed decline, and net-zero by 2050.

Tree carbon bands are transparent screening envelopes, not statistical
confidence intervals or offset-grade accounting. See `docs/methodology.md` for
the assumptions and range factors.

## Technical Notes

- D3 renders the CO2 history and pathway chart.
- Turf calculates polygon area and centroid from GeoJSON geometry.
- Replantio's EcoCrop-based suitability engine remains the core scoring reference.

The UI must label future values as an exploratory projection from one climate model, not a forecast.

## Related Work

Replantio is the base application for this MVP. Its MIT license is preserved in `LICENSE`; Replantio copyright remains with Guilherme David.
