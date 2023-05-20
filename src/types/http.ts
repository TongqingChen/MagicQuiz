export interface IQuestionResult {
    user: number;
    question: number;
    user_answer: string;
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
    score: number;
    image: string;
    answer: string;
    user_answer: string;
    level: string;
    record_times: number;
}
export class WrongSet implements IWrongSet {
    qid: number = 0;
    quiz_name: string = '';
    title: string = '';
    type: string = '';
    description: string = '';
    score: number = 0;
    image: string = '';
    answer: string = '';
    user_answer: string = '';
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

export interface IUserInfo {
    id: number;
    username: string;
    token: string;
    refresh: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export interface IUserInfoExt extends IUserInfo {
    birthday: Date;
    gender: string;
    email: string;
    mobile: string;
    address: string;
    school: string;
    card_id: string;
    date_joined: Date;
}

export class UserInfo {
    id: number = 2
    avatar: string = ""// http://localhost:8000/media/avatar/2%E5%AF%B8_-_415x627.jpg"
    username: string = ""
    last_name: string = ""
    first_name: string = ""
    birthday: string = ""
    gender: number = 0
    email: string = ""
    mobile: string = ""
    school: string = ""
    address: string = ""
    card_id: string = ""
    date_joined: string = ""

    extractEditableInfo() {
        return {
            "username": this.username,
            "last_name": this.last_name,
            "first_name": this.first_name,
            "birthday": this.birthday,
            "gender": this.gender,
            "email": this.email,
            "mobile": this.mobile,
            "school": this.school,
            "address": this.address,
            "card_id": this.card_id,
        }
    }
}