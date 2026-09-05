# Product roadmap

The product should grow from a one-off map calculation into a living site-intelligence system. Additions are ordered by user value and scientific defensibility, not visual novelty.

## 1. Trust layer

- Show `species`, `genus`, or `growth-class` confidence beside every carbon estimate.
- Show observation period, source update date, spatial resolution, and missing inputs in one data-quality strip.
- Replace global growth-class fallbacks with regional allometry only where a compatible published model exists.
- [Done in MVP] Add sensitivity ranges instead of presenting one carbon number as exact.

## 2. Site passport

- Save a location as a persistent site with a short baseline: climate, soil, current canopy, suitable native trees, carbon range, and 2040 risks.
- On return, show what changed: new climate observation, fire alert, tree-cover loss, or model/data update.
- Compare two sites or two species plans side by side.

This is the strongest next product system because it gives users a reason to return instead of drawing once and leaving.

## 3. Map modes

- `Satellite`: the current inspectable imagery.
- `Terrain`: elevation, slope, aspect, and watershed context.
- `Canopy`: existing tree cover and loss/gain from a compatible Global Forest Watch layer.
- `Risk`: heat, drought, fire, and 2040 suitability change.
- `Carbon`: existing biomass where available versus modeled additional storage.

Modes should share one legend and one selected site. Do not stack every layer at once.

## 4. User-provided evidence

- Measured soil pH and texture.
- Existing tree species, count, diameter, height, and condition.
- Irrigation availability and planting density.
- Observed frost, drought damage, fire history, or seasonal waterlogging.
- Optional photos and field notes with date and coordinates.

Every user value must show exactly which result it changed. Community observations remain `unverified` until reviewed; they must never silently overwrite reference data.

## 5. Living guidance

- A seasonal site calendar: field observation, planting window, watering risk, and monitoring dates.
- A “why did this rank change?” changelog when data or assumptions update.
- Watchlists for saved sites, with alerts only for material changes.
- A restoration-plan mode that compares mixed stands instead of selecting one winning species.

## 6. Later data systems

- Global Forest Watch for tree-cover and disturbance context.
- NASA FIRMS for recent fire detections.
- GBIF and iNaturalist for nearby occurrence evidence and user-verifiable observations.
- Curated IPCC/IIASA scenario subsets for defensible future emissions pathways.
- Regional i-Tree/USFS-style allometry only behind geographic compatibility checks.

## Recommended sequence

1. Carbon confidence and uncertainty.
2. Site passport with local save and compare.
3. Canopy/risk map modes.
4. User tree inventory and condition inputs.
5. Change monitoring and alerts.

Accounts, social features, public submissions, and complex GIS editing should wait until the data-quality layer is complete.
