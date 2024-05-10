export interface IStormglassWeatherData {
    date: Date,
    grid_id: string,
    windSpeed_min: number,
    airTemperature_min: number,
    humidity_min: number,
    windSpeed_median: number,
    airTemperature_median: number,
    humidity_median: number,
    windSpeed_max: number,
    airTemperature_max: number,
    humidity_max: number,
    precipitation: number
  }