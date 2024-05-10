import axios, { AxiosInstance } from 'axios';

export type WeatherParameters = "waterTemperature" | "wavePeriod" | "waveDirection" | "waveHeight" | "windWaveDirection" | "windWaveHeight" | "windWavePeriod" | "swellPeriod" | "secondarySwellPeriod" | "swellDirection" | "secondarySwellDirection" | "swellHeight" | "secondarySwellHeight" | "windSpeed" | "windSpeed20m" | "windSpeed30m" | "windSpeed40m" | "windSpeed50m" | "windSpeed80m" | "windSpeed100m" | "windSpeed1000hpa" | "windSpeed800hpa" | "windSpeed500hpa" | "windSpeed200hpa" | "windDirection" | "windDirection20m" | "windDirection30m" | "windDirection40m" | "windDirection50m" | "windDirection80m" | "windDirection100m" | "windDirection1000hpa" | "windDirection800hpa" | "windDirection500hpa" | "windDirection200hpa" | "airTemperature" | "airTemperature80m" | "airTemperature100m" | "airTemperature1000hpa" | "airTemperature800hpa" | "airTemperature500hpa" | "airTemperature200hpa" | "precipitation" | "gust" | "cloudCover" | "humidity" | "pressure" | "visibility" | "currentSpeed" | "currentDirection" | "iceCover" | "snowDepth" | "seaLevel";

export type SolarParameters = "uvIndex" | "downwardShortWaveRadiationFlux";

export interface IStormglassPoint {
  time: string;
  [key: string]: string | IParamValue;
}

export interface IStormglassResponse {

  hours: IStormglassPoint[];

  meta: {
    cost: number;
    dailyQuota: number;
    lat: number;
    lng: number;
    params: WeatherParameters[];
    requestCount: number;
    start: string;
    end: string;
  }
}

export interface IParamValue {
  [forecastSource: string]: number;
}

export class Stormglass {
  private readonly axiosInstance: AxiosInstance;

  constructor(apiKey: string) {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.stormglass.io/v2',
      headers: {
        Authorization: apiKey,
      },
    });
  }

  public async fetchWeather(lat: number, lng: number, start: Date, end: Date, parameters: WeatherParameters[]): Promise<IStormglassResponse> {
    const url = '/weather/point';
    const params = {
      lat,
      lng,
      start: start.toISOString(),
      end: end.toISOString(),
      params: parameters.join(','),
    };
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
  }
  
  public async fetchSolar(lat: number, lng: number, start: Date, end: Date, parameters: SolarParameters[]): Promise<IStormglassResponse> {
    const url = '/solar/point';
    const params = {
      lat,
      lng,
      start: start.toISOString(),
      end: end.toISOString(),
      params: parameters.join(','),
    };
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
  }
  
}