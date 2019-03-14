import Vue from 'vue'
import Router from 'vue-router'
import Robot from "@/pages/Robot";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Activate from "@/pages/Activate";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    { //机器人聊天
      path: "/robot",
      component: Robot
    },
    { //登录
      path: "/login",
      component: Login
    },
    { //注册
      path: "/register",
      component: Register
    },
    { //激活
      path: "/activate/:code",
      component: Activate
    },
  ]
})
