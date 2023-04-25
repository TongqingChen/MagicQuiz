import axios, { HttpStatusCode } from 'axios'

const service = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    }
})

//请求拦截
service.interceptors.request.use((config) => {
    config.headers = config.headers || {}
    if (localStorage.getItem("token")) {
        // config.headers.token = localStorage.getItem("token") || ""
        config.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`
    }
    return config
}, error=>{
    return Promise.reject(error)
}
)


//响应拦截
service.interceptors.response.use(response => {
    if (response.status != HttpStatusCode.Ok) {
        localStorage.clear()
        return Promise.reject(response)
    }
    return response
}, (error) => {
    console.error(error)
    localStorage.clear()
    return Promise.reject(error)
})

export default service