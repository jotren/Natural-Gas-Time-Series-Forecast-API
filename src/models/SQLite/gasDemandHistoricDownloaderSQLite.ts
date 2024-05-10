import { GasDemandClient } from "../gasDemandHistoric/NationalTransmissionGasClient"
import { uploadGasDemandDataToSQLite } from './UploadGasDemandDataSQLite';

const gasDemandClient: any = new GasDemandClient()

export async function uploadGasDemandData(network: string, start: Date, end: Date) {

    const gasDemandDataSOAP: any = await gasDemandClient.gasDemandClient(network, start, end)
    uploadGasDemandDataToSQLite(gasDemandDataSOAP, "A")
  
}
