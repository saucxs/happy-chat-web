import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    robotmsg: [
      // 机器人首语
      {
        message: "hi , 欢迎与我聊天，问我问题哦！",
        user: "robot"
      }
    ]
  },
  getters: {
    robotMsgGetter: state => state.robotmsg,
},
mutations: {
  //机器人消息
  robotMsgMutation(state, data) {
    state.robotmsg.push(data);
  },
},
actions: {
  //机器人
  robatMsgAction({
    commit
  }, data) {
    // console.log(data + "  robatMsgAction");
    axios.get("/api/v1/robot", {
      params: data
    }).then(res => {
      if (res) {
        if (res.data.data.code === 100000) {
          commit("robotMsgMutation", {
            message: res.data.data.text,
            user: "robot"
          });
        } else if (res.data.data.code === 200000) {
          let data = res.data.data.text + res.data.data.url;
          commit("robotMsgMutation", {
            message: data,
            user: "robot"
          });
        } else if (res.data.data.code === 302000) {
          commit("robotMsgMutation", {
            message: "暂不支持此类对话",
            user: "robot"
          });
        } else {
          commit("robotMsgMutation", {
            message: "暂不支持此类对话",
            user: "robot"
          });
        }
      }
    })
  .catch(err => {
      console.log(err);
  });
  },


}
});
export default store;
