import { Interface } from "readline";

export interface IQuestionResult {
    user: number;
    question: number;
    is_correct: boolean;
}
export interface IQuizResult {
    user: number;
    quiz: number;
    rel_score: number;
    abs_score: number;
    use_minutes: number;
    note: string;
}

export interface IQuizResultPlus extends IQuizResult {
    id: number;
    quiz_name: string;
    date_time: string;
}

export class QuizResult {
    meta: IQuizResult = {
        user: 0,
        quiz: 0,
        rel_score: 0,
        abs_score: 0,
        use_minutes: 0,
        note: ""
    }
    questions: IQuestionResult[] = []
}


export interface IWrongSet {
    qid: number;
    quiz_name: string;
    title: string;
    type: string;
    description: string;
    image: string;
    answer: string;
    level: string;
    record_times: number;
}
export class WrongSet implements IWrongSet {
    qid: number = 0;
    quiz_name: string = '';
    title: string = '';
    type: string = '';
    description: string = '';
    image: string = '';
    answer: string = '';
    level: string = '';
    record_times: number = 0;
}
// export class WrongSet{
//     meta: {string:IWrongSet[]} = {'dict':[{qid:0, }]}
// }

export interface IOverviewInfo {
    subject_num: number;
    quiz_num: number;
    question_num: number;
    wrongset_num: number;
    exam_record: {
        [key: string]: IQuizResultPlus[]
    }
}
export class OverviewInfo implements IOverviewInfo {
    subject_num = 0;
    quiz_num = 0;
    question_num = 0;
    wrongset_num = 0;
    exam_record = {}
}