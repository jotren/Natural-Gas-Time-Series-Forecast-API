import { GovBankHolidays } from "../models/BankHolidays/GovBankHolidays";
import { ICalculatePredictedDemandLRConstants } from "../interfaces/ICalculatePredictedDemandLRConstants"

const govermentBankHolidays: any = new GovBankHolidays()

export async function addBankHolidayFlag(data: ICalculatePredictedDemandLRConstants[]): Promise<any[]> {
  
    const bankHolidayDates: any = await govermentBankHolidays.getBankHolidays()
    const bankHolidayDatesList = bankHolidayDates['england-and-wales']['events'].map((event: any) => event.date);

    const updatedData: ICalculatePredictedDemandLRConstants[] = [];
    data.forEach((obj) => {
      const dateString = obj.date.toISOString().substring(0, 10);
      const isBankHoliday = bankHolidayDatesList.includes(dateString) ? 1 : 0;
      const updatedObj = { ...obj, bankHoliday: isBankHoliday };
      updatedData.push(updatedObj);
    });
  
    updatedData.sort((a: ICalculatePredictedDemandLRConstants, b: ICalculatePredictedDemandLRConstants) =>
  new Date(a.date).getTime() - new Date(b.date).getTime()
);


    return updatedData;
  }
  