const { getDayOfYear, getYear, parseISO } = require('date-fns');

export async function manipulateDemandData(array1: any[]): Promise<any[]> {
  return new Promise((resolve, reject) => {

    const dayOfYearMap = new Map();

    for (const obj of array1) {
      const { date, actualDemand } = obj;
      const formattedDate = date;
      const dayOfYear = getDayOfYear(formattedDate);
      const Year = getYear(formattedDate);

      if (!dayOfYearMap.has(dayOfYear)) {
        dayOfYearMap.set(dayOfYear, { values: [], demandYears: [] });
      }

      const entry = dayOfYearMap.get(dayOfYear);

      if (!entry.values.includes(actualDemand)) {
        entry.values.push(actualDemand);
      }

      if (!entry.demandYears.includes(Year)) {
        entry.demandYears.push(Year);
      }
    }

    const result = [];

    for (const [dayOfYear, entry] of dayOfYearMap.entries()) {
      result.push({ dayOfYear, ...entry });
    }

    // Sort the result array by dayOfYear in ascending order
    result.sort((a, b) => a.dayOfYear - b.dayOfYear);
    resolve(result);
  });
}

// There seems to be a one day offset on these values? 