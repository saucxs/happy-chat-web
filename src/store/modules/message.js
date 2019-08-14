import {
  msgListMutation, firstLoadMutation, updateListMutation, resetUnredMutation, someOneInfoMutation,
  groupMemberMutation, groupInfoMutation
} from "../mutation-types.js";

const state = {
  firstLoad: true, // 是否是第一次加载首页消息页面
  msgList: [], //  消息首页列表
  someOneInfo: {}, // 某个用户的用户资料
  groupMember: [], // 群成员
  groupInfo: [] // 群资料
};

const mutations = {
  // 是否是第一次加载首页消息页面
  [firstLoadMutation](state, data) {
    state.firstLoad = data;
  },
  // 消息首页列表
  [msgListMutation](state, data) {
    state.msgList = data;
  },
  // 更新首页消息列表
  [updateListMutation](state, data) {
    let unread = 0;
    // 添加
    if (data.action === "push") {
      data.unread = unread + 1;
      state.msgList.push(data);
      return
    }
    // 删除
    if (data.action === "delete") {
      for (var i = 0; i < state.msgList.length; i++) {
        if (state.msgList[i].id === data.id) {
          state.msgList.splice(i, 1);
        };
      }
      return
    }
    // 替换更新
    if (data.type === "private") {
      // 在请求添加好友的情况下
      let haveThisEle = state.msgList.filter(ele => ele.other_user_id == data.from_user);
      if (haveThisEle.length === 0 && data.action === "request") {
        data.unread = unread + 1;
        data.other_user_id = data.from_user;
        data.id = data.from_user;
        delete data.from_user;
        delete data.to_user;
        state.msgList.push(data);
        return
      }
      // 正常私聊情况下
      state.msgList.forEach(ele => {
        // 判断是哪个人  对方发的
        if (ele.other_user_id == data.from_user) {
          ele.message = data.name + ' : ' + data.message;
          ele.time = data.time;
          ele.name = data.name;
          ele.reamrk = data.remark;
          ele.avatar = data.avatar;
          // 如果是当前的聊天，没必要加未读标识了
          if (data.chatOfNow) return
          // 增加未读消息数
          if (!ele.unread) {
            ele.unread = unread + 1;
          } else {
            ele.unread += 1;
          }
        } else if (ele.other_user_id == data.to_user) { // 自己发的
          ele.message = data.name + ' : ' + data.message;
          ele.time = data.time;
        }
      });
    } else if (data.type === "group") {
      state.msgList.forEach(ele => {
        // 判断是哪个群
        if (ele.group_id == data.groupId) {
          ele.message = data.name + ' : ' + data.message;
          ele.time = data.time;
          ele.group_name = data.group_name;
          ele.group_avatar = data.group_avatar;
          ele.id = data.groupId;
          // 增加未读消息数
          if (data.chatOfNow) {
            ele.unread = null;
          } else {
            if (!ele.unread) {
              ele.unread = unread + 1;
            } else {
              ele.unread += 1;
            }
          }
        } else {

        }
      });
    }
  },
  // 未读信息归零
  [resetUnredMutation](state, id) {
    state.msgList.forEach(ele => {
      if (ele.id == id) {
        ele.unread = null
      }
    })
  },
  // 用户资料
  [someOneInfoMutation](state, data) {
    state.someOneInfo = data;
  },
  // 群成员
  [groupMemberMutation](state, data) {
    state.groupMember = data;
  },
  // 群资料
  [groupInfoMutation](state, data) {
    state.groupInfo = data;
  }
}

export default {
  state,
  mutations
}
