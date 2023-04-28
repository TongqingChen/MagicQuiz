export interface IQuestionResult {
    user: number;
    question: number;
    is_correct: boolean;
}
export interface IQuizResult {
    user: number ;
    quiz: number ;
    rel_score: number ;
    abs_score: number ;
    use_minutes: number ;
    note: string ;
}

export class QuizResult {
    meta:IQuizResult={
        user: 0,
        quiz: 0,
        rel_score: 0,
        abs_score: 0,
        use_minutes: 0,
        note: ""
    }
    questions: IQuestionResult[] = []
}