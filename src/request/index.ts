import axios, { HttpStatusCode } from 'axios'
import { IQuestionResult, IQuizResult, IUserInfo } from '@/types/http'

const Axios = axios.create({
    //baseURL: 'http://192.168.1.7:2345/',
    baseURL: 'http://localhost:8000/',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json;charset=utf-8;"
    }
})

//请求拦截
Axios.interceptors.request.use((config) => {
    config.headers = config.headers || {}
    var ui = Api.loadUserInfoFromStorage()
    if (ui) {
        // config.headers.token = localStorage.getItem("token") || ""
        config.headers['Authorization'] = `Bearer ${ui.access}`
    }
    return config
}, error => {
    return Promise.reject(error)
})
//响应拦截
Axios.interceptors.response.use((response) => {
    return response
}, async (error) => {
    // localStorage.clear()
    if (error.config.url == "api/token/refresh/") {
        Api.clearUserInfo()
    }
    else if (error.response.status == HttpStatusCode.Unauthorized) {
        var ui = Api.loadUserInfoFromStorage()
        if (ui != null) {
            let res = await Api.refreshToken(ui.refresh)
            ui.access = res.data.access
            ui.refresh = res.data.refresh
            Api.storeUserInfo(ui)
            error.config.headers['Authorization'] = `Bearer ${res.data.access}`
            return axios.request(error.config)
        }
    }
    return Promise.reject(error)
}
)

export class Api {
    static login(user_data: { username: string, password: string }) {
        return Axios({
            url: "api/token/",
            method: "POST",
            data: user_data
        })
    }

    static getUserInfo() {
        var user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `users/${user_id}/`,
            method: "GET"
        })
    }

    static uploadUserAvatar(data: any) {
        return Axios({
            url: 'upload_avatar/',
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            data: data
        })
    }

    static updateUserInfo(data: any) {
        var user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `users/${user_id}/`,
            method: "PATCH",
            data: data
        })
    }

    static getSubjectList() {
        return Axios({
            url: "subjects/",
            method: "GET"
        })
    }
    static getQuizList() {
        return Axios({
            url: "quizs/",
            method: "GET"
        })
    }
    static getQuestionListByQuizId(id: number) {
        return Axios({
            url: `questions/?quiz__id=${id}`,
            method: "GET"
        })
    }
    static getQuestionListBySubjectIdAndPage(id: number, pageId: number) {
        return Axios({
            url: `questions/?page=${pageId}&quiz__id=${id}`,
            method: "GET"
        })
    }
    static getWrongSetsByUserIdAndSubjectIdAndPageId(user_id: number, sub_id: number, page_id: number) {
        return Axios({
            url: `wrongsets/?page=${page_id}&user__id=${user_id}&sub_id=${sub_id}`,
            method: "GET"
        })
    }

    static getBigDays() {
        var user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `bigdays/?user__id=${user_id}`,
            method: "GET"
        })
    }

    static getHabbits() {
        var user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `habbits/?user__id=${user_id}&enabled=true`,
            method: "GET"
        })
    }

    static postHabbitRecord(habbit_id: number, date: string, is_register: boolean) {
        return Axios({
            url: "habbit_records/",
            method: "POST",
            data: { "habbit": habbit_id, "date": date, "is_register": is_register }
        })
    }

    static getHabbitRecordByDateRange(start_day: string, end_day: string) {
        var user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `habbit_records/?habbit__user__id=${user_id}&date_after=${start_day}&date_before=${end_day}`,
            method: "GET"
        })
    }

    //sub_id=-1表示全部
    static getWrongSetsMixed(sub_id: number) {
        var user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `wrongsets_mixpost/?user_id=${user_id}&sub_id=${sub_id}`,
            method: "GET"
        })
    }

    static postQuestionsResult(data: IQuestionResult[]) {
        return Axios({
            url: 'wrongsets_mixpost/',
            method: "POST",
            data: data
        })
    }

    static getOverviewInfo() {
        var user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `overview_info/?user_id=${user_id}`,
            method: 'GET'
        })
    }

    static postQuizResult(data: IQuizResult) {
        return Axios({
            url: 'quiz_results/',
            method: "POST",
            data: data
        })
    }

    static refreshToken(refresh_token: string) {
        return Axios({
            url: "api/token/refresh/",
            method: "POST",
            data: { 'refresh': refresh_token }
        })
    }

    static getOralMath(id: number) {
        return Axios({
            url: `oral_math/${id}`,
            method: "GET",
        })
    }

    static verifyToken(token: string) {
        return Axios({
            url: "api/token/verify/",
            method: "POST",
            data: { "token": token }
        })
    }

    static storeUserInfo(user_info: IUserInfo) {
        // 将token进行保存
        localStorage.setItem("user", JSON.stringify(user_info))
    }
    static clearUserInfo() {
        localStorage.removeItem('user')
    }
    static loadUserInfoFromStorage<IUserInfo>() {
        var str = localStorage.getItem("user")
        if (str) {
            return JSON.parse(str)
        } else {
            return null
        }
    }

    static loadUserIdFromStorage() {
        var str = localStorage.getItem("user")
        if (str) {
            return JSON.parse(str).id
        } else {
            return 0
        }
    }
}