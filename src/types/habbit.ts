export interface IHabbit {
    id: number,
    name: string,
    description: string,
    times_per_week: number,
    checks: boolean[], //length = 7 from monday to sunday
}

export class Habbits {
    start_day: string = ''
    end_day: string = ''
    today: string = ''
    first_day_this_week = ''
    week_titles: string[] = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    data: IHabbit[] = []
}

export interface IBigDay {
    user: number,
    name: string,
    description: string,
    date: string,
}

export interface IGreatEvent extends IBigDay{
    image: string
}