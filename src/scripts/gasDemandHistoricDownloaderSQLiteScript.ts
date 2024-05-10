import '../env';

import { GasDemandClient } from "../models/gasDemandHistoric/NationalTransmissionGasClient"
import { uploadGasDemandDataToSQLite } from '../models/SQLite/UploadGasDemandDataSQLite';
import { initializeDatabase } from "../util/data-source";

const gasDemandClient: any = new GasDemandClient()

export async function uploadGasDemandData(network: string, start: Date, end: Date) {

    const gasDemandDataSOAP: any = await gasDemandClient.gasDemandClient(network, start, end)
    uploadGasDemandDataToSQLite(gasDemandDataSOAP, "A")
  
}

const currentDate: Date = new Date();
currentDate.setDate(currentDate.getDate()-1);
currentDate.setHours(0, 0, 0, 0);

const forecastDate: Date = new Date(currentDate);
forecastDate.setDate(forecastDate.getDate()+2);
forecastDate.setHours(0, 0, 0, 0);


console.log(forecastDate, currentDate)

async function run() {
    //Create an instance of the database
    await initializeDatabase();
    await uploadGasDemandData('eastanglia',currentDate, forecastDate);
    await uploadGasDemandData('eastmidlands',currentDate, forecastDate);
    await uploadGasDemandData('northwest',currentDate, forecastDate);
    await uploadGasDemandData('northlondon',currentDate, forecastDate);
    await uploadGasDemandData('westmidlands',currentDate, forecastDate);
  }
  
  run().then(() => {
    console.log('script complete');
  })