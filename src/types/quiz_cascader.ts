export interface IBaseInfo {
    id: number;
    name: string;
}
export interface IGradeInfo {
    v: IBaseInfo;
    children: IBaseInfo[];
}
export interface ISubjectInfo {
    v: IBaseInfo;
    children: IGradeInfo[];
}
export interface IQuizInfo {
    quiz: IBaseInfo;
    subject: IBaseInfo;
    grade: IBaseInfo;
    volume: IBaseInfo;
}

export interface IQuizCascaderTitle {
    label: string;
    items: IBaseInfo[];
}

export class QuizInfo implements IQuizInfo {
    quiz: IBaseInfo = { id: 0, name: '' };
    subject: IBaseInfo = { id: 0, name: '' };
    grade: IBaseInfo = { id: 0, name: '' };
    volume: IBaseInfo = { id: 0, name: '' };
}
