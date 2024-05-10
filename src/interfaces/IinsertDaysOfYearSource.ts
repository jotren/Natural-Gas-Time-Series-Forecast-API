import { IMergeDailyWeatherData } from './IinsertDaysOfYearConstants';
import { IinsertDaysOfYear } from './IinsertDaysOfYearConstants';
import { IStormglassWeatherData } from "./IStormglassWeatherData";

export interface IinsertDaysOfYearSource{
    collapseHistoricWeatherData(weatherArray: IStormglassWeatherData[]): Promise<{ weatherObjectDaysOfYear: IMergeDailyWeatherData[], collapsedWeatherObject: IinsertDaysOfYear[]}>
}