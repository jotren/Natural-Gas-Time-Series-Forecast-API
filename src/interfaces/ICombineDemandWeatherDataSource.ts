import { ICombineDemandWeatherDataConstants } from "../interfaces/ICombineDemandWeatherDataConstants";
import { ILinearRegressionCalcualtionConstants, IGasDemandConstants} from "../interfaces/ILinearRegressionDemandConstants";
import { IMergeDailyWeatherData } from '../interfaces/IinsertDaysOfYearConstants';

export interface ICombineDemandWeatherDataSource{
    combineDemandWeatherData(weatherData: IMergeDailyWeatherData[], demandData: ILinearRegressionCalcualtionConstants[], dailyDemandData: IGasDemandConstants[]): Promise<ICombineDemandWeatherDataConstants[]>
}