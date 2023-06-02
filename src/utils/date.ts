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
        var week_num = this.date.getDay()
        this.goToDaysLater(week_num == 0 ? -6 : (1 - week_num))
    }
}

export class ATime {
    hours: number = 0;
    mins: number = 0;
    secs: number = 0;

    constructor(seconds: number | null = null) {
        if (seconds) {
            this.setSeconds(seconds)
        }
    }
    setSeconds(seconds: number) {
        this.secs = Math.floor(seconds) % 60;
        this.mins = Math.floor(seconds / 60) % 60
        this.hours = Math.floor(seconds / 3600) % 60
    }

    toString() {
        return `0${this.hours}:`.slice(-3) + `0${this.mins}:`.slice(-3) + `0${this.secs}`.slice(-2)
    }
    toStringWithUnit() {
        return `0${this.hours}时`.slice(-3) + `0${this.mins}分`.slice(-3) + `0${this.secs}秒`.slice(-3)
    }
}