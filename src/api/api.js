"use strict";
// 引入vue和axios
import Vue from "vue";
import axios from "axios";
import router from '../router'

// 继承vue的原型方法
Vue.prototype.axios = axios;
const service = axios.create({
  baseURL: '/',
  // baseURL: '/',
  timeout: 10000
})

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
  // API请求example
  chatRobot: params => {
  return service.get("/api/chat/robot", params);
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
