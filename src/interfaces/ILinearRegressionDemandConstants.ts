export interface ILinearRegressionCalcualtionConstants {
  dayOfYear: number, 
  grid: string,
  demandValues: number[],
  tempValues: number[],
  demandYear: number[],
  tempYear: number[],
  m: number, 
  c: number
}

export interface IGasDemandConstants {
  date: string, 
  actualDemand: number
}


export interface ILinearRegressionDemandConstants {
  dailyDemandDataObjects: IGasDemandConstants;
  transformedLinearRegressionObject: ILinearRegressionCalcualtionConstants;
}