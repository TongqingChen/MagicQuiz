interface ISetUnit {
    name: string
    value: boolean
}
export interface ISettings {
    data: ISetUnit[]
}

export enum SetID {
    USER_INFO = 0,
    BIG_DAY,
    SHOW_FINISHED_DAY,
    HABBIT,
    DATA,
    RECODRD,
    EXAM_TIME_BLINK
}
export class Settings implements ISettings {
    data: ISetUnit[] = [
        { name: '用户卡片', value: false },
        { name: '纪念日', value: true },
        { name: '已完成纪念日', value: true },
        { name: '习惯打卡', value: true },
        { name: '统计卡片', value: true },
        { name: '考试记录', value: true },
        { name: '时间数字拆分', value: true }]
    copyFrom(set: ISettings) {
        this.data = set.data
    }
}