import Api from "../api/api";
import * as types from "./mutation-types";

// chatRobot
export const chatRobot = ({commit},params) => {
  console.log(params, '---------------------')
  return Api.chatRobot(params).then(res => {
    if (res) {
      if (res.data.data.code === 100000) {
        commit(types.robotMsgMutation, {
          message: res.data.data.text,
          user: "robot"
        });
      } else if (res.data.data.code === 200000) {
        let data = res.data.data.text + res.data.data.url;
        commit(types.robotMsgMutation, {
          message: data,
          user: "robot"
        });
      } else if (res.data.data.code === 302000) {
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
}
