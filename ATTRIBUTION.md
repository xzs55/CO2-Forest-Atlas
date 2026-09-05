# Attribution

## Open-Meteo

This project uses Open-Meteo APIs for historical and projected daily climate data.

- Historical Weather API: https://open-meteo.com/
- Climate API: https://open-meteo.com/en/docs/climate-api

Prototype usage should be re-checked against Open-Meteo's current terms before commercial release or high-traffic deployment.

## CMIP6 / HighResMIP

The 2040 outlook uses climate model output distributed through Open-Meteo's Climate API. Open-Meteo documents the Climate API as using downscaled high-resolution climate models from CMIP6 HighResMIP.

## CO2 History

Annual country/world CO2 emissions history is generated from Our World in Data's Grapher CSV for annual CO2 emissions, sourced from Global Carbon Budget. The local snapshot covers 204 countries from 1950 through the latest available observation year. ISO alpha-2/alpha-3 matching is generated from the World Bank country API.

- https://ourworldindata.org/co2-emissions
- https://ourworldindata.org/grapher/annual-co2-emissions-per-country

Atmospheric CO2 concentration history should come from NOAA Global Monitoring Laboratory Trends in CO2:

- https://gml.noaa.gov/ccgg/trends/data.html

## Replantio

This project is built on the MIT-licensed Replantio repository:

- https://github.com/gdavidss/replantio

Replantio copyright remains with Guilherme David. The MIT license text is preserved in `LICENSE`.
