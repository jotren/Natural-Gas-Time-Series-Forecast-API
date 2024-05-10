import { linearRegression } from "simple-statistics";

export async function transformLinearRegressionData(data: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const linearRegressionObject: any[] = [];

    for (const obj of data) {
      const xValues: number[] = [];
      const yValues: number[] = [];

      for (let i = 0; i < obj.demandValues.length; i++) {
        const demandYear = obj.demandYear[i];
        const tempIndex = obj.tempYear.indexOf(demandYear);

        if (tempIndex !== -1 && !isNaN(obj.tempValues[tempIndex]) && !isNaN(obj.demandValues[i])) {
          xValues.push(obj.tempValues[tempIndex]);
          yValues.push(obj.demandValues[i]);
        }
      }

      if (xValues.length >= 2) {
        // Perform linear regression analysis
        const regressionLine = linearRegression([xValues, yValues]);

        // Extract slope and intercept from the regression result
        const slope = regressionLine.m;
        const intercept = regressionLine.b;

        const updatedData: any = {
          ...obj,
          m: Number(slope.toFixed(4)),
          c: Number(intercept.toFixed(4)),
        };

        linearRegressionObject.push(updatedData);
      }
    }

    resolve(linearRegressionObject);
  });
}
