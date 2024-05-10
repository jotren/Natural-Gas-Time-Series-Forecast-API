import { DataSource } from "typeorm";
import { GasDemandForecastEntity } from "../entities/gasDemandForecastEntity";
import { GasDemandEntity } from "../entities/gasDemandEntity";
import { WeatherDataEntity } from "../entities/weatherDataEntity";
import { GridMappingEntity } from "../entities/gridMappingEntity";
import { GridListEntity } from "../entities/gridListEntity";
import { NetworkEntity } from "../entities/networkEntity";

import path = require("path");

export const AppDataSource = new DataSource({
    type: "sqlite", 
    database: path.join(__dirname, "../../gas-demand-api-database.sqlite"),
    entities:  [NetworkEntity, GasDemandEntity, GasDemandForecastEntity, WeatherDataEntity ,GridMappingEntity, GridListEntity]
  })


  export async function initializeDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error("Error during Data Source initialization", err);
      throw err;
    }
  }