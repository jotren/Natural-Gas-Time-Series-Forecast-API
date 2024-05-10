const soap = require('soap');
const url = 'http://marketinformation.natgrid.co.uk/MIPIws-public/public/publicwebservice.asmx?wsdl';
import { IRequestObject } from "../../interfaces/ISOAPRequestObject";
import { ISOAPResponseObject } from "../../interfaces/ISOAPResponseObject";

export type networks =
  | 'eastanglia'
  | 'eastmidlands'
  | 'northlondon'
  | 'northwest'
  | 'westmidlands';

const networkMapping:  Record<string, string> = {
    'eastanglia': 'Demand Actual, LDZ (EA), D+1',
    'eastmidlands': 'Demand Actual, LDZ (EM), D+1',
    'northwest': 'Demand Actual, LDZ (NW), D+1',
    'westmidlands': 'Demand Actual, LDZ (WM), D+1',
    'northlondon': 'Demand Actual, LDZ (NT), D+1'
};

export class GasDemandClient {
  constructor() {}

  public async gasDemandClient(network: networks, start: Date, end: Date): Promise<any> {

    console.log(start, end)

    const startISOString: string = start.toISOString();
    const endISOString: string = end.toISOString();
    const networkValue: string = networkMapping[network]

    console.log(startISOString, endISOString, networkValue)

    const args: IRequestObject = {
      reqObject: {
        LatestFlag: 'N',
        ApplicableForFlag: 'N',
        ToDate: endISOString,
        FromDate: startISOString,
        DateType: 'GASDAY',
        PublicationObjectNameList: {
          string: [ networkValue ] 
        }
      }
    };
    return new Promise((resolve, reject) => {
      soap.createClient(url, (err: any, client: any) => {
        if (err) {
          console.error('Failed to create SOAP client:', err);
          reject(err);
          return;
        }

        client.GetPublicationDataWM(args, (err: any, result: any) => {
          if (err) {
            console.error('SOAP request failed:', err);
            reject(err);
            return;
          }

          const publicationData = result.GetPublicationDataWMResult.CLSMIPIPublicationObjectBE;
          const dataArray: { date: Date; value: number, network: string, qualityIndicator: string, createdDate: Date }[] = [];

          for (const publication of publicationData) {
            const publicationObjectDataArray = publication.PublicationObjectData.CLSPublicationObjectDataBE;
          
            // Access the objects within the array
            publicationObjectDataArray.forEach((publicationObject: ISOAPResponseObject) => {
              const applicableFor = publicationObject.ApplicableFor.toISOString();
              const value = publicationObject.Value;
              const qualityIndicator = publicationObject.QualityIndicator;
              const createdDate = publicationObject.CreatedDate;
          
              const existingObject = dataArray.find(obj => obj.date.getTime() === new Date(applicableFor).getTime());
          
              if (!existingObject) {
                dataArray.push({
                  date: new Date(applicableFor),
                  value: parseFloat(value),
                  network: network,
                  qualityIndicator: qualityIndicator,
                  createdDate: createdDate,
                });
              } else {
                const existingDate = existingObject.date;
                const existingQualityIndicator = existingObject.qualityIndicator;
          
                if (qualityIndicator.includes("A") && createdDate.getTime() > existingObject.createdDate.getTime()) {
                  // If the current object has the letter "A" and a more recent date, push the existing object
                  dataArray.splice(dataArray.indexOf(existingObject), 1, {
                    date: existingDate,
                    value: existingObject.value,
                    network: existingObject.network,
                    qualityIndicator: existingQualityIndicator,
                    createdDate: existingObject.createdDate,
                  });
                } else if (!qualityIndicator.includes("A") && createdDate.getTime() < existingObject.createdDate.getTime()) {
                  // If the current object doesn't have the letter "A" and has an older date, push the current object
                  dataArray.splice(dataArray.indexOf(existingObject), 1, {
                    date: new Date(applicableFor),
                    value: parseFloat(value),
                    network: network,
                    qualityIndicator: qualityIndicator,
                    createdDate: createdDate,
                  });
                }
              }
            });
          }

          const uniqueDates = Array.from(new Set(dataArray.map((obj) => obj.date))); // Get unique dates
          const filteredArray = [];

          for (const date of uniqueDates) {
            const objectsWithSameDate = dataArray.filter((obj) => obj.date.getTime() === date.getTime());
            const latestCreatedDate = new Date(Math.max(...objectsWithSameDate.map((obj) => obj.createdDate.getTime())));

            const latestObjects = objectsWithSameDate.filter((obj) => obj.createdDate.getTime() === latestCreatedDate.getTime());
            filteredArray.push(...latestObjects);
          }

          const returnedArray = filteredArray;
          resolve(returnedArray);
        });
      });
    });
  }
}
