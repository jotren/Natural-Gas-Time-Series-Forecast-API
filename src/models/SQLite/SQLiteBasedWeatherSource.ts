import { IStormglassWeatherDataSource } from '../../interfaces/IStormglassWeatherDataSource';
import { IStormglassWeatherData } from '../../interfaces/IStormglassWeatherData';
import { In } from 'typeorm';
import { AppDataSource} from '../../util/data-source';
import { WeatherDataEntity } from '../../entities/weatherDataEntity';
import { GridMappingEntity } from '../../entities/gridMappingEntity';

const stormglassRepository = AppDataSource.getRepository(WeatherDataEntity);
const gridMappingRepository = AppDataSource.getRepository(GridMappingEntity);

export class SQLBasedWeatherSource implements IStormglassWeatherDataSource {
  constructor() {}

  async getWeatherData(network: string): Promise<{ gridIds: any[]; modifiedData: any[] }> {
    const weatherGrids = await this.getWeatherDataGridIDs(network);
    const filteredData: any[] = weatherGrids.filter(obj => obj.plant === network);
    const gridIds: string[] = filteredData.map(obj => obj.grid_id);
    const weatherObjects: any[] = await this.loadPointsDataFromSQLite(gridIds);
    const modifiedData = weatherObjects.map(obj => {
      const { stormglass_id, date, ...rest } = obj;
      const convertedDate = new Date(date); // Convert the 'date' string to a Date object
      return { date: convertedDate, ...rest };
    });

    return { gridIds, modifiedData };
  }

  private async loadPointsDataFromSQLite(gridIDs: string[]): Promise<any[]> {
    const stormglassData = await stormglassRepository.find({
      where: { grid_id: In(gridIDs) },
      select: ['date', 'grid_id', 'windSpeed_min', 'airTemperature_min', 'humidity_min', 'windSpeed_median', 'airTemperature_median', 
      'humidity_median', 'windSpeed_max', 'airTemperature_max', 
      'humidity_max', 'precipitation' ] // Replace 'column1', 'column2', 'column3' with the actual column names you want to include
    });
  
    return stormglassData;
  }
  
  private async getWeatherDataGridIDs(network: string): Promise<any[]> {
    const gridMappingData = await gridMappingRepository.find({ where: { plant: network } });
    return gridMappingData;
  }
}
