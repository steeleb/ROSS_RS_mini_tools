// B. Steele        //
// Data Scientist   //
// ROSSyndicate     //
// Colorado State University    //
// b.steele@colostate.edu   //

// read in collections
var l9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2');
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2');
var l7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2');
var l5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2');
var l4 = ee.ImageCollection('LANDSAT/LT04/C02/T1_L2');

//-----------------------------------------------------------//
// HARMONIZING ACROSS MISSIONS //
// dummy bands
//need to create some extra bands for ls 4, 5 and 7 so that they play nice with ls8/9
var dummyBands = ee.Image(-99).rename('Null_CS')
    .addBands(ee.Image(-99).rename('Null_TIR2'))
    .addBands(ee.Image(-99).rename('aerosol_qa'));

function addDummy(i) {
  return i.addBands(dummyBands);
}

// # dummy band sr_cloud_qa for ls 8/9 to play nice with 5/7
var cloudqa = ee.Image(-99).rename('cloud_qa');

function addCloudQA(i) {
  return i.addBands(cloudqa);
}

// scale SR and ST -- SR used in DSWE calc //
function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
  return image.addBands(opticalBands, null, true)
    .addBands(thermalBands, null, true);
}


// map scaling factors and add dummmy bands
var l9 = l9.map(applyScaleFactors).map(addCloudQA);
var l8 = l8.map(applyScaleFactors).map(addCloudQA);
var l7 = l7.map(applyScaleFactors).map(addDummy);
var l5 = l5.map(applyScaleFactors).map(addDummy);
var l4 = l4.map(applyScaleFactors).map(addDummy);

// existing band names
var bn89 = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7', 'ST_B10', 'QA_PIXEL', 'cloud_qa', 'SR_QA_AEROSOL', 'QA_RADSAT', 'ST_QA'];
var bn457 = ['Null_CS', 'SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7', 'ST_B6', 'QA_PIXEL', 'SR_CLOUD_QA', 'aerosol_qa', 'QA_RADSAT', 'ST_QA'];
// new band names
var bns = ['Aerosol','Blue', 'Green', 'Red', 'Nir', 'Swir1', 'Swir2', 'SurfTemp','pixel_qa', 'cloud_qa', 'aerosol_qa', 'radsat_qa', 'temp_qa'];
  
// rename bands  
var ls4 = l4.select(bn457, bns);
var ls5 = l5.select(bn457, bns);
var ls7 = l7.select(bn457, bns);
var ls8 = l8.select(bn89, bns);
var ls9 = l9.select(bn89, bns);

// merge collections by image processing groups
// temp can be processed together    
//var ls = ee.ImageCollection(ls4.merge(ls5).merge(ls7).merge(ls8).merge(ls9)).select(['SurfTemp', 'pixel_qa', 'temp_qa']);
// do a reality check to see how many unique scenes are here.    
//print(ls.aggregate_count('LANDSAT_PRODUCT_ID').getInfo()); 



//--------------------------//
// MASKING FUNCTIONS FOR QA //
// Filter for water, remove cloud, cloud shadow, snow
function cfMask(image) {
  var qa = image.select('pixel_qa');
  var water = qa.bitwiseAnd(1 << 7); //water
  var cloudqa = qa.bitwiseAnd(1 << 1) //dialated clouds
    .where(qa.bitwiseAnd(1 << 2), ee.Image(2)) //cirrus clouds
    .where(qa.bitwiseAnd(1 << 3), ee.Image(3)) //cloud
    .where(qa.bitwiseAnd(1 << 4), ee.Image(4)) //cloud shadow
    .where(qa.bitwiseAnd(1 << 5), ee.Image(5)); //snow
  var qaMask = cloudqa.eq(0); //select where there are no clouds or snow/ice
  return image.updateMask(qaMask).updateMask(water);
}

// Apply cfMask
//var ls_water = ls.map(cfMask);
var ls4_water = ls4.map(cfMask);
var ls5_water = ls5.map(cfMask); // lots of non-water pixels here
var ls7_water = ls7.map(cfMask); // lots of non-water pixels here
var ls8_water = ls8.map(cfMask); // some non-water pixels here
var ls9_water = ls9.map(cfMask);

// Filter for temp uncertainty <2degK
function tempMask(image) {
  var temperr = image.select('temp_qa');
  var tMask = temperr.lte(200); //this band is scaled by 0.01
  return image.updateMask(tMask);
}

//Apply temp uncertainty filter
//var ls_water = ls_water.map(tempMask);
var ls4_water = ls4_water.map(tempMask);
var ls5_water = ls5_water.map(tempMask); 
var ls7_water = ls7_water.map(tempMask); 
var ls8_water = ls8_water.map(tempMask); 
var ls9_water = ls9_water.map(tempMask);




//------------------------------------------------------//
// DSWE functions (from Sam Sillen, adpated from S Topp)
// must use image expression, otherwise too many false negatives!
function Mndwi(image){ 
  return(image
  .expression('(GREEN - SWIR1) / (GREEN + SWIR1)', {
    'GREEN': image.select(['Green']),
    'SWIR1': image.select(['Swir1'])
  }));
}

//Multi-band Spectral Relationship Visible
function Mbsrv(image){
  return(image.select(['Green']).add(image.select(['Red'])).rename('mbsrv'));
}

//Multi-band Spectral Relationship Near infrared
function Mbsrn(image){
  return(image.select(['Nir']).add(image.select(['Swir1'])).rename('mbsrn'));
}

//Normalized Difference Vegetation Index
function Ndvi(image){
  return(image
  .expression('(NIR - RED) / (NIR + RED)', {
    'RED': image.select(['Red']),
    'NIR': image.select(['Nir'])
  }));
}

//Automated Water Extent Shadow
function Awesh(image){
  return(image
  .expression('Blue + 2.5 * Green + (-1.5) * mbsrn + (-0.25) * Swir2', {
    'Blue': image.select(['Blue']),
    'Green': image.select(['Green']),
    'mbsrn': Mbsrn(image).select(['mbsrn']),
    'Swir2': image.select(['Swir2'])
  }));
}

//Dynamic Surface Water Extent Calculation
function Dswe(i){
  var mndwi = Mndwi(i);
  var mbsrv = Mbsrv(i);
  var mbsrn = Mbsrn(i);
  var awesh = Awesh(i);
  var swir1 = i.select(['Swir1']);
  var nir = i.select(['Nir']);
  var ndvi = Ndvi(i);
  var blue = i.select(['Blue']);
  var swir2 = i.select(['Swir2']);
  
  // These thresholds are taken from the LS Collection 2 DSWE Data Format Control Book:
  // (https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/media/files/LSDS-2042_LandsatC2_L3_DSWE_DFCB-v2.pdf)
  // Inputs are meant to be scaled reflectance values 

  var t1 = mndwi.gt(0.124); // MNDWI greater than Wetness Index Threshold
  var t2 = mbsrv.gt(mbsrn); // MBSRV greater than MBSRN
  var t3 = awesh.gt(0); //AWESH greater than 0
  var t4 = (mndwi.gt(-0.44)  //Partial Surface Water 1 thresholds
   .and(swir1.lt(0.09)) //900 for no scaling (LS Collection 1)
   .and(nir.lt(0.15)) //1500 for no scaling (LS Collection 1)
   .and(ndvi.lt(0.7)));
  var t5 = (mndwi.gt(-0.5) //Partial Surface Water 2 thresholds
   .and(blue.lt(0.1)) //1000 for no scaling (LS Collection 1)
   .and(swir1.lt(0.3)) //3000 for no scaling (LS Collection 1)
   .and(swir2.lt(0.1)) //1000 for no scaling (LS Collection 1)
   .and(nir.lt(0.25))); //2500 for no scaling (LS Collection 1)
  
  var t = (t1
    .add(t2.multiply(10))
    .add(t3.multiply(100))
    .add(t4.multiply(1000))
    .add(t5.multiply(10000)));
  
  var noWater = (t.eq(0)
   .or(t.eq(1))
   .or(t.eq(10))
   .or(t.eq(100))
   .or(t.eq(1000)));
  var hWater = (t.eq(1111)
   .or(t.eq(10111))
   .or(t.eq(11011))
   .or(t.eq(11101))
   .or(t.eq(11110))
   .or(t.eq(11111)));
  var mWater = (t.eq(111)
   .or(t.eq(1011))
   .or(t.eq(1101))
   .or(t.eq(1110))
   .or(t.eq(10011))
   .or(t.eq(10101))
   .or(t.eq(10110))
   .or(t.eq(11001))
   .or(t.eq(11010))
   .or(t.eq(11100)));
  var pWetland = t.eq(11000);
  var lWater = (t.eq(11)
   .or(t.eq(101))
   .or(t.eq(110))
   .or(t.eq(1001))
   .or(t.eq(1010))
   .or(t.eq(1100))
   .or(t.eq(10000))
   .or(t.eq(10001))
   .or(t.eq(10010))
   .or(t.eq(10100)));

  var iDswe = (noWater.multiply(0)
   .add(hWater.multiply(1))
   .add(mWater.multiply(2))
   .add(pWetland.multiply(3))
   .add(lWater.multiply(4)));
  
  return iDswe.rename('dswe');
}

//------------------------------------------------------//
// Create function to apply dswe as mask
function applyDSWE(image){
  var dswe = Dswe(image);
  var DSWEmask = image.addBands(dswe)
    .updateMask(dswe.eq(1));
  return DSWEmask;
}

//Apply DSWE mask
//var ls_dswe = ls_water.map(applyDSWE);
var ls4_dswe = ls4_water.map(applyDSWE);
var ls5_dswe = ls5_water.map(applyDSWE);
var ls7_dswe = ls7_water.map(applyDSWE);
var ls8_dswe = ls8_water.map(applyDSWE);
var ls9_dswe = ls9_water.map(applyDSWE);


// VISUALIZE TO CHECK WORK //
var heat = {
  bands: ['SurfTemp'],
  min: 250,
  max: 320,
};

Map.setCenter(-105.15, 40.55, 15);

Map.addLayer(ls4_dswe, heat, 'LS4 Temp Heat Map');
Map.addLayer(ls5_dswe, heat, 'LS5 Temp Heat Map');// still a lot of non water here
Map.addLayer(ls7_dswe, heat, 'LS7 Temp Heat Map');// still alot of non-water here
Map.addLayer(ls8_dswe, heat, 'LS8 Temp Heat Map');// some non-water here
Map.addLayer(ls9_dswe, heat, 'LS9 Temp Heat Map');
