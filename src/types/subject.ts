export interface ISubject{
    id: number,
    name: string,
    count: number
}

export class SubjectList{
    data:ISubject[] = []
}