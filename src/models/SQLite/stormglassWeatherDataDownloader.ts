import { AppDataSource } from "../../util/data-source"
import { StormglassSQLiteUpload } from "../weatherData/StormglassDataDownloader";
import { IDailyWeatherData } from "../../interfaces/IWeatherDataConstants"
import { GridListEntity } from "../../entities/gridListEntity";

async function fetchGridLatitudeLongitudeData(): Promise<any> {
    const gridRepository = AppDataSource.getRepository(GridListEntity);
    const gridListData = await gridRepository.find();
    return gridListData;
}

const weatherSource: any = new StormglassSQLiteUpload("939fb5e8-a706-11ed-b59d-0242ac130002-939fb67e-a706-11ed-b59d-0242ac130002");

export async function getStormglassDataSQLite(startInsert: string, endDate: string) {

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