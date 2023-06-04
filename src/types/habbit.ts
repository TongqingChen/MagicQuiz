export interface IHabbit {
    id: number,
    name: string,
    description: string,
    times_per_week: number,
    checks: boolean[], //length = 7 from monday to sunday
}
export interface ITitle{
    date: string,
    week: string
}
export function deepCopyHabbit(from:IHabbit, to:IHabbit){
    to.id = from.id
    to.name = from.name
    to.description = from.description
    to.times_per_week = from.times_per_week
    to.checks = from.checks
}

export class Habbits {
    start_day: string = ''
    end_day: string = ''
    today: string = ''
    first_day_this_week = ''
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

export class GreatEvent implements IGreatEvent{
    user: number = 0
    name: string = ''
    description: string = ''
    date: string = '2022-10-24'
    image: string = ''
}