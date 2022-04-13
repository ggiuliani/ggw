// Author: Lucas Descombes
// Supervision: Gregory Giuliani & Bocar Sy
// Version: 1.0.0
// Date: 13.04.2022
// GEE analysis script on the African Great Green Wall (GGW)

// region of interest, handmade
var ROI = GMV_line.buffer(10000);

Map.addLayer(ROI,{},"ROI")

//Each Country, with the LSIB simplified dataset  
var Senegal =  Countries.filterMetadata("country_co","equals","SG");
var Mauritanie = Countries.filterMetadata("country_co","equals","MR");
var Mali = Countries.filterMetadata("country_co","equals","ML");
var BF = Countries.filterMetadata("country_co","equals","UV");
var Niger = Countries.filterMetadata("country_co","equals","NG");
var Nigeria = Countries.filterMetadata("country_co","equals","NI");
var Cameroun = Countries.filterMetadata("country_co","equals","CM")
var Tchad = Countries.filterMetadata("country_co","equals","CD");
var Soudan = Countries.filterMetadata("country_co","equals","SU");
var Erythree = Countries.filterMetadata("country_co","equals","ER");
var Ethiopie = Countries.filterMetadata("country_co","equals","ET");
var Djibouti = Countries.filterMetadata("country_co","equals","DJ");

// part of the GMV for each Country
var GMV_Senegal = ROI.intersection({'right': Senegal, 'maxError': 1});
var GMV_Mauritanie = ROI.intersection({'right': Mauritanie, 'maxError': 1});
var GMV_Mali = ROI.intersection({'right': Mali, 'maxError': 1});
var GMV_BF = ROI.intersection({'right': BF, 'maxError': 1});
var GMV_Nigeria = ROI.intersection({'right': Nigeria, 'maxError': 1});
var GMV_Niger = ROI.intersection({'right': Niger, 'maxError': 1});
var GMV_Cameroun = ROI.intersection({'right': Cameroun, 'maxError': 1});
var GMV_Tchad = ROI.intersection({'right': Tchad, 'maxError': 1});
var GMV_Soudan = ROI.intersection({'right': Soudan, 'maxError': 1});
var GMV_Erythree = ROI.intersection({'right': Erythree, 'maxError': 1});
var GMV_Ethiopie = ROI.intersection({'right': Ethiopie, 'maxError': 1});
var GMV_Djibouti = ROI.intersection({'right': Djibouti, 'maxError': 1});

// part of the Sahel for each Country
var Sahel_Senegal = Sahel.intersection({'right': Senegal, 'maxError': 1});
var Sahel_Mauritanie = Sahel.intersection({'right': Mauritanie, 'maxError': 1});
var Sahel_Mali = Sahel.intersection({'right': Mali, 'maxError': 1});
var Sahel_BF = Sahel.intersection({'right': BF, 'maxError': 1});
var Sahel_Niger = Sahel.intersection({'right': Niger, 'maxError': 1});
var Sahel_Nigeria = Sahel.intersection({'right': Nigeria, 'maxError': 1});
var Sahel_Cameroun = Sahel.intersection({'right': Cameroun, 'maxError': 1});
var Sahel_Tchad = Sahel.intersection({'right': Tchad, 'maxError': 1});
var Sahel_Soudan = Sahel.intersection({'right': Soudan, 'maxError': 1});
var Sahel_Erythree = Sahel.intersection({'right': Erythree, 'maxError': 1});
var Sahel_Ethiopie = Sahel.intersection({'right': Ethiopie, 'maxError': 1}); //no Sahel in this country 
var Sahel_Djibouti = Sahel.intersection({'right': Djibouti, 'maxError': 1}); //no Sahel in this country

// the image collection filter with ROI, date and cloud cover
var l7collection = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR")
.filterBounds(ROI)
.filterDate('2007-01-01', '2020-12-31')
.filterMetadata("CLOUD_COVER", "less_than", 30);

// ImageCollection for the precipitation
var RainCol = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD")
.filter(ee.Filter.date("2007-01-01","2020-12-31"));

// Function for add a NDVI band for each image of the collection
var getNDVI = function(img){
  return img.addBands(img.normalizedDifference(['B4','B3']).rename('NDVI'))
};

var getNDVIl8 = function (img){
  return img.addBands(img.normalizedDifference(["B5","B4"]).rename("NDVI"))
};

//    CLOUD MASK
//we use the pixel_qa band to detect and mask the cloud/shadow Cloud pixel.
//Only High percentage is use here (bit with a score of 3 for cloud confidence and cloud shadow confidence)

var cloudMask = function(image) {
  var qa = image.select('pixel_qa');
  // If the cloud bit (5) is set and the cloud confidence (6) is high 
  // or the cloud shadow bit is set (3), then it's a bad pixel.
  var cloud = qa.bitwiseAnd(1 << 5).and(qa.bitwiseAnd(11 << 6))
                  .or(qa.bitwiseAnd(1 << 3));
  // Remove edge pixels that don't occur in all bands
  var mask2 = image.mask().reduce(ee.Reducer.min());
  return image.updateMask(cloud.not()).updateMask(mask2);
};

// NDVI:One image for each year with the mean for each pixel and for each band 

var GMV2007=l7collection.filterDate("2007-1-1","2007-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2008=l7collection.filterDate("2008-1-1","2008-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2009=l7collection.filterDate("2009-1-1","2009-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2010=l7collection.filterDate("2010-1-1","2010-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2011=l7collection.filterDate("2011-1-1","2011-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2012=l7collection.filterDate("2012-1-1","2012-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2013=l7collection.filterDate("2013-1-1","2013-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2014=l7collection.filterDate("2014-1-1","2014-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2015=l7collection.filterDate("2015-1-1","2015-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2016=l7collection.filterDate("2016-1-1","2016-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2017=l7collection.filterDate("2017-1-1","2017-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2018=l7collection.filterDate("2018-1-1","2018-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2019=l7collection.filterDate("2019-1-1","2019-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMV2020=l7collection.filterDate("2020-1-1","2020-12-31").map(cloudMask).map(getNDVI).mean().clip(ROI);
var GMVall = l7collection.map(cloudMask).map(getNDVI); 

// Precipitation: One image for each year with the mean for each pixel and for each band, use for histogram 
var GMV2007Rain=RainCol.filterDate("2007-1-1","2007-12-31").mean().clip(ROI);
var GMV2008Rain=RainCol.filterDate("2008-1-1","2008-12-31").mean().clip(ROI);
var GMV2009Rain=RainCol.filterDate("2009-1-1","2009-12-31").mean().clip(ROI);
var GMV2010Rain=RainCol.filterDate("2010-1-1","2010-12-31").mean().clip(ROI);
var GMV2011Rain=RainCol.filterDate("2011-1-1","2011-12-31").mean().clip(ROI);
var GMV2012Rain=RainCol.filterDate("2012-1-1","2012-12-31").mean().clip(ROI);
var GMV2013Rain=RainCol.filterDate("2013-1-1","2013-12-31").mean().clip(ROI);
var GMV2014Rain=RainCol.filterDate("2014-1-1","2014-12-31").mean().clip(ROI);
var GMV2015Rain=RainCol.filterDate("2015-1-1","2015-12-31").mean().clip(ROI);
var GMV2016Rain=RainCol.filterDate("2016-1-1","2016-12-31").mean().clip(ROI);
var GMV2017Rain=RainCol.filterDate("2017-1-1","2017-12-31").mean().clip(ROI);
var GMV2018Rain=RainCol.filterDate("2018-1-1","2018-12-31").mean().clip(ROI);
var GMV2019Rain=RainCol.filterDate("2019-1-1","2019-12-31").mean().clip(ROI);
var GMV2020Rain=RainCol.filterDate("2020-1-1","2020-12-31").mean().clip(ROI);

//NDVI Only ndvi band for each year,  use for histogram
var ndvi2007=GMV2007.select(["NDVI"])
var ndvi2008=GMV2008.select(["NDVI"])
var ndvi2009=GMV2009.select(["NDVI"])
var ndvi2010=GMV2010.select(["NDVI"])
var ndvi2011=GMV2011.select(["NDVI"])
var ndvi2012=GMV2012.select(["NDVI"])
var ndvi2013=GMV2013.select(["NDVI"])
var ndvi2014=GMV2014.select(["NDVI"])
var ndvi2015=GMV2015.select(["NDVI"])
var ndvi2016=GMV2016.select(["NDVI"])
var ndvi2017=GMV2017.select(["NDVI"])
var ndvi2018=GMV2018.select(["NDVI"])
var ndvi2019=GMV2019.select(["NDVI"])
var ndvi2020=GMV2020.select(["NDVI"])
var ndviall= GMVall.select(["NDVI"])

// NDVI: Histogram, we check the number of pixel belonging to the different classes of value. 
var GMV2007Histogramme = ui.Chart.image.histogram(ndvi2007,ROI,300,20);
GMV2007Histogramme = GMV2007Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2007"});
var GMV2008Histogramme = ui.Chart.image.histogram(ndvi2008,ROI,300,20);
GMV2008Histogramme = GMV2008Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2008"});
var GMV2009Histogramme = ui.Chart.image.histogram(ndvi2009,ROI,300,20);
GMV2009Histogramme = GMV2009Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2009"});
var GMV2010Histogramme = ui.Chart.image.histogram(ndvi2010,ROI,300,20);
GMV2010Histogramme = GMV2010Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2010"});

var GMV2011Histogramme = ui.Chart.image.histogram(ndvi2011,ROI,300,20);
GMV2011Histogramme = GMV2011Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2011"});
var GMV2012Histogramme = ui.Chart.image.histogram(ndvi2012,ROI,300,20);
GMV2012Histogramme = GMV2012Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2012"});
var GMV2013Histogramme = ui.Chart.image.histogram(ndvi2013,ROI,300,20);
GMV2013Histogramme = GMV2013Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2013"});
var GMV2014Histogramme = ui.Chart.image.histogram(ndvi2014,ROI,300,20);
GMV2014Histogramme = GMV2014Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2014"});

var GMV2015Histogramme = ui.Chart.image.histogram(ndvi2015,ROI,300,20);
GMV2015Histogramme = GMV2015Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2015"});
var GMV2016Histogramme = ui.Chart.image.histogram(ndvi2016,ROI,300,20);
GMV2016Histogramme = GMV2016Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2016"});
var GMV2017Histogramme = ui.Chart.image.histogram(ndvi2017,ROI,300,20);
GMV2017Histogramme = GMV2017Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2017"});
var GMV2018Histogramme = ui.Chart.image.histogram(ndvi2018,ROI,300,20);
GMV2018Histogramme = GMV2018Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2018"});
var GMV2019Histogramme = ui.Chart.image.histogram(ndvi2019,ROI,300,20);
GMV2019Histogramme = GMV2019Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2019"});
var GMV2020Histogramme = ui.Chart.image.histogram(ndvi2020,ROI,300,20);
GMV2020Histogramme = GMV2020Histogramme.setOptions({title:"Histogramme du NDVI de la GMV 2020"});

//Precpipitation: Histogram, we check the number of pixel belonging to the different classes of value. 
var GMV2007HistogrammeRain = ui.Chart.image.histogram(GMV2007Rain,ROI,300,30);
GMV2007HistogrammeRain = GMV2007HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2007"});
var GMV2008HistogrammeRain = ui.Chart.image.histogram(GMV2008Rain,ROI,300,20);
GMV2008HistogrammeRain = GMV2008HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2008"});
var GMV2009HistogrammeRain = ui.Chart.image.histogram(GMV2009Rain,ROI,300,20);
GMV2009HistogrammeRain = GMV2009HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2009"});
var GMV2010HistogrammeRain = ui.Chart.image.histogram(GMV2010Rain,ROI,300,20);
GMV2010HistogrammeRain = GMV2010HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2010"});

var GMV2011HistogrammeRain = ui.Chart.image.histogram(GMV2011Rain,ROI,300,20);
GMV2011HistogrammeRain = GMV2011HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2011"});
var GMV2012HistogrammeRain = ui.Chart.image.histogram(GMV2012Rain,ROI,300,20);
GMV2012HistogrammeRain = GMV2012HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2012"});
var GMV2013HistogrammeRain = ui.Chart.image.histogram(GMV2013Rain,ROI,300,20);
GMV2013HistogrammeRain = GMV2013HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2013"});
var GMV2014HistogrammeRain = ui.Chart.image.histogram(GMV2014Rain,ROI,300,20);
GMV2014HistogrammeRain = GMV2014HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2014"});

var GMV2015HistogrammeRain = ui.Chart.image.histogram(GMV2015Rain,ROI,300,20);
GMV2015HistogrammeRain = GMV2015HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2015"});
var GMV2016HistogrammeRain = ui.Chart.image.histogram(GMV2016Rain,ROI,300,20);
GMV2016HistogrammeRain = GMV2016HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2016"});
var GMV2017HistogrammeRain = ui.Chart.image.histogram(GMV2017Rain,ROI,300,20);
GMV2017HistogrammeRain = GMV2017HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2017"});
var GMV2018HistogrammeRain = ui.Chart.image.histogram(GMV2018Rain,ROI,300,20);
GMV2018HistogrammeRain = GMV2018HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2018"});
var GMV2019HistogrammeRain = ui.Chart.image.histogram(GMV2019Rain,ROI,300,20);
GMV2019HistogrammeRain = GMV2019HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2019"});
var GMV2020HistogrammeRain = ui.Chart.image.histogram(GMV2020Rain,ROI,300,20);
GMV2020HistogrammeRain = GMV2020HistogrammeRain.setOptions({title:"Histogramme des précipitations de la GMV 2020"});

// NDVI TimeSerie : timeserie of the GMV's NDVI and Sahel's NDVI
//The GMV (and Sahel) is too big to have one timeserie for its whole length. We subdivide the GMV (Sahel) and do one timeserie per each country.
//change the name of the var / region / title for each country

var GMVTimeSerie_Senegal=ui.Chart.image.series({
  imageCollection: GMVall.select(["NDVI"]), 
  region: GMV_Senegal,
  reducer: ee.Reducer.mean(),
  scale:300,
  xProperty:'system:time_start', 
  })
  .setChartType('LineChart')
        .setOptions({
          title: 'Average NDVI Value by Date for GMV_Senegal',
          legend: {position: 'right', textStyle: { fontSize: 22}},
          hAxis: {title: 'Date',textStyle:{fontSize: 20}},
          vAxis: {title: "NDVI_Value",textStyle:{fontSize: 20}},
          lineWidth: 2,
          colors: ["1ebc20"],
          trendlines: {
            0: {  // add a trend line to the 1st series
            type: 'linear',  
            color: 'purple',
            lineWidth: 2,
            opacity: 0.7,
            visibleInLegend: true,
            showR2: true,
            }}
        });

//print(GMVTimeSerie_Senegal)


//Precipitation TimeSerie : timeserie of the GMV's precipitation and Sahel's precipitation
//The GMV (and Sahel) is too big to have one timeserie for its whole length. We subdivide the GMV (Sahel) and do one timeserie per each country.
//change the name of the var / region / title for each country

var GMVTimeSerie_Senegal=ui.Chart.image.series({
  imageCollection: RainCol, 
  region: GMV_Ethiopie,
  reducer: ee.Reducer.mean(),
  scale:300,
  xProperty:'system:time_start', 
  })
  .setChartType('LineChart')
        .setOptions({
          title: 'Average precipitation  by Date for GGW_Ethiopia',
          legend: {position: 'right', textStyle: { fontSize: 22}},
          hAxis: {title: 'Date',textStyle:{fontSize: 20}},
          vAxis: {title: "Precipitation",textStyle:{fontSize: 20}},
          lineWidth: 2,
          colors: ["0bb6ff"],
          trendlines: {
            0: {  // add a trend line to the 1st series
            type: 'linear',  
            color: 'red',
            lineWidth: 2,
            opacity: 0.7,
            visibleInLegend: true,
            showR2: true,
            }}
        });

//print(GMVTimeSerie_Senegal)


///////////////// TimeSerie for 1999-2006

//NDVI: the image collection filter with ROI, date and cloud cover
var l7collection9906 = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR")
.filterBounds(ROI)
.filterDate('1999-01-01', '2006-12-31')
.filterMetadata("CLOUD_COVER", "less_than", 30);

var GMVall_9906 = l7collection9906.map(cloudMask).map(getNDVI); 

// Precipitation: the image collection filter with date 
var RainCol_9906 = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD")
.filter(ee.Filter.date("1999-01-01","2006-12-31"));

//TimeSerie for NDVI
var GMVTimeSerie9906=ui.Chart.image.series({
  imageCollection: GMVall_9906.select(["NDVI"]), 
  region: GMV_Cameroun,
  reducer: ee.Reducer.mean(),
  scale:300,
  xProperty:'system:time_start', 
  })
  .setChartType('LineChart')
        .setOptions({
          title: 'Average NDVI Value by Date for GMV_Cameroun',
          legend: {position: 'right', textStyle: { fontSize: 22}},
          hAxis: {title: 'Date',textStyle:{fontSize: 20}},
          vAxis: {title: "NDVI_Value",textStyle:{fontSize: 20}},
          lineWidth: 2,
          colors: ["1ebc20"],
          trendlines: {
            0: {  // add a trend line to the 1st series
            type: 'linear',  
            color: 'purple',
            lineWidth: 2,
            opacity: 0.7,
            visibleInLegend: true,
            showR2: true,
            }}
        });



//print(GMVTimeSerie9906)

//TimeSerie for precipitation_9906

var GMVTimeSerie9906=ui.Chart.image.series({
  imageCollection: RainCol_9906, 
  region: GMV_Ethiopie,
  reducer: ee.Reducer.mean(),
  scale:300,
  xProperty:'system:time_start', 
  })
  .setChartType('LineChart')
        .setOptions({
          title: 'Average precipitation  by Date for GGW_Ethiopia',
          legend: {position: 'right', textStyle: { fontSize: 22}},
          hAxis: {title: 'Date',textStyle:{fontSize: 20}},
          vAxis: {title: "Precipitation",textStyle:{fontSize: 20}},
          lineWidth: 2,
          colors: ["0bb6ff"],
          trendlines: {
            0: {  // add a trend line to the 1st series
            type: 'linear',  
            color: 'red',
            lineWidth: 2,
            opacity: 0.7,
            visibleInLegend: true,
            showR2: true,
            }}
        });



//print(GMVTimeSerie9906)

// NDVI and precipitation:  Data per country and for Sahel_country

// We want the data for 2006 and 2020 per country

var l7Collection2006=ee.ImageCollection("LANDSAT/LE07/C01/T1_SR")
.filterDate("2006-01-01","2006-12-31")
.filterMetadata("CLOUD_COVER","less_than",30);

var l8Collection=ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
.filterDate("2020-01-01","2020-12-31")
.filterMetadata("CLOUD_COVER","less_than",30);

var RainCollection06 = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD")
.filter(ee.Filter.date("2006-01-01","2006-12-31"));

var RainCollection20 = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD")
.filter(ee.Filter.date("2020-01-01","2020-12-31"));

//   Map of the Difference of NDVI per Country + Sahel_country + GMV_Country (also for precipitation) 2006 and 2020

//Senegal
var Senegal2006 =l7Collection2006.filterBounds(Senegal).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Senegal);
var Senegal2020l8 = l8Collection.filterBounds(Senegal).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Senegal);
var DiffSenegal0620 = Senegal2020l8.subtract(Senegal2006);
//Map.addLayer(DiffSenegal0620,visParams,"DiffSenegal");

var Sahel_Senegal2006=Senegal2006.select(["NDVI"]).clip(Sahel);
var Sahel_Senegal2020=Senegal2020l8.select(["NDVI"]).clip(Sahel);

var GMV_Senegal2006 = Senegal2006.select(["NDVI"]).clip(GMV_Senegal);
var GMV_Senegal2020l8 = Senegal2020l8.select(["NDVI"]).clip(GMV_Senegal);

//Mauritanie
var Mauritanie2006 = l7Collection2006.filterBounds(Mauritanie).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Mauritanie);
var Mauritanie2020l8 = l8Collection.filterBounds(Mauritanie).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Mauritanie);

var Sahel_Mauritanie2006=Mauritanie2006.select(["NDVI"]).clip(Sahel);
var Sahel_Mauritanie2020=Mauritanie2020l8.select(["NDVI"]).clip(Sahel);

var GMV_Mauritanie2006 = Mauritanie2006.select(["NDVI"]).clip(GMV_Mauritanie);
var GMV_Mauritanie2020l8 = Mauritanie2020l8.select(["NDVI"]).clip(GMV_Mauritanie);
var DiffMauritanie0620 = Mauritanie2020l8.subtract(Mauritanie2006);
//Map.addLayer(DiffMauritanie0620,visParams,"DiffMauritanie");

//Mali
var Mali2006 = l7Collection2006.filterBounds(Mali).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Mali);
var Mali2020l8 =l8Collection.filterBounds(Mali).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Mali);

var Sahel_Mali2006=Mali2006.select(["NDVI"]).clip(Sahel);
var Sahel_Mali2020=Mali2020l8.select(["NDVI"]).clip(Sahel);

var GMV_Mali2006 = Mali2006.select(["NDVI"]).clip(GMV_Mali);
var GMV_Mali2020l8 = Mali2020l8.select(["NDVI"]).clip(GMV_Mali);
var DiffMali0620 = Mali2020l8.subtract(Mali2006);
//Map.addLayer(DiffMali0620,visParams,"DiffMali");

//BF
var BF2006 = l7Collection2006.filterBounds(BF).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(BF);
var BF2020l8 = l8Collection.filterBounds(BF).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(BF);
var Sahel_BF2006=BF2006.select(["NDVI"]).clip(Sahel);
var Sahel_BF2020=BF2020l8.select(["NDVI"]).clip(Sahel);
var GMV_BF2006 = BF2006.select(["NDVI"]).clip(GMV_BF);
var GMV_BF2020l8 =BF2020l8.select(["NDVI"]).clip(GMV_BF);
var DiffBF0620 = BF2020l8.subtract(BF2006);
//Map.addLayer(DiffBF0620,visParams,"DiffBF");

//Niger
var Niger2006 = l7Collection2006.filterBounds(Niger).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Niger);
var Niger2020l8 = l8Collection.filterBounds(Niger).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Niger);
var Sahel_Niger2006=Niger2006.select(["NDVI"]).clip(Sahel);
var Sahel_Niger2020=Niger2020l8.select(["NDVI"]).clip(Sahel);
var GMV_Niger2006 = Niger2006.select(["NDVI"]).clip(GMV_Niger);
var GMV_Niger2020l8 = Niger2020l8.clip(GMV_Niger);
var DiffNiger0620 = Niger2020l8.subtract(Niger2006);
//Map.addLayer(DiffNiger0620,visParams,"DiffNiger");

//Nigeria
var Nigeria2006 = l7Collection2006.filterBounds(Nigeria).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Nigeria);
var Nigeria2020l8 = l8Collection.filterBounds(Nigeria).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Nigeria);
var Sahel_Nigeria2006=Nigeria2006.select(["NDVI"]).clip(Sahel);
var Sahel_Nigeria2020=Nigeria2020l8.select(["NDVI"]).clip(Sahel);
var GMV_Nigeria2006 = Nigeria2006.clip(GMV_Nigeria);
var GMV_Nigeria2020l8 = Nigeria2020l8.clip(GMV_Nigeria);
var DiffNigeria0620 = Nigeria2020l8.subtract(Nigeria2006);
//Map.addLayer(DiffNigeria0620,visParams,"DiffNigeria");

//Cameroun
var Cameroun2006 = l7Collection2006.filterBounds(Cameroun).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Cameroun);
var Cameroun2020l8 = l8Collection.filterBounds(Cameroun).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Cameroun);
var Sahel_Cameroun2006=Cameroun2006.select(["NDVI"]).clip(Sahel);
var Sahel_Cameroun2020=Cameroun2020l8.select(["NDVI"]).clip(Sahel);
var GMV_Cameroun2006 = Cameroun2006.clip(GMV_Cameroun);
var GMV_Cameroun2020l8 = Cameroun2020l8.clip(GMV_Cameroun);
var DiffCameroun0620 = Cameroun2020l8.subtract(Cameroun2006);
//Map.addLayer(DiffCameroun0620,visParams,"DiffCameroun");

//Tchad
var Tchad2006 = l7Collection2006.filterBounds(Tchad).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Tchad);
var Tchad2020l8 = l8Collection.filterBounds(Tchad).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Tchad);
var Sahel_Tchad2006=Tchad2006.select(["NDVI"]).clip(Sahel);
var Sahel_Tchad2020=Tchad2020l8.select(["NDVI"]).clip(Sahel);
var GMV_Tchad2006 = Tchad2006.clip(GMV_Tchad);
var GMV_Tchad2020l8 = Tchad2020l8.clip(GMV_Tchad);
var DiffTchad0620 = Tchad2020l8.subtract(Tchad2006);
//Map.addLayer(DiffTchad0620,visParams,"DiffTchad");

//Soudan
var Soudan2006 = l7Collection2006.filterBounds(Soudan).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Soudan);
var Soudan2020l8 = l8Collection.filterBounds(Soudan).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Soudan);
var Sahel_Soudan2006=Soudan2006.select(["NDVI"]).clip(Sahel);
var Sahel_Soudan2020=Soudan2020l8.select(["NDVI"]).clip(Sahel);
var GMV_Soudan2006 = Soudan2006.clip(GMV_Soudan);
var GMV_Soudan2020l8 = Soudan2020l8.clip(GMV_Soudan);
var DiffSoudan0620 = Soudan2020l8.subtract(Soudan2006);
//Map.addLayer(DiffSoudan0620,visParams,"DiffSoudan");

//Erythree
var Erythree2006 = l7Collection2006.filterBounds(Erythree).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Erythree);
var Erythree2020l8 = l8Collection.filterBounds(Erythree).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Erythree);
var Sahel_Erythree2006=Erythree2006.select(["NDVI"]).clip(Sahel);
var Sahel_Erythree2020=Erythree2020l8.select(["NDVI"]).clip(Sahel);
var GMV_Erythree2006 = Erythree2006.clip(GMV_Erythree);
var GMV_Erythree2020l8 = Erythree2020l8.clip(GMV_Erythree);
var DiffErythree0620 = Erythree2020l8.subtract(Erythree2006);
//Map.addLayer(DiffErythree0620,visParams,"DiffErythree");

//Ethiopie, here no sahel
var Ethiopie2006 = l7Collection2006.filterBounds(Ethiopie).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Ethiopie);
var Ethiopie2020l8 = l8Collection.filterBounds(Ethiopie).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Ethiopie);
var GMV_Ethiopie2006 = Ethiopie2006.clip(GMV_Ethiopie);
var GMV_Ethiopie2020l8 = Ethiopie2020l8.clip(GMV_Ethiopie);
var DiffEthiopie0620 = Ethiopie2020l8.subtract(Ethiopie2006);
//Map.addLayer(DiffEthiopie0620,visParams,"DiffEthiopie");

//Djibouti, here no sahel
var Djibouti2006 = l7Collection2006.filterBounds(Djibouti).map(cloudMask).map(getNDVI).select(["NDVI"]).mean().clip(Djibouti);
var Djibouti2020l8 = l8Collection.filterBounds(Djibouti).map(cloudMask).map(getNDVIl8).select(["NDVI"]).mean().clip(Djibouti);
var GMV_Djibouti2006 = Djibouti2006.clip(GMV_Djibouti);
var GMV_Djibouti2020l8 = Djibouti2020l8.clip(GMV_Djibouti);
var DiffDjibouti0620 = Djibouti2020l8.subtract(Djibouti2006);
//Map.addLayer(DiffDjibouti0620,visParams,"DiffDjibouti");


//       mean annual value per country for the NDVI (2006-2020) 
var meanSenegal2006 = Mali2006.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: Mali.geometry(),
  scale: 300,
  maxPixels: 1e11
});
var meanSenegal2020 = Mali2020l8.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: Mali.geometry(),
  scale: 300,
  maxPixels: 1e11
});
var meanMauritanie2006 = Djibouti2006.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: Djibouti.geometry(),
  scale: 300,
  maxPixels: 1e11
});
var meanMauritanie2020 = Djibouti2020l8.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: Djibouti.geometry(),
  scale: 300,
  maxPixels: 1e11
});

//     mean annual value for Sahel_country (NDVI)
var meanSahel_Senegal2006 = Sahel_Erythree2006.reduceRegion({
  reducer: ee.Reducer.mean(),
  //geometry: Sahel_Mali2007.geometry(),
  scale: 300,
  maxPixels: 1e11
});
//print(meanSahel_Senegal2006,"Sahel_Erythree2006_L7");  

var meanSahel_Senegal2020 = Sahel_Erythree2020.reduceRegion({
  reducer: ee.Reducer.mean(),
  //geometry: Sahel_Mali2007.geometry(),
  scale: 300,
  maxPixels: 1e11
});
//print(meanSahel_Senegal2020,"Sahel_Erythree2020_L8"); 

//      mean annual value for GMV_country (NDVI and Precipitation)
var meanGMV_Senegal2006 = GMV_Djibouti2006.reduceRegion({
  reducer: ee.Reducer.mean(),
  //geometry: GMV_Senegal.geometry(),
  scale: 300,
  maxPixels: 1e11
});
//print(meanGMV_Senegal2006,"GMV_Djibouti2006_L7");  

var meanGMV_Senegal2020 = GMV_Djibouti2020l8.reduceRegion({
  reducer: ee.Reducer.mean(),
  //geometry: GMV_Senegal.geometry(),
  scale: 300,
  maxPixels: 1e11
});
//print(meanGMV_Senegal2020,"GMV_Djibouti2020_L8"); 

var PrecSenegal2006 = RainCollection06.filterBounds(Senegal).mean().clip(GMV_Senegal);
var PrecSenegal2020 = RainCollection20.filterBounds(Senegal).mean().clip(GMV_Senegal);

var MeanPrecSenegal06 = PrecSenegal2006.reduceRegion({
  reducer: ee.Reducer.mean(),
  //geometry: GMV_Senegal.geometry(),
  scale: 300,
  maxPixels: 1e11
});
var MeanPrecSenegal20 = PrecSenegal2020.reduceRegion({
  reducer: ee.Reducer.mean(),
  //geometry: GMV_Senegal.geometry(),
  scale: 300,
  maxPixels: 1e11
});
//print(MeanPrecSenegal06,"MeanPrecSenegal06");
//print(MeanPrecSenegal20,"MeanPrecSenegal20");
