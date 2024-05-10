export interface IWeatherDataSource {

    returnWeatherData(network: string): Promise<{gridIds: any[],  modifiedData: any[]}>

}