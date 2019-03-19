import Vue from 'vue'
import Router from 'vue-router'
import Robot from "@/pages/Robot";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Activate from "@/pages/Activate";
import Message from "@/pages/Message";
import Add from "@/pages/Add";
import AddSeach from "@/pages/AddSeach";
import UserInfo from "@/pages/UserInfo";
import VerifyReq from "@/pages/VerifyReq";
import ContactList from "@/pages/ContactList";
import NewFriends from "@/pages/NewFriends";

Vue.use(Router)

const router = new Router({
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
    { // 消息首页
      path: "/message",
      component: Message
    },
    { //加人或进群
      path: "/add",
      component: Add
    },
    { //搜人
      path: "/add_seach/user/:username",
      component: AddSeach
    },
    { //用户信息卡
      path: "/user_info/:user_id",
      component: UserInfo
    },
    { //加好友请求验证
      path: "/user_info/verify/:user_id",
      component: VerifyReq
    },
    { //通讯录
      path: "/contact_list",
      component: ContactList
    },
    { //加好友通知
      path: "/contact_list/new_friends",
      component: NewFriends
    },

  ]
})

/*路由守卫*/
router.beforeEach((to, from, next) => {
  if (!sessionStorage.HappyChatUserToken) {
    if (to.path === "/login" || to.path === "/register") {
      next();
    } else {
      next("/login");
    }
  } else {
    if (to.path === "/login" || to.path === "/register") {
      next("/robot");
    } else {
      next();
    }
  }
});

export default router;
