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
/*引入全局过滤器*/
import * as fliterCommon from '../src/utils/common'
Object.keys(fliterCommon).forEach(key => Vue.filter(key, fliterCommon[key]))

Vue.use(Components);

Vue.use(Loading)

Vue.use(VueClipboard)

Vue.config.productionTip = false;

/*全局PV统计*/
router.beforeEach((to, from, next) => {
  App.methods.logEvent({
    type: 'visit',
    name: to.name,
    time: (new Date()).getTime(),
    params: {
      from: {
        name: from.name,
        path: from.path,
        query: from.query
      },
      to: {
        name: to.name,
        path: to.path,
        query: to.query
      }
    }
  })
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
