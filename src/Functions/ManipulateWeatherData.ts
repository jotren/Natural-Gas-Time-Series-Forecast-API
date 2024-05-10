const { getDayOfYear, getYear, parseISO } = require('date-fns');

export async function manipulateWeatherData(weatherArray: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const dayOfYearMap = new Map();
    
    for (const obj of weatherArray) {
      const { grid_id, date, minAirTemperature } = obj;
      const dayOfYear = getDayOfYear(date);
      const year = getYear(date);

      if (!dayOfYearMap.has(dayOfYear)) {
        dayOfYearMap.set(dayOfYear, new Map());
      }

      const networkMap = dayOfYearMap.get(dayOfYear);

      if (!networkMap.has(grid_id)) {
        networkMap.set(grid_id, { tempYears: [], minAirTemperature: [] });
      }

      const entry = networkMap.get(grid_id);

      if (!entry.minAirTemperature.includes(minAirTemperature)) {
        entry.minAirTemperature.push(minAirTemperature);
      }

      if (!entry.tempYears.includes(year)) {
        entry.tempYears.push(year);
      }
    }

    const result: any = [];

    for (const [dayOfYear, networkMap] of dayOfYearMap.entries()) {
      for (const [network, entry] of networkMap.entries()) {
        result.push({ dayOfYear, network, ...entry });
      }
    }

    resolve(result);
  });
}
