import { ICombineDemandWeatherDataConstants } from "../../interfaces/ICombineDemandWeatherDataConstants";
import { ICalculatePredictedDemandLRConstants } from "../../interfaces/ICalculatePredictedDemandLRConstants";
import { ICalculatePredictedDemandLRSource } from "../../interfaces/ICalculatePredictedDemandLRSource";


export class CalculatePredictedDemamdLRClass implements ICalculatePredictedDemandLRSource {
    constructor() {}
  
    async calculatePredictedDemandLR(inputArray: ICalculatePredictedDemandLRConstants[]): Promise<ICalculatePredictedDemandLRConstants[]> {
        inputArray.forEach((item) => {

        const predictedDemandLRArray: number[] = [];
        const locations = item.locations;
  
        if (locations) { // Check if locations is defined
          const networkValues: number[] = [];
  
          Object.keys(locations).forEach((key) => {
            const location = locations[key];
            const airTemperatureMin = location.airTemperature_min;
            const m = location.m;
            const c = location.c;
            const result = airTemperatureMin * m + c;
            networkValues.push(result);
          });

          const average =
            networkValues.reduce((sum, value) => sum + value, 0) /
            networkValues.length;
          predictedDemandLRArray.push(average);
          item.predictedDemand = average
        
        }
      });
      return inputArray
    }
  }
  