import { AppDataSource } from '../util/data-source';
import { Request, Response, NextFunction } from 'express';
import { Between, In } from 'typeorm';
import { getStormglassDataSQLite } from '../models/SQLite/stormglassWeatherDataDownloader';
import { uploadStormglassDataToSQLite } from '../models/SQLite/UploadStormglassDataSQLite';
import { WeatherDataEntity } from '../entities/weatherDataEntity';
import { GridMappingEntity } from '../entities/gridMappingEntity';
import { NetworkEntity } from '../entities/networkEntity';



const stormglassRepository = AppDataSource.getRepository(WeatherDataEntity)
const gridMappingRepository = AppDataSource.getRepository(GridMappingEntity);
const networkRepository = AppDataSource.getRepository(NetworkEntity)

export async function getStormglassWeatherData(req: Request, res: Response, next: NextFunction) {
  try {
    const start: string = res.locals.start;
    const end: string = res.locals.end;
    const network = res.locals.network;

    const networkName = await networkRepository.findOne({ where: { network: network }})
    
    if (!networkName) {
      // Handle case when network is not found
      res.status(404).json({ error: 'Network not found' });
      return;
    }

    const networkNameGDUK = networkName.GDUK_mapping;

    const gridMappingData = await gridMappingRepository.find({ where: { plant: networkNameGDUK } });
    const gridIds: string[] = gridMappingData.map(obj => obj.grid_id);

    const stormglassData = await stormglassRepository.find({
      where: {
        grid_id: In(gridIds),
        date: Between(start, end)
      },
      order: {
        date: "ASC"
      }
    });

    res.json(stormglassData);
  } catch (err) {
    console.error('Error retrieving Stormglass weather data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getStormglassGridMappingData(req: Request, res: Response, next: NextFunction) {
  try {
    const gridMappingData = await gridMappingRepository.find();
    res.json(gridMappingData);
  } catch (err) {
    console.error('Error retrieving Stormglass grid mapping data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getStormglassGridListData(req: Request, res: Response, next: NextFunction) {
  try {
    const networkListData = await networkRepository.find({select: ["id", "network"],order: {id: "ASC"}});
    res.json(networkListData);
  } catch (err) {
    console.error('Error retrieving Stormglass grid list data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function downloadStormglassData(req: Request, res: Response, next: NextFunction) {
  try {
    const start_datetime: string = res.locals.start;
    const end_datetime: string = res.locals.end;

    const stormglassData = await getStormglassDataSQLite(start_datetime, end_datetime);
    uploadStormglassDataToSQLite(stormglassData);
    res.json({ message: `Stormglass data being uploaded for all networks between ${start_datetime} - ${end_datetime}` });
  } catch (err) {
    console.error('Error downloading Stormglass data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

