import Api from "../api/api";
import * as types from "./mutation-types";

// chatRobot
export const chatRobot = ({commit},params) => {
  return Api.chatRobot(params).then(res => {
    if (res) {
      if (res.data.code === 100000) {
        commit(types.robotMsgMutation, {
          message: res.data.text,
          user: "robot"
        });
      } else if (res.data.code === 200000) {
        let data = res.data.text + res.data.url;
        commit(types.robotMsgMutation, {
          message: data,
          user: "robot"
        });
      } else if (res.data.code === 302000) {
        commit(types.robotMsgMutation, {
          message: "暂不支持此类对话",
          user: "robot"
        });
      } else {
        commit(types.robotMsgMutation, {
          message: "暂不支持此类对话",
          user: "robot"
        });
      }
    }
  }).catch(err => {
      console.log(err);
  });
};

/*注册-未激活*/
export const register = ({commit},params) => {
  return Api.register(params).then(res => {
    return res;
  }).catch(err => {
    console.log(err);
  });
};
/*注册-激活*/
export const activateEmail = ({commit},params) => {
  return Api.activateEmail(params).then(res => {
    return res;
  }).catch(err => {
    console.log(err);
  });
};
/*登陆*/
export const login = ({commit},params) => {
  return Api.login(params).then(res => {
    return res;
  }).catch(err => {
    console.log(err);
  });
};

/*查找人*/
export const findPerson = ({commit},params) => {
  return Api.findPerson(params).then(res => {
    return res;
  }).catch(err => {
    console.log(err);
  });
};

/*获取用户资料*/
export const queryUserInfo = ({commit},params) => {
  return Api.queryUserInfo(params).then(res => {
    return res;
  }).catch(err => {
    console.log(err);
  });
};

/*获取新朋友列表*/
export const getNewFriends = ({commit},params) => {
  return Api.getNewFriends(params).then(res => {
    console.log(res, '12423423423423423')
    commit(types.newFriendMutation, res.data.data.newFriends);
  }).catch(err => {
    console.log(err);
  });
};


