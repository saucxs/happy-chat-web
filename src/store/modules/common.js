import {
  newFriendMutation, friendReqTipsMutation, userInfoMutation, feedbackListMutation
} from "../mutation-types.js";

const state = {
  systemName: 'happyChat乐聊',
  userInfoData: JSON.parse(JSON.stringify(localStorage.getItem('HappyChatUserInfo'))),
  newFriend: [], // 新朋友列表
  tabTips: { // 底部tab的未读提示 暂时只做好友添加请求的提示
    addFriendReq: "" // 是否有好友添加请求 0没有 1有
  },
  isMobile: navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i),
  feedbackListData: []
};

const mutations = {
  // 登陆获取信息
  [userInfoMutation](state, data) {
    state.userInfoData = data;
  },
  // 新朋友列表
  [newFriendMutation](state, data) {
    state.newFriend = data;
  },
  // 是否有好友添加请求
  [friendReqTipsMutation](state, data) {
    if (data) {
      state.tabTips.addFriendReq = "tips";
    } else {
      state.tabTips.addFriendReq = "";
    }
  },
  // 留言反馈
  [feedbackListMutation] (state, data) {
    state.feedbackListData  = data
  }
}

export default {
  state,
  mutations
}
