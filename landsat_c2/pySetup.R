# a verbose version of this script exists in the pySetup.Rmd file

library('reticulate')
library('tidyverse')
try(install_miniconda())
py_install(c('earthengine-api', 'pandas', 'fiona'))

#grab your current WD
dir = getwd()

#create a conda environment named 'apienv' with the packages you need
conda_create(envname = file.path(dir, 'env'),
             packages = c('earthengine-api', 'pandas', 'fiona'))
Sys.setenv(RETICULATE_PYTHON = file.path(dir, 'env/bin/python/'))
use_condaenv("env/")
#print the configuration
py_config()

#check install
py_install(packages = c('earthengine-api', 'pandas', 'fiona'), envname = 'env/')
