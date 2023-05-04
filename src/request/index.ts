import axios, { HttpStatusCode } from 'axios'
import jwtDecode from 'jwt-decode'
import { IQuestionResult, IQuizResult } from '@/types/http'

const Axios = axios.create({
    baseURL: 'http://192.168.1.7:2345/',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    }
})
//请求拦截
Axios.interceptors.request.use((config) => {
    config.headers = config.headers || {}
    if (localStorage.getItem("token")) {
        // config.headers.token = localStorage.getItem("token") || ""
        config.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`
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
        localStorage.clear()
    }
    else if (error.response.status == HttpStatusCode.Unauthorized) {
        var refresh_token = localStorage.getItem('refresh_token')
        if (refresh_token != null) {
            let res = await Api.refreshToken(refresh_token)
            localStorage.setItem('token', res.data.access)
            localStorage.setItem('refresh_token', res.data.refresh)
            error.config.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`
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
            url: `wrongsets/?page=${page_id}&quiz__id=${user_id}&sub_id=${sub_id}`,
            method: "GET"
        })
    }

    //sub_id=-1表示全部
    static getWrongSetsMixed(user_id: number, sub_id: number){
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

    static getOverviewInfo(user_id:number){
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

    static storeToken(token: string, refresh_token: string) {
        // 将token进行保存
        localStorage.setItem("token", token)
        localStorage.setItem("refresh_token", refresh_token)
        var decoded: { user_id: number } = jwtDecode(token)
        localStorage.setItem("user_id", String(decoded.user_id))
    }
}