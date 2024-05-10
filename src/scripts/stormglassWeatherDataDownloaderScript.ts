import '../env';

import { AppDataSource, initializeDatabase } from "../util/data-source"
import { StormglassSQLiteUpload } from "../models/weatherData/StormglassDataDownloader";
import { uploadStormglassDataToSQLite } from "../models/SQLite/UploadStormglassDataSQLite"
import { GridListEntity } from "../entities/gridListEntity";

export interface IfetchGridLatitudeLongitudeData {
    id: Number,
    grid_id: string,
    latitude: string, 
    longitude: string
}

interface IDailyWeatherData {
  date: string;
  windSpeed_min: number;
  airTemperature_min: number;
  humidity_min: number;
  windSpeed_median: number;
  airTemperature_median: number;
  humidity_median: number;
  windSpeed_max: number;
  airTemperature_max: number;
  humidity_max: number;
  precipitation: number;
  grid_id: string;
}

async function fetchGridLatitudeLongitudeData(): Promise<any> {
    const gridRepository = AppDataSource.getRepository(GridListEntity);
    const gridListData = await gridRepository.find();
    return gridListData;
}

const weatherSource: any = new StormglassSQLiteUpload("939fb5e8-a706-11ed-b59d-0242ac130002-939fb67e-a706-11ed-b59d-0242ac130002");

export async function fetchStormglassDataSQLite(startInsert: Date, endDate: Date) {

    const networkGridValues: any[] = await fetchGridLatitudeLongitudeData();
    const SQLiteDataUpload: any[] = [];
  
    const increment = 10; // Number of days to increment in each iteration
    let currentDate = new Date(startInsert);
    let endInsert = new Date(endDate)

    while (currentDate <= endInsert) {

      const nextDate = new Date(currentDate.getTime() + increment * 24 * 60 * 60 * 1000);
      const formattedStartDate = currentDate;
      const formattedEndDate = nextDate <= endInsert ? nextDate: endInsert;

      console.log(formattedStartDate, formattedEndDate);
  
      for (let i = 0; i < networkGridValues.length; i++) {
        const lat: number = networkGridValues[i]['latitude'].toFixed(2);
        const lng: number = networkGridValues[i]['longitude'].toFixed(2);
        const gridReference: string = networkGridValues[i]['grid_id'];
  
        const stormglassOrganisedDailyData: IDailyWeatherData[] = await weatherSource.fetchStormglassDataSQLite(formattedStartDate, formattedEndDate, lat, lng);

        if (stormglassOrganisedDailyData && stormglassOrganisedDailyData.length > 0) {
          // Iterate over each object in stormglassOrganisedDailyData array and add grid_id property
          for (let j = 0; j < stormglassOrganisedDailyData.length; j++) {
            stormglassOrganisedDailyData[j].grid_id = gridReference;
          }
          SQLiteDataUpload.push(...stormglassOrganisedDailyData);

        } else {
          console.log("No data received from weatherSource.uploadStormglassDataSQLite");
        }
      }
      currentDate = nextDate;
    }
    return SQLiteDataUpload;
  }
  
  async function main(start: Date, end: Date) {

    await initializeDatabase();
    
    const stormglassData = await fetchStormglassDataSQLite(start, end);
    uploadStormglassDataToSQLite(stormglassData);
  }
  
const currentDate: Date = new Date();
currentDate.setDate(currentDate.getDate() - 2);
currentDate.setHours(0, 0, 0, 0);

const forecastDate: Date = new Date(currentDate);
forecastDate.setDate(forecastDate.getDate() + 10);
forecastDate.setHours(0, 0, 0, 0);

main(currentDate, forecastDate);
  