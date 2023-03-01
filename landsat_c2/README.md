# Landsat C2 Stack Pulls

These scripts function as the primary R-user-friendly version of the Landsat Collection 2 workflows for the ROSS lab. These files are meant to function as building blocks, where you can use some or all to create a dataset.

## File descriptions:

* Primary Scripts:

    -  LandsatC2_M4-7_SurfaceRefTempStacks.rmd: level 2 surface reflectance and surface temperature stack pull for Landsat Collection 2 missions 4-7

    -  LandsatC2_M8-9_SurfaceRefTempStacks.rmd: level 2 surface reflectance and surface temperature stack pull for Landsat Collection 2 missions 8 and 9

    -   pySetup.R: script that uses the `reticulate` package to set up a reproducible python environement compatible with R


## Folder/file descriptions:

* helpfulBits

    - PointsToJSON.Rmd *maintenance*: from a user-defined list of Latitudes and Longitudes, create a JSON file for easy loading as an ee.FeatureCollection for the Stack Pull scripts.

    - CalculateCenter.qmd *stale*: calculations of Chebyshev center based on Xiao Yang's code

    - NHDPlusPointIntersect.Rmd *deprecated*: now included in the LandsatC2 scripts. From a user-defined list of Latitudes and Longitudes, create an earth engine feature collection of lake polygons from the NHDPlus package.

* sourceCode

This folder contains original code from Simon Topp and upstream .js files used for troubleshooting in the GEE IDE.
