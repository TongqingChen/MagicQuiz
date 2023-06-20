export enum QueType {
    UNKNOWN = -1,
    CHOICE = 0,
    LOGIC,
    CODING
}
export interface IQuestion {
    index: number,
    id: number,
    type: number,
    title: string,
    description: string,
    image: string | null,
    answer: string,
    analysis: string,
    difficulty_level: number,
    score: number,
}


export class Question implements IQuestion {
    index: number = -1 //index in an exam
    id: number = -1 //identify 
    type: number = QueType.UNKNOWN
    title: string = ""
    description: string = ""
    image: string | null = null
    answer: string = ""
    analysis: string = ""
    difficulty_level: number = -1
    doubt: boolean = false
    userAnswer: string = ""
    displayType: string = ""
    score: number = 0
}

interface IQuestionListWithType {
    typeId: number,
    typeName: string,
    icon: string,
    qList: Question[]
}

export enum ExamState {
    IDLE = 0,
    ONGOING = 1,
    FINISHED = 2
}

export class ExamInfo {
    scores: number = 0
    id: number = 0
    state: ExamState = ExamState.IDLE   //0-未开始， 1-考试中, 2-已结束
    start_time: number = 0
    use_minutes: number = 0
    name: string = ''
    subjectId: number = 0
    subjectName: string = ''
    question_num: number = 0
    exam_seconds: number = 0
    meta: IQuestionListWithType[] = []
}