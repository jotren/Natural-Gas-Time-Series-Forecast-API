export interface IGetWeatherDataSource {

    getWeatherData(network: string): Promise<{gridIds: any[],  modifiedData: any[]}>

}