# ROSS_RS_mini_tools

Useful remote sensing tools created by the ROSSyndicate. All subdirectories are under development unless otherwise stated. 

Suggested cloning method is available in the file `CloningWorkflows.md` in the 'helps' subdirectory. Common issues encountered with gcloud and the python ee module are found in the `CommonIssues.md` file in the same subdirectory.

This repository is covered by the MIT use license. We request that all downstream uses of this work be available to the public when possible.

--- 

# Testing/Maintenance Phases:

## landsat_c2

*Contact: B Steele (b.steele@colostate.edu)*

*Status: __Testing/Maintenance__*

Scripts for acquiring Landsat 4-9 Collection 2 Level 2 surface reflectance and surface temperature stacks using the Python GEE API. See the README in this subdirectory for details.

# Development Phases:

## HLS 

*Contact: B Steele*

*Status: Development*

Scripts for accessing, downloading, and processing HLS (Harmonized Landsat-Sentinel) data.

## espa_download

*Contact: B Steele*

*Status: Development*

Quick how-to use the bulk downloader for ESPA (for downloads of things like the provisional aquatic refelectance product)

## LDAS_data_rods

*Contact: B Steele*

*Status: Development*

This script was moved out of the Yojoa workflow, as the data were not complete for that location. The current script is to acquire GLDAS data, but could be easily adapted for NLDAS or MERRA data per the NASA data rods website (linked in script).
