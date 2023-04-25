import service from "./index"


export class Api {
    static login(user_data: { username: string, password: string }) {
        return service({
            url: "/api/token/",
            method: "POST",
            data:user_data
        })
    }

    static getSubjectList() {
        return service({
            url: "subjects/",
            method: "GET"
        })
    }
    static getQuizList() {
        return service({
            url: "quizs/",
            method: "GET"
        })
    }
    static getQuestionListByQuizId(id: number) {
        return service({
            url: `questions/?quiz__id=${id}`,
            method: "GET"
        })
    }
    static getQuestionListBySubjectIdAndPage(id: number, pageId: number){
        return service({
            url: `questions/?page=${pageId}&quiz__id=${id}`,
            method: "GET"
        })
    }
}