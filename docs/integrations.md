# Integration Choices

CO2 Forest Atlas should add integrations that improve carbon and climate reasoning without turning the app back into a planting marketplace.

## Added Now

### D3

Use for carbon history and future pathway charts.

Why it fits:

- Small enough for the current browser application.
- Makes the CO2 story visible instead of burying it in text.
- Works in the current static browser app.

### Turf

Use for polygon area and centroid calculations.

Why it fits:

- Replaces hand-rolled geometry with standard GeoJSON tooling.
- Makes the map analysis code easier to defend in a portfolio review.
- Keeps the app static and client-side.

## Good Next Integrations

### NOAA GML CO2 Trends

Use for atmospheric CO2 concentration history in ppm.

Best UI use:

- Add a second tab beside emissions: `Atmosphere ppm`.
- Show Mauna Loa/global monthly CO2 trend separately from emissions.
- Label it clearly as concentration, not annual emitted mass.

Status: the latest atmospheric concentration and acceleration context are now shown in the CO2 view. A full monthly ppm chart remains a later enhancement.

### IPCC / IIASA Scenario Explorer

Use for real future emissions pathways.

Best UI use:

- Replace the current illustrative future lines with selected SSP pathways.
- Keep only 3 paths in the first release: low, middle, high.
- Cache a small static CSV subset instead of querying a heavy API at runtime.

### Global Forest Watch

Use for existing forest carbon and tree-cover context.

Best UI use:

- Add an optional `Existing forest carbon` layer in a later release.
- Use it to explain baseline biomass, not species-level planting carbon.

Risk:

- Some GFW API workflows require API keys or geostore setup.
- It can make the application feel like a general GIS product before the core CO2/species story is clear.

### i-Tree / OpenTreeMap Style Species Factors

Use for more species-specific urban tree carbon factors if a clean open dataset is selected.

Best UI use:

- Add a confidence badge: `class-level`, `genus-level`, or `species-level`.
- Keep the current growth classes as fallback.

Risk:

- Many tree carbon calculators are location/model specific and not drop-in global datasets.

## Current Recommendation

Keep D3 and Turf in the app. NOAA atmospheric concentration context is now included beside annual emissions. Add IIASA/IPCC pathways after that, but as a curated static dataset rather than a live dependency.

The repository-level compatibility review is recorded in `docs/repo-evaluation.md`.

The OWID snapshot can be refreshed with `npm run data:co2`. It currently normalizes ISO codes and stores 204 country histories locally so non-Turkey analyses do not fall back to the world line.
