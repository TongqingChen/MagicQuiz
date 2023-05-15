export class ADate {
    date: Date;
    constructor(date?: string) {
        if (date) {
            this.date = new Date(date)
        } else {
            this.date = new Date()
        }
    }
    toString() {
        let month: string | number = this.date.getMonth() + 1;
        let day: string | number = this.date.getDate();
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        return this.date.getFullYear() + "-" + month + "-" + day
    }
    goToDaysLater(days: number) {
        this.date.setDate(this.date.getDate() + days)
    }
    goToFirstDayOfThisWeek() {
        this.goToDaysLater(-(this.date.getDay() - 1))
    }
}