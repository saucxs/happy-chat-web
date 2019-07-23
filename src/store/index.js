import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';

//  引入业务逻辑模块
import common from './modules/common'
import robot from './modules/robot'
import message from './modules/message'

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  getters,
  modules:{
    common,
    robot,
    message
  }
})
