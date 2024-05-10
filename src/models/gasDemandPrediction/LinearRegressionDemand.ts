import { ILinearRegressionCalcualtionConstants, IGasDemandConstants} from "../../interfaces/ILinearRegressionDemandConstants";
import { ILinearRegressionDemandSource } from "../../interfaces/ILinearRegressionDemandSource";
import { IWeatherDataSource } from "../../interfaces/IWeatherDataSource";
import { fetchDemandData } from "../../Functions/GetDemandData" 
import { manipulateDemandData } from "../../Functions/ManipulateDemandData" 
import { manipulateWeatherData } from "../../Functions/ManipulateWeatherData" 
import { mergeDemandWeatherData } from "../../Functions/MergeDemandWeatherData" 
import { transformLinearRegressionData } from "../../Functions/TransformLinearRegressionData" 
import { cleanWeatherData } from "../../Functions/GetWeatherDataSQL";

import config from '../../config.json';



const weather_data_grid_filepath = config.weather_data_grid_filepath;
if (!weather_data_grid_filepath) throw new Error("weather_data_grid_filepath must be set in environment variables");

const stormglass_data_directory = config.stormglass_data_directory;
if (!stormglass_data_directory) throw new Error("stormglass_data_directory must be set in environment variables");

const gas_demand_data_directory = config.gas_demand_data_directory;
if (!gas_demand_data_directory) throw new Error("stormglass_data_directory must be set in environment variables");

export class LinearRegressionDemandClass implements ILinearRegressionDemandSource {
    private weatherSource: IWeatherDataSource;
    private demandSource: any;

    constructor(weatherSource: IWeatherDataSource, demandSource: any) {
        this.weatherSource = weatherSource;
        this.demandSource = demandSource;
    }

    async getLinearRegressionDemandData(network: string, networkNameGDUK: string): Promise<{ dailyDemandDataObjects: IGasDemandConstants[]; transformedLinearRegressionObject: ILinearRegressionCalcualtionConstants[]; }> {

        //Get the raw unfiltered data
        const weatherPointsAndGrids = await this.weatherSource.returnWeatherData(networkNameGDUK);
        const weatherPoints = weatherPointsAndGrids.modifiedData

        //Function uses these grid IDs to fetch the relevant SG weather data. Only interested in min values
        const weatherDataObjects = await cleanWeatherData(weatherPoints)

        //Get raw Demand Data through dependency injection
        const dailyDemandDataObjects = await this.demandSource.getGasDemandData(network)

        // //Function fetches the demand data via API
        // const dailyDemandDataObjects = await fetchDemandData(network)

        //Function manipulates the demand to be easier to merge on day of the year
        const manipulatedDemandData = await manipulateDemandData(dailyDemandDataObjects)

        //Function manipulates the weather data in the same manner
        const manipulatedWeatherData = await manipulateWeatherData(weatherDataObjects)

        //Function merges the weather and demand data on the day of year key value
        const mergedDemandWeatherData = await mergeDemandWeatherData(manipulatedDemandData, manipulatedWeatherData)

        //Function performs a linear regression and calculates m & c between demand and weather data
        const transformedLinearRegressionObject = await transformLinearRegressionData(mergedDemandWeatherData)

        return {
            dailyDemandDataObjects: dailyDemandDataObjects,
            transformedLinearRegressionObject: transformedLinearRegressionObject
          };

    }
}