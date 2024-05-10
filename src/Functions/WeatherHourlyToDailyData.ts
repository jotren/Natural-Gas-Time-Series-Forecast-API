export async function aggregateHourlyDataToDailyData(hourlyData: any): Promise<any> {
  // Create an empty object to hold daily data
  const dailyDataMap: { [date: string]: any[] } = {};

  // Loop through hourly data and populate daily data object
  hourlyData.forEach((hourlyDatum: any) => {
    try {
      const date = new Date(hourlyDatum.timestamp).toISOString().substr(0, 10);

      if (!(date in dailyDataMap)) {
        dailyDataMap[date] = [];
      }

      const dailyDataArray = dailyDataMap[date];
      const airTemperature = parseFloat(hourlyDatum.airTemperature);
      const roundedAirTemperature = Number(airTemperature.toFixed(3));

      dailyDataArray.push({
        network: hourlyDatum.network,
        date: new Date(date),
        minAirTemperature: roundedAirTemperature,
        // maxAirTemperature: airTemperature
      });
    } catch {}
  });

  // Flatten daily data object into an array
  const dailyData: any[] = Object.values(dailyDataMap).flat();
  return dailyData;
}
