import { ISubject } from "@/types/subject"

export interface IQuiz {
    id: number,
    name: string,
    subject: number,
    subject_name: string,
    choice_num: number,
    logic_num: number,
    coding_num: number,
    last_exam_time: string,
    exam_minutes: number
}

export class QuizPages {
    subject: ISubject = {
        id: 0,
        name: "",
        count: 0
    }
    currentPage: number = 1
    quizNum: number = 0
    pageSize: number = 16
    quizList: IQuiz[] = []
    quizDisplay: IQuiz[] = []
}