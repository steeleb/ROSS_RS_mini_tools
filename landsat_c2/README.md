# Landsat C2 Stack Pulls

These scripts function as the primary R-user-friendly version of the Landsat Collection 2 workflows for the ROSS lab. These files are meant to function as building blocks, where you can use some or all to create a dataset.

## File descriptions:

Completed:

-   PointsToJSON.Rmd: from a user-defined list of Latitudes and Longitudes, create a JSON file for easy loading as an ee.FeatureCollection for the Stack Pull scripts.

In development:

-   NHDPlusPointIntersect.Rmd: from a user-defined list of Latitudes and Longitudes, create an earth engine feature collection of lake polygons from the NHDPlus package.

-   LandsatC2_GrabSceneMetadata.rmd: this script grabs a bunch of parameters from scene-level metadata that may be applicable to downstream QAQC of reflectance or temperature stacks.

-   LandsatC2_M4-7_SurfaceRefTempStacks.rmd: surface reflectance and temperature stack pull for Landsat missions 4-7 from an earth engine feature collection.

-   LandsatC2_M8-9_SurfaceRefTempStacks.rmd: surface reflectance and temperature stack pull for Landsat missions 8 and 9 from an earth engine feature collection.

Stale:

-   CalculateCenter.qmd: calculations of Chebyshev center based on Xiao Yang's code

## Folder descriptions:

sourceCode: original code from Simon Topp and upstream .js files used for troubleshooting
