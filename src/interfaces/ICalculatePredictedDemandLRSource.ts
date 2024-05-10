import { ICalculatePredictedDemandLRConstants } from "./ICalculatePredictedDemandLRConstants";

export interface ICalculatePredictedDemandLRSource{
    calculatePredictedDemandLR(inputArray: any[]): Promise<any>
}