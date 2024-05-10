import { IGetDemandSource } from "../../interfaces/IGetDemandSource";

export class gasDemandSourceClass {

    private demandSource: IGetDemandSource;

    constructor(demandSource: IGetDemandSource) {
        this.demandSource = demandSource;
    }
    
    async getGasDemandData(network:string): Promise<any> {
        const demandData = await this.demandSource.fetchDemandData(network)
        return demandData
    }

}