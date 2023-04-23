import service from "./index"


export class Api {
    static getSubjectList() {
        return service({
            url: "subject/",
            method: "GET"
        })
    }
    static getQuizList(){
        return service({
            url: "quiz/",
            method: "GET"
        })
    }
    static getQuestionListByQuizId(id:number){
        return service({
            url: `question/?search=${id}`,
            method:"GET"
        })
    }
}