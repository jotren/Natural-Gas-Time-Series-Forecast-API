import { ICalculatePredictedDemandLRConstants } from "../interfaces/ICalculatePredictedDemandLRConstants";

export interface IPrepareMachineLearningObjectsSource{
    PreparePredictedDemandML(dataset: ICalculatePredictedDemandLRConstants[], startDate: Date, endDate: Date): Promise<{ X_train: number[], y_train: number[], X_test: number[], y_test: number[], dateTracker: Date[] }>
}