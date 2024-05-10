export interface IfetchGridLatitudeLongitudeData {
    id: Number,
    grid_id: string,
    latitude: string, 
    longitude: string
}

export interface IDailyWeatherData {
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
