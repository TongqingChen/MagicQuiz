import { ISubject } from "@/types/subject"

export interface IQuiz {
    id: number,
    name: string,
    subject: number,
    choice_num: number,
    logic_num: number,
    coding_num: number,
    last_exam_time: string,
    exam_minutes: number
}

export class QuizPages {
    subject: ISubject = {
        id: -1,
        name: '',
        logo: '',
        count: 0
    }
    currentPage: number = 0
    quizNum: number = 0
    pageSize: number = 20
    quizList: IQuiz[] = []
    quizDisplay: IQuiz[] = []
}