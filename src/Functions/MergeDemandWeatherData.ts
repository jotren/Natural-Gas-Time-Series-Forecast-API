export async function mergeDemandWeatherData(demandArray: any[], weatherArray: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const mergedObj: any[] = weatherArray.reduce((acc: any[], curr: any) => {
      const matchingObj2 = demandArray.find((obj) => obj.dayOfYear === curr.dayOfYear);
      if (matchingObj2) {
        acc.push({
          dayOfYear: curr.dayOfYear,
          grid: curr.network,
          demandValues: matchingObj2.values,
          tempValues: curr.minAirTemperature,
          demandYear: matchingObj2.demandYears,
          tempYear: curr.tempYears
        });
      }
      return acc;
    }, []);

    resolve(mergedObj);
  });
}
