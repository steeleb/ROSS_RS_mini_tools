# Landsat C2 Stack Pulls

These scripts function as the primary R-user-friendly version of the Remote Sensing workflows for the ROSS lab. 

## File descriptions:

In development:
 * LandsatC2_SurfaceTemperature.qmd: surface temperature stack pull for Landsat 4-9
 * LandsatC2_SurfaceReflectance.qmd: surface reflectance stack pull for Landsat 4-9

Stale:
 * CalculateCenter.qmd: calculations of Chebyshev center based on Xiao Yang's code
 * NHDIntersect.qmd: find NHD PermID and ComID using lat/longs

Functional:
 * venv_setup.bash: run these lines in your bash shell to prepare your virtual environment to run these scripts in R Studio

Output files:
 * requirements.txt: tracking of Python dependencies and module versions (automatically created in venv setup)


## Folder descriptions:

sourceCode: original code from Simon Topp
