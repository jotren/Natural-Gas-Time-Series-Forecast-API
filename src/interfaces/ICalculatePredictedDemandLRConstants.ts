export interface ICalculatePredictedDemandLRConstants {
  date: Date;
  actualDemand: number;
  locations: Record<string, any>;
  dayOfYear: number;
  year: number;
  dayOfMonth: number;
  dayOfWeek: number;
  predictedDemand: number;
  }