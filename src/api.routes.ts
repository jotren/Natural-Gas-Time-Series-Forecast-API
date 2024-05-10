import express from "express";
import { getGasDemandData, getGasDemandForecastData, downloadHistoricGasDemandData, runGasDemandMachineLearning } from "./controllers/gasDemandController";
import { getStormglassWeatherData, getStormglassGridMappingData, getStormglassGridListData, downloadStormglassData } from "./controllers/weatherController";
import { validateNetworkParameters, validateDateParameters, validateQueryParamsGasDates } from "./middleware/validateQueryParams";

// Create an Express router
const router = express.Router();

router.get('/gasdemand/:network/actual_forecast', validateNetworkParameters, validateDateParameters, getGasDemandData) //Works
router.get('/gasdemand/:network/hindcast_forecast', validateNetworkParameters, validateDateParameters, getGasDemandForecastData) //Works

router.post('/gasdemand/:network/runforecast', validateNetworkParameters, validateDateParameters, runGasDemandMachineLearning) //Works
router.post('/gasdemand/:network/runhistoricdownload', validateNetworkParameters, validateQueryParamsGasDates , downloadHistoricGasDemandData) //Works

router.get('/weatherdata/:network/getdata', validateNetworkParameters, validateDateParameters, getStormglassWeatherData) //Works
router.post('/weatherdata/:network/download', validateNetworkParameters, validateDateParameters, downloadStormglassData) //Works

router.get('/weatherdata/gridmapping', getStormglassGridMappingData) //Works
router.get('/weatherdata/networks', getStormglassGridListData) //Works

export default router;