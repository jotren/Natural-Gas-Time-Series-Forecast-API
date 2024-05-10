import { ICombineDemandWeatherDataConstants, IWeatherDemandDataMCConstants } from "../../interfaces/ICombineDemandWeatherDataConstants";
import { ICombineDemandWeatherDataSource } from "../../interfaces/ICombineDemandWeatherDataSource";
import { IMergeDailyWeatherData } from '../../interfaces/IinsertDaysOfYearConstants';
import { ILinearRegressionCalcualtionConstants, IGasDemandConstants} from "../../interfaces/ILinearRegressionDemandConstants";

export class CombineDemandWeatherClass implements ICombineDemandWeatherDataSource {
    constructor() {} 

    async combineDemandWeatherData(weatherData: IMergeDailyWeatherData[], demandData: ILinearRegressionCalcualtionConstants[], dailyDemandData: IGasDemandConstants[]): Promise<ICombineDemandWeatherDataConstants[]> {
        const weaterDataMCValues: IWeatherDemandDataMCConstants[] = await this.combineMCValues(weatherData, demandData)

        const combineWeatherDemandData: ICombineDemandWeatherDataConstants[] = await this.mergeDailyDemandData(weaterDataMCValues, dailyDemandData)   
        return combineWeatherDemandData
    }


    private async combineMCValues(weatherData: any[], demandData: any[]): Promise<any[]> {
        const map = new Map();
        demandData.forEach(obj => {
          const key = `${obj.dayOfYear}_${obj.grid}`;
          map.set(key, { m: obj.m, c: obj.c });
        });
      
        // Update demandWeatherData with m and c values
        weatherData.forEach(obj => {
          const locations = obj.locations as Record<string, any>;
          Object.entries(locations).forEach(([key, demandGrid]) => {
            const demandGridKey = `${obj.dayOfYear}_${key}`;
            if (map.has(demandGridKey)) {
              const { m, c } = map.get(demandGridKey);
              demandGrid.m = m;
              demandGrid.c = c;
            
            }
          });
        });
        return weatherData;
      }      

      private async mergeDailyDemandData(weatherData: any[], dailyDemandData: any[]): Promise<any[]> {
        const demandMap = new Map();
      
        // Create a Map using the dailyDemandData array, with the date as the key
        for (const demandObj of dailyDemandData) {
          demandMap.set(demandObj.date.toISOString(), demandObj);
        }
      
        // Merge the weatherData array with the demandMap
        const mergedData: any[] = weatherData.map(weatherObj => {
          const demandObj = demandMap.get(weatherObj.date.toISOString());
      
          if (demandObj) {
            return { ...weatherObj, ...demandObj };
          } else {
            return { actualDemand: 0, ...weatherObj  };
          }
        });
        return mergedData;
      }
      
      
}
