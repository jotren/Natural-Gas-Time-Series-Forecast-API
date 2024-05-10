import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../util/data-source";
import { Between } from 'typeorm';
import { gasDemandMachineLearning } from "../models/gasDemandPrediction/gasDemandForecastML"
import { uploadGasDemandData } from "../models/SQLite/gasDemandHistoricDownloaderSQLite";
import { GasDemandEntity } from "../entities/gasDemandEntity";
import { GasDemandForecastEntity } from "../entities/gasDemandForecastEntity";

const gasDemandRepository = AppDataSource.getRepository(GasDemandEntity);
const gasDemandForecastRepository = AppDataSource.getRepository(GasDemandForecastEntity);

export async function getGasDemandData(req: Request, res: Response, next: NextFunction) {
  try {
    const start: string = res.locals.start;
    const end: string = res.locals.end;
    const network = res.locals.network;

    const gasDemandData = await gasDemandRepository.find({
      where: {
        network: network,
        date: Between(start, end)
      },order: {
        date: "ASC"
      }
    });

    res.json(gasDemandData);
  } catch (err) {
    console.error('Error retrieving gas demand data:', err);
    next(err);
  }
}

export async function getGasDemandForecastData(req: Request, res: Response, next: NextFunction) {
  try {
    const start: string = res.locals.start;
    const end: string = res.locals.end;
    const network = res.locals.network;

    const gasDemandData = await gasDemandForecastRepository.find({
      where: {
        network: network,
        date: Between(start, end)
      },order: {
        date: "ASC"
      }
    });

    // Check if the gasDemandData is empty
    if (gasDemandData.length === 0) {
      res.status(404).json({ message: 'No gas demand forecast data found' });
    } else {
      res.json(gasDemandData);
    }
  } catch (err) {
    console.error('Error retrieving gas demand forecast data:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function runGasDemandMachineLearning(req: Request, res: Response, next: NextFunction) {
  try {
    const start: string = res.locals.start;
    const end: string = res.locals.end;
    const network = res.locals.network;

    gasDemandMachineLearning(network, start, end);
    res.status(200).json({ message: `Machine Learning Model currently training for the ${network} network between the dates ${start} - ${end}`});
  } catch (err) {
    console.error('Error running gas demand machine learning:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function downloadHistoricGasDemandData(req: Request, res: Response, next: NextFunction) {
  try {
    const start: string = res.locals.start;
    const end: string = res.locals.end;
    const network: string = res.locals.network;

    const startDatetime: Date = new Date(start)
    const endDatetime: Date = new Date(end)

    uploadGasDemandData(network, startDatetime, endDatetime);
    
    res.status(200).json({ message: `Gas demand data uploaded between the dates ${start} - ${end} for ${network}`});
  } catch (err) {
    console.error('Error downloading historic gas demand data:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

