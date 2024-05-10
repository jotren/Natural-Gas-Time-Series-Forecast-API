import { IPrepareMachineLearningObjectsSource } from "../../interfaces/IPrepareMachineLearningObjectsSource";
import { ICalculatePredictedDemandLRConstants } from "../../interfaces/ICalculatePredictedDemandLRConstants"
import { PrepareMachineLearningObjectsClass } from "../gasDemandPrediction/PrepareMachineLearningClass";
import { uploadGasDemandDataToSQLite } from '../SQLite/UploadGasDemandDataSQLite';

import axios from 'axios';

const calculatedPredictedDemandMLClass: IPrepareMachineLearningObjectsSource = new PrepareMachineLearningObjectsClass()

export class SendMLDataToPythonAPI {
    constructor (
      private baseApiURL: string,
    ) {}

    async sendMLDatatoPythongAPI(dataset: ICalculatePredictedDemandLRConstants[], startDate: string, endDate: string, network: string): Promise<string> {

      try{ 

        console.log(startDate,endDate)

        const startForecastDate = new Date(startDate);
        const endForecastDate = new Date(endDate);
        let terminateLoop: number = 0

        // Iterate through dates using a for loop
        for (let currentDate = new Date(startForecastDate); currentDate <= endForecastDate; currentDate.setDate(currentDate.getDate() + 1)) {
            // Perform operations with the current date

            const matchedObject = dataset.find(obj => obj.date.getTime() === currentDate.getTime());
            let futureDate = new Date(currentDate);

            if (matchedObject) {
            // Perform operations with the matched object
            console.log("Matched Object:", matchedObject.actualDemand);

            // Check if actualDemand is 0 and break the loop
            if (matchedObject.actualDemand === 0 && terminateLoop === 1) {
                console.log("actualDemand is 0. Breaking the loop.");
                break;
                }

            if (matchedObject.actualDemand === 0) {
            futureDate.setDate(futureDate.getDate() + 7);
            terminateLoop = 1
            }

            if (futureDate > endForecastDate) {
                futureDate = endForecastDate
                console.log('Future Date was Reduced')
            }
            }

            const objectPredictedDemandML = await calculatedPredictedDemandMLClass.PreparePredictedDemandML(dataset,currentDate,futureDate)
            const XTrain = objectPredictedDemandML.X_train
            const yTrain = objectPredictedDemandML.y_train
            const XTest = objectPredictedDemandML.X_test
            const dateTrackerArray = objectPredictedDemandML.dateTracker
            
            const result = await this.sendTrainingDataToPythonAPI(XTrain, yTrain, XTest)

            const combinedArray = dateTrackerArray.map((date, index) => ({
            date,
            predictedDemand: result[index]
            }));
        
            const reducedArray = combinedArray.map(obj => ({
            date: obj.date,
            predictedDemand: parseFloat(obj.predictedDemand).toFixed(5)
            }));
                  
            const updatedArray = reducedArray.map(obj => ({ ...obj, network: network }));
            uploadGasDemandDataToSQLite(updatedArray, "F")
            }

        return "Machine Learning Completed"
          
      } catch (err) {
        console.log(err);
        throw err
      }
    }


    private async sendTrainingDataToPythonAPI(X_train: number[], y_train: number[], X_test: number[]): Promise<any> {

        const apiUrl = `${this.baseApiURL}/process_data`; // Replace with the actual API endpoint
      
        const result: any = 0
      
        try {
          const response = await axios.post(apiUrl, {
            X_train,
            y_train,
            X_test
          });
          const result = response.data;
          return result
    
        } catch (error) {
          console.error('Error sending training data:', error);
          throw error;
        }
      }
}