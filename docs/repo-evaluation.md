# Repository evaluation

This note records which open-source projects were considered and why their code or data is, or is not, part of CO2 Forest Atlas.

## Integrated ideas

### CarbonPlan forest-risks

- Repository: https://github.com/carbonplan/forest-risks
- Useful idea: carbon potential should never be presented without climate and disturbance risk.
- Fit here: the Atlas priority signal combines 20-year CO2 capacity, current suitability, and 2040 resilience.
- Code/data copied: none. CarbonPlan's published raster products are focused on the continental United States and are not a valid global layer for this app.

### Global Forest Watch

- Repository: https://github.com/wri/gfw
- Useful idea: distinguish existing forest condition from future planting potential.
- Fit here: suitable for a later optional baseline-biomass/tree-cover layer.
- Added now: no. Its dataset/layer workflow would add API and geostore complexity before the global species-resilience result is reliable enough.

### TreeCarbonXray / USFS i-Tree approach

- Repository: https://github.com/bobsa514/TreeCarbonXray
- Useful idea: expose whether a carbon estimate is species-, genus-, or class-level and account for tree condition.
- Fit here: a later estimate-confidence field and condition modifier in species details.
- Added now: no. USFS coefficients are region-specific and cannot be applied globally without a location/model compatibility layer.

## Data integration added

### NOAA Global Monitoring Laboratory

- Source: https://gml.noaa.gov/aggi/aggi.html
- Added to the CO2 view: 2024 global atmospheric concentration and the measured long-term/recent growth-rate context.
- Reason: annual emissions and atmospheric concentration answer different questions. Showing both makes the Atlas's CO2 story more complete without pretending that tree storage can offset national emissions directly.

## Product rule

External repositories are used only when their geographic coverage, model assumptions, and license fit the selected location. The Atlas should prefer a clearly scoped original decision layer over combining incompatible datasets for visual complexity.
