# Methodology

The MVP extends Replantio's static browser architecture and EcoCrop-based scoring engine with a clearer climate-resilience comparison. It compares two 10-year windows for a selected point:

- Current baseline: 2015-2024 daily climate data.
- 2040 outlook: 2036-2045 daily climate model projection.

Both windows are transformed into the same climate summary:

- Annual mean temperature: mean of all daily mean temperatures.
- Coldest day temperature: minimum of all daily minimum temperatures.
- Annual precipitation: average yearly precipitation across the period.
- Summer precipitation: average June-July-August precipitation across the period.

Replantio's existing suitability engine scores species with trapezoidal EcoCrop envelopes and most-limiting-factor combination. The 2040 outlook reuses that same scoring engine against projected climate normals, then shows the future score and score delta beside the current baseline score.

Status labels are derived from the difference between future and current total score, expressed as percentage points:

- `more_suitable`: difference >= +10.
- `stable`: difference from -9 to +9.
- `declining`: difference from -10 to -24.
- `not_recommended`: difference <= -25, or a future score of 0.

Future values use a single climate model, `MRI_AGCM3_2_S`, and must be labeled as exploratory projection output, not a site-level forecast.

## CO2 Context

### Tree carbon screening range

Tree and stand carbon values are displayed as sensitivity ranges rather than
single exact results. The central estimate still follows the growth-class,
allometry, root-to-shoot, carbon-fraction and stand assumptions implemented in
`growth.js`. The visible envelopes are:

- Per-tree estimate: 0.60x to 1.50x the central estimate.
- Per-hectare and selected-area estimate: 0.45x to 1.65x the central estimate.

The stand envelope is wider because planting density, mortality and the
mean-tree correction add uncertainty beyond the individual-tree allometry.
These are transparent sensitivity bounds for early screening, not measured
prediction intervals or statistical confidence intervals. Until regional or
species-level growth and allometry replace the class defaults, the UI labels
carbon confidence as `low · class-level`.

The CO2 context panel uses annual territorial CO2 emissions from Our World in Data / Global Carbon Budget. It shows the selected country when a country code is available; otherwise it falls back to world emissions.

The future pathway lines are deliberately simple:

- Recent trend: extends the latest 10-year compound trend, clamped to avoid extreme extrapolation.
- Managed decline: applies a 4% annual decline from the latest value.
- Net-zero 2050: linearly declines from the latest value to zero in 2050.

These pathways are explanatory context, not forecasts or policy modelling.
