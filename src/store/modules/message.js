import {
  msgListMutation, firstLoadMutation, friendReqTipsMutation
} from "../mutation-types.js";

const state = {
  firstLoad: true, //是否是第一次加载首页消息页面
  msgList: [], // 消息首页列表
  tabTips: { //底部tab的未读提示 暂时只做好友添加请求的提示
    addFriendReq: "" //是否有好友添加请求 0没有 1有
  }
};

const mutations = {
  //是否是第一次加载首页消息页面
  [firstLoadMutation](state, data) {
    state.firstLoad = data;
  },
  //列表消息
  [msgListMutation](state, data) {
    state.msgList = data;
  },
  //是否有好友添加请求
  [friendReqTipsMutation](state, data) {
    if (data) {
      state.tabTips.addFriendReq = "tips";
    } else {
      state.tabTips.addFriendReq = "";
    }
  }

}

export default {
  state,
  mutations
}
