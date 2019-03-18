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
    let data = { params: params }
    return service.get("/api/chat/robot", data)
  },
  /*注册-未激活 - post*/
  register: (params) => {
    return service.post("/api/chat/register", params)
  },
  /*注册-激活 - get*/
  activateEmail: (params) => {
    let data = { params: params }
    return service.get("/api/chat/activate", data)
  },
  /*登陆 - post*/
  login: (params) => {
    return service.post("/api/chat/login", params)
  },
  /*消息首页列表 - get*/
  messageList: (params) => {
    let data = { params: params }
    return service.get("/api/chat/message", data)
  },
  /*查找人 - get*/
  findPerson: (params) => {
    let data = { params: params }
    return service.get("/api/chat/find_people", data)
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
