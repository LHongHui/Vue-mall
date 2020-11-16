import axios from 'axios'
import store from '../../store'
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)
// const server = axios.create({
//     baseURL: process.env.NODE_ENV === 'production' ? '/v1' : '/api/v1',
//     timeout: 2000,  // 超时
// })
//const debug = process.env.NODE_ENV === 'production'
axios.interceptors.request.use((req) => {
    try {
        //if (!debug) {
        //req.url = 'http://app2.yiqigoumall.com' + req.url
        req.url = 'http://localhost:7001' + req.url
        //}
        if (store.getters.token) { // 重要 将token 以http请求头形式传递给服务器
            req.headers.authorization = store.getters.token
        }
        return req;
    } catch (error) {
        console.log(error);
    }
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => {
        MintUI.Indicator.close();
        return response
    },
    error => {
        if (error.response) {
            // if (error.response.status == 401) {
            //     // token 过期本地存储删除，然后重新登录
            //     store.commit('removeToken')
            //     store.commit('removeName')
            //     //Vue.prototype.toast('token过去请重新登录');
            //     window.location.href = '/login'
            // }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    })

// 默认请求成功状态 axios 封装(get,post)
/*
   url  : 后台路由地址  /index/carousels
   type:  get , post
   params 传递参数

   axios.get('/index/carousels',{params}).then(res => {}).catch(err => {})
   axios.post('/index/carousels',params).then(res => {}).catch(err => {})
   axios({
       method:'post'
       ...
   })
*/
export default (url, type = 'post', params) => {
    return axios[type](url, type == 'get' ? { params } : params, { withCredentials: true }).then(res => {
        const { status, data } = res;

        //console.log(data);
        // 正确状态处理
        if (status == 200) {
            return res;
        }


    }).catch(err => {
        return Promise.reject(err)   // 返回接口返回的错误信息
    })

}





