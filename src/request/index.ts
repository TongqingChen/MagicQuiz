import axios, { HttpStatusCode } from 'axios'
import { IQuestionResult, IQuizResult, IUserInfo } from '@/types/http'
import { ISettings } from '@/types/settings'

let api_base_url = ''
// vite
if (import.meta.env.DEV == true) {
    api_base_url = 'http://localhost:8000/'
} else if (import.meta.env.PROD == true) {
    api_base_url = 'http://192.168.1.7:2345/'
}

const Axios = axios.create({
    // baseURL: 'http://192.168.1.7:2345/',
    baseURL: api_base_url,
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
        const user_id = Api.loadUserIdFromStorage()
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
        const user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `quizs/?user_id=${user_id}`,
            method: "GET"
        })
    }
    static getQuestionListByQuizId(id: number) {
        return Axios({
            url: `questions/?quiz__id=${id}`,
            method: "GET"
        })
    }
    static getQuestionListRandom(sub_name: string, nums: number[]) {
        var url = `random_quiz/?sub_name=${sub_name}`
        nums.forEach(n => url += `&nums=${n}`)
        return Axios({
            url: url,
            method: "GET"
        })
    }
    static getQuestionListBySubjectIdAndPage(id: number, pageId: number) {
        return Axios({
            url: `questions/?page=${pageId}&quiz__id=${id}`,
            method: "GET"
        })
    }
    static getWrongSetsBySubjectId(sub_id: number) {
        const user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `wrongsets/?user__id=${user_id}&question__quiz__subject__id=${sub_id}`,
            method: "GET"
        })
    }

    static getBigDays() {
        const user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: `bigdays/?user__id=${user_id}`,
            method: "GET"
        })
    }

    static getHabbits() {
        const user_id = Api.loadUserIdFromStorage()
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

    //sub_name为空Null--表示全部
    static getWrongSetsMixedBySubName(sub_name: string | null = null) {
        const user_id = Api.loadUserIdFromStorage()
        return Axios({
            url: 'wrongsets_mixpost/?user_id=' + (sub_name ? `${user_id}&sub_name=${sub_name}` : `${user_id}`),
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

    static getArticles() {
        return Axios({
            url: "articles/",
            method: "GET"
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

    static storeSettings(sets: ISettings) {
        localStorage.setItem("settings", JSON.stringify(sets))
    }
    static loadSettings() {
        var str = localStorage.getItem("settings")
        if (str) {
            return JSON.parse(str)
        }
        return null
    }
}