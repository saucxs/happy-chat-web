//  The Vue build version to load with the `import` command
//  (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import "@/assets/css/index.scss"
import VueClipboard from 'vue-clipboard2'
import Components from './components/index'
import Loading from './components/Loading/index'

/* 引入全局过滤器 */
import * as fliterCommon from '../src/utils/common'
Object.keys(fliterCommon).forEach(key => Vue.filter(key, fliterCommon[key]));

/* 引入全局指令focus */
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  }
})

/* scroll全局置底指令scroll */
import scrollDirective from '../src/utils/scroll';
Vue.directive('scroll', scrollDirective)

Vue.use(Components);

Vue.use(Loading)

Vue.use(VueClipboard)

Vue.config.productionTip = false;

/*全局PV统计*/
router.beforeEach((to, from, next) => {
  let flag = localStorage.getItem("HappyChatUserInfo") !== null ? true: false;
  let data = {
    type: 'visit',
    user_id: flag ? JSON.parse(localStorage.getItem("HappyChatUserInfo")).user_id: '获取不到userId',
    time: (new Date()).getTime(),
    params: {
      from: {
        name: from.name || '',
        path: from.path || '',
        query: from.query || ''
      },
      to: {
        name: to.name || '',
        path: to.path || '',
        query: to.query || ''
      }
    }
  }
  App.methods.logEvent(data);
  next()
})

// window.onbeforeunload = function (e) {
//   e = e || window.event;
//   // 兼容IE8和Firefox 4之前的版本
//   if (e) {
//     e.returnValue = '关闭提示';
//     alert("关闭提示");
//   }
//   // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
//   return '关闭提示';
// };
window.onunload = function unloadPage() {
  let data = {
    type: 'close',
    user_id: localStorage.getItem("HappyChatUserInfo") !== null ? JSON.parse(localStorage.getItem("HappyChatUserInfo")).user_id: '获取不到userId',
    time: (new Date()).getTime(),
    params: {
      from: {
        name: '关闭前',
        path: router.currentRoute.path || '',
        query: router.currentRoute.params || ''
      },
      to: {
        name: '关闭',
        path: '',
        query: ''
      }
    }
  }
  App.methods.logEvent(data);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
