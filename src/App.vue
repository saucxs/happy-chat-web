<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import Api from "./api/api";
  const App = {
    name: 'App',
    created() {
      if(window.screen.width >= 768){
        this.screenRatio(100, 1.3);
      }else{
        this.screenRatio();
      }
    },
    mounted() {
      this.getReqBySocket();
    },
    methods: {
      //  获取新好友通知
      getReqBySocket () {
        socketWeb.on('getresponse', (data) => {
          console.log('获取新好友通知', data);
          //  存vuex
          this.$store.commit('newFriendMutation', data)
          this.$store.commit('friendReqTipsMutation', true);
        })
      },
      /* 获取屏幕dpr */
      dprRatio () {
        const ua = navigator.userAgent;
        const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
        const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
        const isHCHd = UCversion && parseInt(UCversion[i].split(',').join(''), 10) >= 80;
        const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
        var dpr = window.devicePixelRatio || 1;
        if (!isIos && !(matches && matches[1] > 534) && !isHCHd) {
          /*非ios，非安卓4.3以上，非UC内核，就不执行高清，dpr设为1*/
          dpr = 1;
        }
        return dpr;
      },
      /* 初始化屏幕比例 */
      screenRatio (baseFontSize, fontscale) {
        var ratio = this.dprRatio();
        console.log(ratio, 'dpr');
        var scale = document.createElement('meta');
        var scaleRatio = 1 / ratio;
        scale.name = 'viewport';
        scale.content = 'width=device-width,' + 'initial-scale=' + scaleRatio +
          ', maximum-scale=' + scaleRatio + ', minimum-scale=' + scaleRatio +
          ', user-scalable=no';
        var s = document.getElementsByTagName('title')[0];
        s.parentNode.insertBefore(scale, s);
        var _baseFontSize = baseFontSize || 100;
        var _fontscale = fontscale || 1;
        document.documentElement.style.fontSize = _baseFontSize / 2 * ratio * _fontscale + 'px';
      },
      /* 数据埋点 */
      logEvent(opts) {
        let data = {
          type: opts.type,
          user_id: opts.user_id,
          time: opts.time,
          params: opts.params || {}
        }
        return Api.pvLog(data).then(res => {
          // console.log(res)
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  }
  App.install = (Vue, options) => {
    Vue.prototype.$app = {
      logEvent: App.logEvent
    }
  }
  export default App
</script>


