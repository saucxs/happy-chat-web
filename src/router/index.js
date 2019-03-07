import Vue from 'vue'
import Router from 'vue-router'
import Robot from "@/pages/Robot";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/robot"
    },
    { //机器人聊天
      path: "/robot",
      component: Robot
    },
  ]
})
