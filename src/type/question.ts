export class Question {
    index: number = -1 //index in an exam
    id: number = -1 //identify 
    type: number = -1
    title: string = ""
    description: string = ""
    image: string = ""
    answer: string = ""
    userAnswer: string = ""
    displayType: string = ""
}

interface IQuestionListWithType {
    typeId: number,
    typeName: string,
    icon: string,
    qList: Question[]
}

export class ExamInfo {
    id: number = 0
    state: number = 0
    name: string = ''
    subjectId: number = 0
    subjectName: string = ''
    meta: IQuestionListWithType[] = []
}