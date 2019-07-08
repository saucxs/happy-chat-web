import {
  newFriendMutation, friendReqTipsMutation
} from "../mutation-types.js";

const state = {
  systemName: 'XXX系统',
  newFriend: [], //新朋友列表
  tabTips: { //底部tab的未读提示 暂时只做好友添加请求的提示
    addFriendReq: "" //是否有好友添加请求 0没有 1有
  },
  isMobile: navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
};

const mutations = {
  //新朋友列表
  [newFriendMutation](state, data) {
    state.newFriend = data;
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
