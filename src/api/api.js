"use strict";
//  引入vue和axios
import Vue from "vue";
import axios from "axios";
import router from '../router/index';

axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

 // axios.defaults.baseURL = 'http:// localhost:3000';

//  继承vue的原型方法
Vue.prototype.axios = axios;

const service = axios.create({
  // baseURL: '/',
  //  baseURL: 'https://chat.chengxinsong.cn',
  timeout: 10000
})

service.interceptors.request.use(config => {
  const token = localStorage.getItem('HappyChatUserToken');
  if (token) {
    /* Bearer是JWT的认证头部信息 */
    config.headers.common['Authorization'] = 'Bearer ' + token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

service.interceptors.response.use(
  response => {
    let data = response.data;
    if (!data.data) {
      //    登陆成功的回调地址
      return data;
    } else {
      return data;
    }
  },
  error => {
    if(error.response) {
      switch (error.response.status){
        case 401:
          /* 返回401，清空token信息，关闭socketio，并跳转到登陆页 */
          let userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
          socketWeb.emit('logout', userInfo.user_id)
          localStorage.removeItem("HappyChatUserToken");
          localStorage.removeItem("HappyChatUserInfo");
          setTimeout(function() {
            router.push({
              path: "/login",
              query: {redirect: router.currentRoute.fullPath}
            });
          }, 500);
        case 504:
          /*  后端服务器关闭的时候  */
          //  MessageBox.confirm('服务器暂时开了小差，请稍后重试','提示',{
          //    confirmButtonText:'重新连接',
          //    type:'warning',
          //    center: true,
          //    showClose: false,
          //    showCancelButton: false,
          //    closeOnClickModal: false,
          //  }).then(()=>{
          //    console.log('服务器关闭了');
          //    window.location.reload();
          //  })
      }
    } else if (!error.response) {
      /*  断网  */
      //  console.log('我断网了');
      //  console.log(Loading, '----------------')
      //  Loading.installed = true;
      //  Loading.$loading.show();
      MessageBox.confirm('您现在处于无网的状态，请确定网络正常后重试','提示',{
        confirmButtonText: '重新连接',
        type: 'warning',
        center: true,
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false
      }).then(() => {
        console.log('我断网了');
        window.location.reload();
      })
    }
    //  返回接口返回的错误信息
    return Promise.reject(error.response)
  }
);

export default {
  /* robot - get */
  chatRobot: (params) => {
    let data = { params: params };
    return service.get("/api/chat/robot", data)
  },
  /* 注册-未激活 - post */
  register: (params) => {
    return service.post("/api/chat/register", params)
  },
  /* 注册-激活 - get */
  activateEmail: (params) => {
    let data = { params: params };
    return service.get("/api/chat/activate", data)
  },
  /* 登陆 - post */
  login: (params) => {
    return service.post("/api/chat/login", params)
  },
  /* 消息首页列表 - get */
  messageList: (params) => {
    let data = { params: params };
    return service.get("/api/chat/message", data)
  },
  /* 查找人 - get */
  findPerson: (params) => {
    let data = { params: params };
    return service.get("/api/chat/find_people", data)
  },
  /* 获取用户资料 - get */
  queryUserInfo: (params) => {
    let data = { params: params };
    return service.get("/api/chat/user_info", data)
  },
  /* 获取新朋友列表 - get */
  getNewFriends: (params) => {
    let data = { params: params };
    return service.get("/api/chat/get_newfriends", data)
  },
  /* 获取朋友列表 - get */
  getAlreadyFriends: (params) => {
    let data = { params: params };
    return service.get("/api/chat/get_friends", data)
  },
  /* 获取群列表 - get */
  getAlreadyGroups: (params) => {
    let data = { params: params };
    return service.get("/api/chat/get_groups", data)
  },
  /* 查询此用户是否是我的好友 - get */
  isFriendJudge: (params) => {
    let data = { params: params };
    return service.get("/api/chat/is_friend", data)
  },
  /* 插入新朋友 - post */
  insertNewFriends: (params) => {
    return service.post("/api/chat/insert_newfriends", params)
  },
  /* 加为好友 - post */
  beFriends: (params) => {
    return service.post("/api/chat/be_friend", params)
  },
  /* 更新好友状态 - put */
  updateNewFriendsState: (params) => {
    return service.put("/api/chat/update_newfriends", params)
  },
  /* 获取数据库私聊消息 - get */
  getPrivateDetail: (params) => {
    let data = { params: params };
    return service.get("/api/chat/private_detail", data)
  },
  /* 存此条私聊信息到数据库 - post */
  savePrivateMsg: (params) => {
    return service.post("/api/chat/private_save_msg", params)
  },
  /* 修改备注 - put */
  confirmEditorRemark: (params) => {
    return service.put("/api/chat/editor_remark", params)
  },
  /* 修改个人信息 - put */
  confirmEditorInfo: (params) => {
    return service.put("/api/chat/editor_info", params)
  },
  /* 删除好友 - delete */
  confirmDeleteFriend: (params) => {
    let data = { params: params };
    return service.delete("/api/chat/del_friend", data)
  },
  /* 创建群 - post */
  confirmCreateGroup: (params) => {
    return service.post("/api/chat/create_group", params)
  },
  /* 修改群资料- post */
  confirmEditGroup: (params) => {
    return service.post("/api/chat/edit_group", params)
  },
  /* 加群 - post */
  confirmJoinGroup: (params) => {
    return service.post("/api/chat/join_group", params)
  },
  /* 获取群聊记录 - get */
  getGroupChat: (params) => {
    let data = { params: params };
    return service.get("/api/chat/group_chat", data)
  },
  /* 保存此条信息到数据库 - get */
  saveGroupChatMsg: (params) => {
    return service.post("/api/chat/group_chat_msg", params)
  },
  /* 把新成员加入群名单 */
  addGroupChatRelation: (params) => {
    return service.post("/api/chat/group_chat_relation", params)
  },
  /* 获取建群信息 */
  getGroupInformation: (params) => {
    let data = { params: params };
    return service.get("/api/chat/get_group_info", data)
  },
  /* 判断是否在群里 */
  judgeIsInGroup: (params) => {
    let data = { params: params };
    return service.get("/api/chat/is_in_group", data)
  },
  /* 退群 */
  exitChatGroup: (params) => {
    let data = { params: params };
    return service.delete("/api/chat/exit_group", data)
  }
/* *
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
