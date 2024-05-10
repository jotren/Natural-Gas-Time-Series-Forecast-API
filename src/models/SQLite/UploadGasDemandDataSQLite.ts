import { AppDataSource } from "../../util/data-source"
import { GasDemandEntity } from "../../entities/gasDemandEntity";
import { GasDemandForecastEntity } from "../../entities/gasDemandForecastEntity";

// Get the repository for the GasDemandForecastEntity
const forecastRepository = AppDataSource.getRepository(GasDemandForecastEntity);

// Get the repository for the GasDemandEntity
const demandRepository = AppDataSource.getRepository(GasDemandEntity);

// Function to upload data to the SQLite database
export async function uploadGasDemandDataToSQLite(data: any[], forecastVsActual: string): Promise<void> {
  
  const currentUploadDate: Date = new Date()

  if (forecastVsActual === "F") {

      for (const entry of data) {
        let { date, predictedDemand, network } = entry;

        // Convert the date to an ISO 8601 string format
        const isoDateString = date.toISOString();
        const dateOnlyString = isoDateString.substring(0, 10);
        
        // Check if an entry with the same date and network exists
        const existingEntry = await forecastRepository.findOne({ where: { date: dateOnlyString, network } });

        if (existingEntry) {
          existingEntry.date = dateOnlyString;
          existingEntry.gas_demand = predictedDemand;
          existingEntry.actual_forecast = forecastVsActual;
          existingEntry.uploaded_at = currentUploadDate;

          await forecastRepository.save(existingEntry);
          console.log(`Updated Forecast data for ${date} in ${network}`)

        } else {
          // Insert a new entry

          const newEntry = forecastRepository.create({
            date: dateOnlyString,
            network,
            gas_demand: predictedDemand,
            actual_forecast: forecastVsActual,
            uploaded_at: currentUploadDate,
          });

          await forecastRepository.save(newEntry);
          console.log(`Uploaded Forecast data for ${date} in ${network}`)
        }
      }

      const currentDate: Date = new Date()
  
      for (const entry of data) {
        let { date, predictedDemand, network } = entry;

        // Convert the date to an ISO 8601 string format
        const isoDateString = date.toISOString();
        const dateOnlyString = isoDateString.substring(0, 10);

        if (date >= currentDate) {
                
            // Check if an entry with the same date and network exists
            const existingEntry = await demandRepository.findOne({ where: { date: dateOnlyString, network } });

            if (existingEntry) {
              existingEntry.date = dateOnlyString;
              existingEntry.gas_demand = predictedDemand;
              existingEntry.actual_forecast = forecastVsActual;
              existingEntry.uploaded_at = currentUploadDate;

              await demandRepository.save(existingEntry);
              console.log(`Updated Actual_Forecast data for ${date} in ${network}`)

            } else {

                // Insert a new entry
              const newEntry = demandRepository.create({
                date: dateOnlyString,
                network,
                gas_demand: predictedDemand,
                actual_forecast: forecastVsActual,
                uploaded_at: currentUploadDate,
              });

              await demandRepository.save(newEntry);
              console.log(`Uploaded Actual_Forecast data for ${date} in ${network}`)

            }
          }
        }
    } else {

    for (const entry of data) {
      let { date, value, network } = entry;
      
      // Convert the date to an ISO 8601 string format
      const isoDateString = date.toISOString();
      const dateOnlyString = isoDateString.substring(0, 10);

      // Check if an entry with the same date and network exists
      const existingEntry = await demandRepository.findOne({ where: { date: dateOnlyString, network } });

      if (existingEntry) {
        existingEntry.date = dateOnlyString;
        existingEntry.gas_demand = value;
        existingEntry.actual_forecast = forecastVsActual;
        existingEntry.uploaded_at = currentUploadDate;

        await demandRepository.save(existingEntry);
        console.log(`Updated Actual data for ${date} in ${network}`)

      } else {
        
        const newEntry = demandRepository.create({
          date: dateOnlyString,
          network,
          gas_demand: value,
          actual_forecast: forecastVsActual,
          uploaded_at: currentUploadDate,
        });

        await demandRepository.save(newEntry)
        console.log(`Uploaded Actual data for ${date} in ${network}`)

     }}
  }
}
  