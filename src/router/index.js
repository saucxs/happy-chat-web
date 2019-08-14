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
import PrivateChat from "@/pages/PrivateChat";
import Me from "@/pages/Me";
import CreatEditorGroup from "@/pages/CreatEditorGroup";
import GroupChat from "@/pages/GroupChat";
import GroupInfo from "@/pages/GroupInfo";
import Feedback from "@/pages/Feedback";

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    { //  机器人聊天
      path: "/robot",
      component: Robot
    },
    { //  登录
      path: "/login",
      component: Login
    },
    { //  注册
      path: "/register",
      component: Register
    },
    { //  激活
      path: "/activate/:code",
      component: Activate
    },
    { //  消息首页
      path: "/message",
      component: Message
    },
    { //  加人或进群
      path: "/add",
      component: Add
    },
    { //  搜人
      path: "/add_seach/user/:username",
      component: AddSeach
    },
    { //  用户信息卡
      path: "/user_info/:user_id",
      component: UserInfo
    },
    { //  加好友请求验证
      path: "/user_info/verify/:user_id",
      component: VerifyReq
    },
    { //  通讯录
      path: "/contact_list",
      component: ContactList
    },
    { //  加好友通知
      path: "/contact_list/new_friends",
      component: NewFriends
    },
    { //  私聊
      path: "/private_chat/:user_id",
      component: PrivateChat
    },
    { //  个人中心
      path: "/me",
      component: Me
    },
    { //  建群
      path: "/creat_group",
      component: CreatEditorGroup
    },
    { //  编辑群
      path: "/edit_group/:group_id",
      component: CreatEditorGroup
    },
    { //  群聊
      path: "/group_chat/:group_id",
      component: GroupChat
    },
    { //  群信息卡
      path: "/group_info/:group_id",
      component: GroupInfo
    },
    { //  搜群
      path: "/add_seach/group/:groupname",
      component: AddSeach
    },
    { //  留言反馈
      path: "/feedback",
      component: Feedback
    },

  ]
})

/* 路由白名单 */
let whiteRouter = ["/login", "/register", "/activate", "/feedback"]

/* 路由守卫 */
router.beforeEach((to, from, next) => {
  let flag = whiteRouter.some(item => {
    if (to.path.indexOf(item) >= 0) {
      return true
    }
  })
  if (!localStorage.HappyChatUserToken) {
    if (flag) {
      next()
    } else {
      next("/login");
    }
  } else {
    if (flag) {
      next("/robot");
    } else {
      next();
    }
  }
});

export default router;
