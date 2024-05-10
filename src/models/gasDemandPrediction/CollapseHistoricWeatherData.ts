const { getDayOfYear, getYear, getDate, getDay } = require('date-fns');
import { IinsertDaysOfYear, IMergeDailyWeatherData } from '../../interfaces/IinsertDaysOfYearConstants';
import { IStormglassWeatherData } from "../../interfaces/IStormglassWeatherData";

export class CollapseHistoricWeatherClass {
  constructor() {}

  async collapseHistoricWeatherData(weatherArray: IStormglassWeatherData[]): Promise<IinsertDaysOfYear[]> {

    console.log(weatherArray)

    const weatherObjectDaysOfYear: IMergeDailyWeatherData[] = await this.mergeDailyWeatherData(weatherArray)
    const collapsedWeatherObject: IinsertDaysOfYear[] = await this.insertDaysOfYear(weatherObjectDaysOfYear)
    return collapsedWeatherObject

  }

  //Aggregate the grid level weather data into a single date value
  private async mergeDailyWeatherData(weatherObjects: IStormglassWeatherData[]): Promise<IMergeDailyWeatherData[]> {
    const mergedData: Map<string, any> = new Map();
    for (const obj of weatherObjects) {
      const { date, grid_id, ...rest } = obj;
      const dateString = date.toDateString();
      const existingData = mergedData.get(dateString);

      if (existingData) {
        existingData.weatherData.set(grid_id, rest);
      } else {
        const newMergedObj = {
          date,
          weatherData: new Map([[grid_id, rest]])
        };
        mergedData.set(dateString, newMergedObj);
      }
    }

    // Convert the Map to an array of objects
    const mergedDataArray: any[] = [];
    for (const [, mergedObj] of mergedData) {
      mergedDataArray.push({
        date: mergedObj.date,
        locations: {
        ...Object.fromEntries(mergedObj.weatherData)
        }
      });
    }

    return mergedDataArray;
  }

  // Take the aggregated data and combine with the dayOfYear/dayOfWeek information etc.   
  private async insertDaysOfYear(collapsedWeatherObject: IMergeDailyWeatherData[]): Promise<IinsertDaysOfYear[]> {
    const updatedData: any[] = [];

    collapsedWeatherObject.forEach((item: IMergeDailyWeatherData) => {
      const date = item.date;
      const locations = item.locations;

      const dayOfYear = getDayOfYear(date);
      const year = getYear(date);
      const dayOfMonth = getDate(date);
      const dayOfWeek = getDay(date);

      const updatedItem = {
        date,
        locations,
        dayOfYear,
        year,
        dayOfMonth,
        dayOfWeek
      };

      updatedData.push(updatedItem);
    });

    return updatedData;
  }
}