"use strict";
// 引入vue和axios
import Vue from "vue";
import axios from "axios";

// axios.defaults.baseURL = 'http://localhost:3000';

// 继承vue的原型方法
Vue.prototype.axios = axios;

const service = axios.create({
  baseURL: '/',
  // baseURL: '/',
  timeout: 10000
})

service.interceptors.request.use(config => {
  const token = sessionStorage.getItem('HappyChatUserToken');
  if (token) {
    /*Bearer是JWT的认证头部信息*/
    config.headers.common['Authorization'] = 'Bearer ' + token;
  }
  return config;
},error => {
  return Promise.reject(error);
});

service.interceptors.response.use(
  response => {
    let data = response.data;
    if (!data.data) {
      //   登陆成功的回调地址
      return data;
    } else {
      return data;
    }
  },
  error => ({
    code: -1,
    msg: "网络异常"
  })
);

export default {
  /*robot - get*/
  chatRobot: (params) => {
    params = params.params
    return service.get("/api/chat/robot", params)
  },
  /*注册-未激活 - post*/
  register: (params) => {
    return service.post("/api/chat/register", params)
  },
  /*注册-激活 - get*/
  activateEmail: (params) => {
    params = params.params
    return service.get("/api/chat/activate", params)
  },
  /*登陆 - post*/
  login: (params) => {
    return service.post("/api/chat/login", params)
  },



/**
 * API demo
 *
 * getAPI: (params) => {
 *    getConfig.params = params.params
 *    return axios.get('xxxx.do', getConfig)
 * }
 *
 * postAPI: (params) => {
 *     return axios.post('xxxx.do', params, postConfig)
 * }
 */

}
