import { createSemanticDiagnosticsBuilderProgram } from "typescript";
import { Stormglass, WeatherParameters  } from "./StormglassClient"
import { createConnection, Entity, Column, PrimaryGeneratedColumn, UsingJoinColumnIsNotAllowedError } from 'typeorm';


interface IfetchGridLatitudeLongitudeData {
    id: Number,
    grid_id: Number,
    latitude: Number, 
    longitude: Number
}

interface IWeatherData {
  time: string;
  airTemperature: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

interface IDailyWeatherData {
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
}


export class StormglassSQLiteUpload {

    apiKey: string

    constructor (apiKey: string) {
        this.apiKey = apiKey
    }

    //The purpose of this function is to take the lat and lon of the network and return the weather data to the SQLite database
    async fetchStormglassDataSQLite(start: Date, end: Date, lat: number, lng: number) {

        //Get the stormglass data based on network grids
        const stormglassRawData: any = await this.fetchStormglassData(start, end, lat, lng) 

        //Organise the data into the relevante structures sg

        const stormglassOrganisedDailyData: any = await this.organiseStormglassData(stormglassRawData) 

        //Upload to the SQLite database checking if there are duplicates i.e. overwrite if duplicates

        return stormglassOrganisedDailyData


    }

    async fetchStormglassData(start: Date, end: Date, lat: number, lng: number): Promise<IWeatherData[]> {
        const apiKey = this.apiKey;
        const stormglass = new Stormglass(apiKey);
        const parameters: WeatherParameters[] = ['airTemperature', 'windSpeed', 'precipitation', 'humidity']; // Parameters you want to fetch
      
        try {
          const weatherData = await stormglass.fetchWeather(lat, lng, start, end, parameters);
          return weatherData.hours.map((hour: any) => ({
            time: hour.time,
            airTemperature: hour.airTemperature.sg,
            precipitation: hour.precipitation.sg,
            windSpeed: hour.windSpeed.sg,
            humidity: hour.humidity.sg
          }));
        } catch (error) {
          console.error('Error fetching weather data:', error);
          return [];
        }
      }

    async organiseStormglassData(weatherDataObject: any[]): Promise<any> {
        const dailyWeatherData: IDailyWeatherData[] = [];

    const dates = [...new Set(weatherDataObject.map((weather) => weather.time.slice(0, 10)))];
  
    for (const date of dates) {
      const dailyData: IWeatherData[] = weatherDataObject.filter((weather) => weather.time.includes(date));
      const windSpeedValues = dailyData.map((weather) => weather.windSpeed);
      const airTemperatureValues = dailyData.map((weather) => weather.airTemperature);
      const precipitationValues = dailyData.map((weather) => weather.precipitation);
      const humidityValues = dailyData.map((weather) => weather.humidity);


      const dailyWeather: IDailyWeatherData = {
        date: date,
        windSpeed_min: Math.min(...windSpeedValues),
        airTemperature_min: Math.min(...airTemperatureValues),
        humidity_min: Math.min(...humidityValues),
        windSpeed_median: this.getMedianValue(windSpeedValues),
        airTemperature_median: this.getMedianValue(airTemperatureValues),
        humidity_median: this.getMedianValue(humidityValues),
        windSpeed_max: Math.max(...windSpeedValues),
        airTemperature_max: Math.max(...airTemperatureValues),
        humidity_max: Math.max(...humidityValues),
        precipitation: precipitationValues.reduce((acc, value) => acc + value, 0),
      };
  
      dailyWeatherData.push(dailyWeather);
    }
    return dailyWeatherData;
    }

    getMedianValue(arr: number[]): number {
        const sortedArr = arr.sort();
        const middleIndex = Math.floor(sortedArr.length / 2);
      
        if (sortedArr.length % 2 === 0) {
          return (sortedArr[middleIndex] + sortedArr[middleIndex - 1]) / 2;
        } else {
          return sortedArr[middleIndex];
        }
      }
    }
