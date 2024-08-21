# ROSS_mini_tools

Useful R tools created by the ROSSyndicate. All subdirectories are under development unless otherwise stated. 

Suggested cloning method is available in the file `CloningWorkflows.md` in the 'helps' subdirectory. Common issues encountered with gcloud and the python ee module are found in the `CommonIssues.md` file in the same subdirectory.

This repository is covered by the MIT use license. We request that all downstream uses of this work be available to the public when possible.

--- 

# Development Phases:

## HLS 

Scripts for accessing, downloading, and processing HLS (Harmonized Landsat-Sentinel) data.

## espa_download

Quick how-to use the bulk downloader for ESPA (for downloads of things like the provisional aquatic refelectance product)

## LDAS_data_rods

This script was moved out of the Yojoa workflow, as the data were not complete for that location. The current script is to acquire GLDAS data, but could be easily adapted for NLDAS or MERRA data per the NASA data rods website (linked in script).

## nhd_hr

A script showing an alternative mechanism for querying the NHDPlusHR using the REST MapServer. This is a quicker alternative for querying {sf} objects without downloading 
the NHDPlusHR using {nhdplusTools}.
