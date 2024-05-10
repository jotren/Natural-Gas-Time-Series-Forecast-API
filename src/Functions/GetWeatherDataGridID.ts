import { AppDataSource } from "../util/data-source"
import { GridMappingEntity } from "../entities/gridMappingEntity"
const gridMappingRespository = AppDataSource.getRepository(GridMappingEntity)

export async function getWeatherDataGridIDs(network: string, filePath: string): Promise<any> {

    const gridMappingData = await gridMappingRespository.find({ where: { plant : network }})
    return gridMappingData
}
