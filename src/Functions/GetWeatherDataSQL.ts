
export async function cleanWeatherData(weatherObjects: any[]): Promise<any[]> {

  console.log(weatherObjects)

  const modifiedData = weatherObjects.map((obj: any) => {
      const { grid_id, date, airTemperature_min } = obj;
      const convertedDate = new Date(date); // Convert the 'date' string to a Date object
      const temperatureNumber = parseFloat(airTemperature_min);
      return { grid_id: grid_id, date: convertedDate, minAirTemperature: temperatureNumber};
    });

return modifiedData;
}