import { AppDataSource } from "../../util/data-source";
import { GasDemandEntity } from "../../entities/gasDemandEntity";

// Get the repository for the GasDemandEntity
const demandRepository = AppDataSource.getRepository(GasDemandEntity);

export class getGasDemandSQL {
    constructor() {}


    async fetchDemandData(network: string): Promise<any[]> {
        const demandData: any = await this.getDemandDataSQL(network)
        const modifiedData = demandData.map((obj: any) => {
          const { id, date, network, gas_demand, actual_forecast } = obj;
          const convertedDate = new Date(date); // Convert the 'date' string to a Date object
          return { date: convertedDate, actualDemand: gas_demand };
      })
        return modifiedData
      }
    
    private async getDemandDataSQL(network: string): Promise<any[]> {
          const demandData = await demandRepository.find( { where : { actual_forecast : "A", network: network } })
            return demandData
          };

        }