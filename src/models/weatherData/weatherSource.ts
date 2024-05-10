import { IGetWeatherDataSource } from "../../interfaces/IGetWeatherDataSource";
import { IWeatherDataSource } from "../../interfaces/IWeatherDataSource";

export class weatherSourceClass implements IWeatherDataSource {

    private weatherAPI: IGetWeatherDataSource;

    constructor(weatherAPI: IGetWeatherDataSource) {
        this.weatherAPI = weatherAPI;
    }
    
    async returnWeatherData(networkNameGDUK: string): Promise<{gridIds: any[],  modifiedData: any[]}> {

        const weatherPointsAndGrids = await this.weatherAPI.getWeatherData(networkNameGDUK);
        const gridIds = weatherPointsAndGrids.gridIds
        const modifiedData = weatherPointsAndGrids.modifiedData


        return { gridIds, modifiedData }

    }
}