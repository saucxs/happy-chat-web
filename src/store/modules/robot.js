import {
  robotMsgMutation
} from "../mutation-types.js";

const state = {
  robotmsg: [
    //  机器人首语
    {
      message: "hi , 欢迎与我聊天，问我问题哦！",
      user: "robot"
    }
  ]
};

const mutations = {
  // 机器人消息
  [robotMsgMutation](state, data) {
    state.robotmsg.push(data);
  }
}

export default {
  state,
  mutations
}
