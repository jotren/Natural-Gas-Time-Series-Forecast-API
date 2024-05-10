export interface IGetDemandSource {

    fetchDemandData(network: string): Promise<any[]>

}