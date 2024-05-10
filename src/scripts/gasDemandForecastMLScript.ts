import '../env';

import { SQLBasedWeatherSource } from "../models/SQLite/SQLiteBasedWeatherSource";
import { SendMLDataToPythonAPI } from "../models/gasDemandPrediction/SendMLDataToPythonAPI";
import { CollapseHistoricWeatherClass } from "../models/gasDemandPrediction/CollapseHistoricWeatherData"
import { LinearRegressionDemandClass } from "../models/gasDemandPrediction/LinearRegressionDemand";
import { ILinearRegressionDemandSource } from "../interfaces/ILinearRegressionDemandSource";
import { CombineDemandWeatherClass } from "../models/gasDemandPrediction/CombineDemandWeatherData";
import { CalculatePredictedDemamdLRClass } from "../models/gasDemandPrediction/CalculatePredictedDemandLR";
import { IStormglassWeatherDataSource } from "../interfaces/IStormglassWeatherDataSource";
import { ICalculatePredictedDemandLRSource } from "../interfaces/ICalculatePredictedDemandLRSource";
import { ICombineDemandWeatherDataSource } from "../interfaces/ICombineDemandWeatherDataSource";
import { addBankHolidayFlag } from "../Functions/AddBankHolidayFlag";
import { AppDataSource, initializeDatabase } from "../util/data-source";
import { NetworkEntity } from "../entities/networkEntity";
import { IWeatherDataSource } from '../interfaces/IWeatherDataSource';
import { weatherSourceClass } from '../models/weatherData/weatherSource';
import { gasDemandSourceClass } from '../models/gasDemandHistoric/gasDemandSourceClass';
import { getGasDemandSQL } from '../models/gasDemandHistoric/getGasDemandSQL';

//Import network repository
const networkRepository = AppDataSource.getRepository(NetworkEntity)

//Import Classes
const weatherSourceSQL: IStormglassWeatherDataSource = new SQLBasedWeatherSource();

//Dependecy Inject of SQLBasedWeatherSource into the Weather source Class
const weatherSource: IWeatherDataSource = new weatherSourceClass(weatherSourceSQL)
const collapseHistoricWeatherClass: any = new CollapseHistoricWeatherClass()

const demandSourceSQL: any = new getGasDemandSQL()
const demandSource: any = new gasDemandSourceClass(demandSourceSQL)
const linearRegressionDemandClass: ILinearRegressionDemandSource = new LinearRegressionDemandClass(weatherSource, demandSource)
const combineDemandWeatherClass: ICombineDemandWeatherDataSource = new CombineDemandWeatherClass()
const calculatedPredictedDemandLRClass: ICalculatePredictedDemandLRSource = new CalculatePredictedDemamdLRClass()

const python_url = process.env.python_url;
if (!python_url) throw new Error("python_url must be set in environment");
const sendMLDataToPythonAPI: any = new SendMLDataToPythonAPI(python_url);

export async function gasDemandMachineLearning(network:string, startPredictions: string, endPredictions: string): Promise<any> {
  
  try {
  //Get the network name from the database and run to find grid values
  const networkName = await networkRepository.findOne({ where: { network: network }})
      
    if (!networkName) {
      // Handle case when network is not found
      throw new Error('Network not found');
    }
    const networkNameGDUK = networkName.GDUK_mapping;

  // load weather data
  const weatherPointsAndGrids = await weatherSource.returnWeatherData(networkNameGDUK);
  const weatherGrids = weatherPointsAndGrids.gridIds
  const weatherPoints = weatherPointsAndGrids.modifiedData

  // Class to collapse the object into daily objects with all grid values present
  const collapsedHistoricWeatherData = await collapseHistoricWeatherClass.collapseHistoricWeatherData(weatherPoints);

  //First the algorithmn will do a Linear Regression Analysis plotting minAirTemperature vs. Demand for each grid value
  //This function will run that calculation and return an intial m & c values for each grid
  const linearRegressionDemandValues = await linearRegressionDemandClass.getLinearRegressionDemandData(network, networkNameGDUK);
  const dailyDemandDataObjects = linearRegressionDemandValues.dailyDemandDataObjects;
  const transformedLinearRegressionObject = linearRegressionDemandValues.transformedLinearRegressionObject;

  //Class that combines the demand values, weatherData and the respective m&c values from the LR analysis
  const demandWeatherData = await combineDemandWeatherClass.combineDemandWeatherData(collapsedHistoricWeatherData, transformedLinearRegressionObject, dailyDemandDataObjects )

  //Function will make an intial prediction on demand based on LR m & c values
  const objectPredictedDemand = await calculatedPredictedDemandLRClass.calculatePredictedDemandLR(demandWeatherData)

  //Class that creates a new field in the object array that has bank holiday or not
  const objectPredicedDemandBankHols: any =  await addBankHolidayFlag(objectPredictedDemand)

  //This class will send this data object with weather, actualDemand, LR prediction, bank hols to a ML API
  const confirmation = await sendMLDataToPythonAPI.sendMLDatatoPythongAPI(objectPredicedDemandBankHols, startPredictions, endPredictions, network)

  console.log(confirmation)
  
  } catch (err) {
    console.error('Error in gasDemandMachineLearning:', err);
    throw err; 
  }
}

const currentDate: Date = new Date();
currentDate.setDate(currentDate.getDate() - 1);
currentDate.setHours(0, 0, 0, 0);

const forecastDate: Date = new Date(currentDate);
forecastDate.setDate(forecastDate.getDate() + 7);
forecastDate.setHours(0, 0, 0, 0);

const currentDateString: string = currentDate.toISOString().split('T')[0];
const forecastDateString: string = forecastDate.toISOString().split('T')[0];

async function run() {
  //Create an instance of the database
  await initializeDatabase();
  await gasDemandMachineLearning("eastmidlands", currentDateString, forecastDateString);
  await gasDemandMachineLearning("northlondon", currentDateString, forecastDateString);
  await gasDemandMachineLearning("northwest", currentDateString, forecastDateString);
  await gasDemandMachineLearning("eastanglia", currentDateString, forecastDateString);
  await gasDemandMachineLearning("westmidlands", currentDateString, forecastDateString);
}

run().then(() => {
  console.log('script complete');
})