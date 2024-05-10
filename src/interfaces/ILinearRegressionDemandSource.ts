import { ILinearRegressionCalcualtionConstants, IGasDemandConstants} from "../interfaces/ILinearRegressionDemandConstants";

export interface ILinearRegressionDemandSource {
    getLinearRegressionDemandData(network: string, networkNameGDUK: string): Promise<{ dailyDemandDataObjects: IGasDemandConstants[]; transformedLinearRegressionObject: ILinearRegressionCalcualtionConstants[]; }>;
}