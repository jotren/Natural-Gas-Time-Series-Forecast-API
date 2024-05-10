import { AppDataSource } from "../../util/data-source"
import { WeatherDataEntity } from "../../entities/weatherDataEntity";
const roundedMedian = (value: number) => Math.round(value * 100) / 100;

const uploaded_at = new Date()
const stormglassRepository = AppDataSource.getRepository(WeatherDataEntity)

// Function to upload data to the SQLite database
export async function uploadStormglassDataToSQLite(data: any[]) {

  for (const entry of data) {
    const { date, grid_id, ...values } = entry;
    // Check if an entry with the same date and grid_id exists
    const uploaded_at = new Date()

    const existingEntry = await stormglassRepository.findOne({ where: { date, grid_id } })
    if (existingEntry) {

      existingEntry.windSpeed_min = values.windSpeed_min
      existingEntry.windSpeed_median = roundedMedian(values.windSpeed_median)
      existingEntry.windSpeed_max = values.windSpeed_max
      existingEntry.airTemperature_min = values.airTemperature_min
      existingEntry.airTemperature_median = roundedMedian(values.airTemperature_median)
      existingEntry.airTemperature_max = values.airTemperature_max
      existingEntry.humidity_min = values.humidity_min
      existingEntry.humidity_median = roundedMedian(values.humidity_median)
      existingEntry.humidity_max = values.humidity_max
      existingEntry.precipitation = values.precipitation
      existingEntry.uploaded_at = values.uploaded_at

      await stormglassRepository.save(existingEntry);
      console.log(`Updated data for ${date} in ${grid_id}`)

    } else {
      const newEntry = stormglassRepository.create({
        date: date,
        grid_id: grid_id,
        windSpeed_median : roundedMedian(values.windSpeed_median),
        windSpeed_min : values.windSpeed_min,
        windSpeed_max : values.windSpeed_max,
        airTemperature_min : values.airTemperature_min,
        airTemperature_median : roundedMedian(values.airTemperature_median),
        airTemperature_max : values.airTemperature_max,
        humidity_min : values.humidity_min,
        humidity_median : roundedMedian(values.humidity_median),
        humidity_max : values.humidity_max,
        precipitation : values.precipitation,
        uploaded_at : uploaded_at
      });

      await stormglassRepository.save(newEntry)
      console.log(`Uploaded data for ${date} in ${grid_id}`)
  }
  }
}