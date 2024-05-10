import { IPrepareMachineLearningObjectsSource } from "../../interfaces/IPrepareMachineLearningObjectsSource";
import { ICalculatePredictedDemandLRConstants } from "../../interfaces/ICalculatePredictedDemandLRConstants";

export class PrepareMachineLearningObjectsClass implements IPrepareMachineLearningObjectsSource {
  constructor() {}

  async PreparePredictedDemandML(dataset: ICalculatePredictedDemandLRConstants[], startDate: Date, endDate: Date): Promise<{ X_train: number[], y_train: number[], X_test: number[], y_test: number[], dateTracker: Date[] }> {
    const startForecastDate = new Date(startDate);
    const endForecastDate = new Date(endDate);
  
    const filteredDataset = dataset.filter((obj) => new Date(obj.date) < startForecastDate);
    const alignedDataset: any = await this.filterObjectsByMajorityLength(filteredDataset);
    const removeMCValuesObject: any = await this.removeMCValues(alignedDataset);
  
    const transformedInputs: any[] = [];
    const transformedOutputs: any[] = [];
    const dateTracker: any[] = [];
  
    removeMCValuesObject.forEach((data: any) => {
      const transformedLocations: number[] = [];
      for (const location in data.locations) {
        const locationObj = data.locations[location];
        const values = Object.values(locationObj) as number[];
        transformedLocations.push(...values);
      }
  
      transformedInputs.push([
        data.dayOfYear,
        data.year,
        data.dayOfMonth,
        data.dayOfWeek,
        data.predictedDemand,
        ...transformedLocations
      ]);
      transformedOutputs.push(data.actualDemand);
      dateTracker.push(data.date);
    });
  
    // Convert transformedInputs and transformedOutputs to NumPy arrays
    const X_train: number[] = transformedInputs;
    const y_train: number[] = transformedOutputs;
  
    // Splitting data into test set
    const testDataset = dataset.filter((obj) => new Date(obj.date) >= startForecastDate && new Date(obj.date) <= endForecastDate);
    const alignedDatasetTest: any = await this.filterObjectsByMajorityLength(testDataset);
    const removeMCValuesObjectTest: any = await this.removeMCValues(alignedDatasetTest);

    const transformedTestInputs: any[] = [];
    const testDateTracker: any[] = []; // New array to store test dataset dates
    for (const data of removeMCValuesObjectTest) {
      const transformedTestLocations: number[] = [];
      for (const location in data.locations) {
        const locationObj = data.locations[location];
        const values = Object.values(locationObj) as number[];
        transformedTestLocations.push(...values);
      }
      transformedTestInputs.push([
        data.dayOfYear,
        data.year,
        data.dayOfMonth,
        data.dayOfWeek,
        data.predictedDemand,
        ...transformedTestLocations
      ]);
      testDateTracker.push(data.date); // Store dates for test dataset
    }
    const X_test: number[] = transformedTestInputs;
    const y_test: number[] = testDataset.map((data) => data.actualDemand);
  
    return {
      X_train,
      y_train,
      X_test,
      y_test,
      dateTracker: testDateTracker // Use the test dataset dates for dateTracker
    };
  }
  
  private async removeMCValues(data: any[]): Promise<any[]> {
    const newData = data.map((item) => {
      const { locations, ...rest } = item;
      const newLocations: any = {};

      for (const key in locations) {
        const { m, c, ...locationData } = locations[key];
        newLocations[key] = locationData;
      }

      return {
        ...rest,
        locations: newLocations,
      };
    });

    return newData;
  }

  private async filterObjectsByMajorityLength(arr: any[]): Promise<any[]> {
    if (arr.length === 0) {
      return []; // Return empty array if input array is empty
    }
  
    // Find the majority length
    const lengthCounts: Record<number, number> = {};
    let majorityLength: number | undefined;
    let majorityCount = 0;
  
    for (const obj of arr) {
      const length = this.getObjectLength(obj);
  
      lengthCounts[length] = (lengthCounts[length] || 0) + 1;
  
      if (lengthCounts[length] > majorityCount) {
        majorityLength = length;
        majorityCount = lengthCounts[length];
      }
    }
  
    // Remove objects with lengths different from the majority
    const filteredArr: any[] = [];
  
    for (const obj of arr) {
      const length = this.getObjectLength(obj);
  
      if (length === majorityLength) {
        filteredArr.push(obj);
      }
    }
  
    return filteredArr;
  }
  
  private getObjectLength(obj: any): number {
    let length = Object.keys(obj).length;
  
    if (obj.locations) {
      length += Object.keys(obj.locations).length;
    }
  
    return length;
  }
  
}
