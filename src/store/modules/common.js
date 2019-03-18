import {
  newFriendMutation
} from "../mutation-types.js";

const state = {
  systemName: 'XXX系统',
  newFriend: []

};

const mutations = {
  //新朋友列表
  [newFriendMutation](state, data) {
    state.newFriend = data;
  }
}

export default {
  state,
  mutations
}
