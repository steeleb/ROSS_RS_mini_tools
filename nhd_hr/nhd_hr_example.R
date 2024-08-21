library(arcgis)
library(nhdplusTools)
library(sf)

# just a quick method for querying nhdplushr without using the nhdplusTools that
# requires downloading.

# you could query for any AOI, but heres an example using a random huc8
huc8 <- "04010301"

# note, aoi must be of a certain class, sfc is acceptable!
huc8_feat <- get_huc(id = huc8, type = "huc08") %>%
  st_as_sfc()

nhd_plus_hr_url <- "https://hydro.nationalmap.gov/arcgis/rest/services/NHDPlus_HR/MapServer"

# open the nhd_hr - which contains a bunch of layers
nhd_hr <- arc_open(nhd_plus_hr_url)

#list the layers of the nhdhr object
list_items(nhd_hr)

# select the layer by id from the items list called above.
nhd_hr_waterbody <- get_layer(nhd_hr, 9)

fields <- list_fields(nhd_hr_waterbody)
View(fields)

# you can use SQL-style queries to make this smaller - you have to use the alias
# field here.
query <- "Ftype = 390 AND AreaSqKm > 0.1"

# and use that query and bbox to limit the waterbodies (or whatever layer) and
# return a sf object
huc_wbd <- arc_select(nhd_hr_waterbody,
                      where = query,
                      filter_geom = huc8_feat,
                      crs = st_crs(huc8_feat))

