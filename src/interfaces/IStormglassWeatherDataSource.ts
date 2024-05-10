import { IStormglassWeatherData } from "./IStormglassWeatherData"

export interface IStormglassWeatherDataSource {

    getWeatherData(network: string): Promise<{gridIds: any[],  modifiedData: any[]}>

}