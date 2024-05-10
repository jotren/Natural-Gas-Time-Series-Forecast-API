import { AppDataSource} from "../util/data-source"
import { GasDemandEntity  } from "../entities/gasDemandEntity";

// Get the repository for the GasDemandEntity
const demandRepository = AppDataSource.getRepository(GasDemandEntity);

  export async function fetchDemandData(network: string): Promise<any[]> {
    const demandData: any = await getDemandDataSQL(network)
    const modifiedData = demandData.map((obj: any) => {
      const { id, date, network, gas_demand, actual_forecast } = obj;
      const convertedDate = new Date(date); // Convert the 'date' string to a Date object
      return { date: convertedDate, actualDemand: gas_demand };
  })
    return modifiedData
  }

  async function getDemandDataSQL(network: string): Promise<any[]> {
      const demandData = await demandRepository.find( { where : { actual_forecast : "A", network: network } })
        return demandData
      };