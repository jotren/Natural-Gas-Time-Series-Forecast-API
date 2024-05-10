import { ICognitiveAPIResponseObject } from "./ICognitiveAPIResponseObject"

//Interfaces can also define what methods a class will use as well as properties. In this case the interface is telling the script
//That the method will be getNetworkLocations and return a promise with these constants
export interface ICognitiveAPIResponseSource {

    getGasDemandData(start: Date, end: Date, network: string): Promise<ICognitiveAPIResponseObject[]>;
    
}
