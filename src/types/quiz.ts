import { IGrade, ISubject, IVolume } from "@/types/subject"

export interface IQuiz {
    id: number,
    name: string,
    subject: number,
    grade: number,
    volume: number,
    tag: string,
    question_counts: [{ id: number, name: string, count: number }],
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
    grade: IGrade = {
        id: -1,
        name: '',
        count: 0
    }
    volume: IVolume = {
        id: -1,
        name: '',
        count: 0
    }
    currentPage: number = 0
    quizNum: number = 0
    pageSize: number = 20
    quizList: IQuiz[] = []
    quizDisplay: IQuiz[] = []
}