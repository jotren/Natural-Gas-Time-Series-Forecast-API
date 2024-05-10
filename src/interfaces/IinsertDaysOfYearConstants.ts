export interface IinsertDaysOfYear {
  date: Date;
  locations: { [key: string]: any };
  dayOfYear: number;
  year: number;
  dayOfMonth: number;
  dayOfWeek: number;
}

export interface IMergeDailyWeatherData {
  date: Date;
  locations: { [key: string]: any };
}