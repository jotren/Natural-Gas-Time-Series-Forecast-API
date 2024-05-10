import axios from "axios";

export interface IBankHolidays {
    "england-and-wales": IDivisionBankHolidays
    "scotland": IDivisionBankHolidays
    "northern-ireland": IDivisionBankHolidays
}

export interface IDivisionBankHolidays {
    division: string
    events: IBankHoliday[]
}

export interface IBankHoliday {
    title: string
    date: string
    notes: string
    bunting: boolean
}

export class GovBankHolidays {

    private bankHolidaysStr: string | null = null;
    private cachedAt: Date | null = null;
    private maxAgeSeconds: number = 600;

    constructor() {}

    async getBankHolidays(): Promise<IBankHolidays> {
        // check for cached value
        if (this.resultIsCached()) {
            return this.cachedResult();
        }

        const bankHolidaysJson: IBankHolidays = (await axios.get('https://www.gov.uk/bank-holidays.json')).data;
        this.bankHolidaysStr = JSON.stringify(bankHolidaysJson);
        
        return this.cachedResult();
    }

    private resultIsCached() {
        if (!this.cachedAt) return false;
        if (!this.bankHolidaysStr) return false;
        return ((Date.now() - this.cachedAt.valueOf()) <= (this.maxAgeSeconds * 1000))
    }

    private cachedResult(): IBankHolidays {
        if (this.bankHolidaysStr === null) {
            throw new Error("Bank holidays data is null.");
        }
        return JSON.parse(this.bankHolidaysStr);
    }
    

}

// static singleton