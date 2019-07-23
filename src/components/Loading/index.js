import './loading.css'

let Loading = {};
/* 避免重复的install，设置flag标志位 */
Loading.installed = false;
Loading.install = function (Vue) {
  if(Loading.installed) return;
  Vue.prototype.$loading = {};
  Vue.prototype.$loading.show = () => {
    if(document.querySelector('#modal')) return;
    /* 1、创建构造器，定义loading模板 */
    let LoadingTip = Vue.extend({
      template: `<div id="modal">
                    <div id="modal-mark"></div>
                    <div id="vue-loading">
                      <div class="loader"></div>
                    </div>
                  </div>`
    })
    /* 2、常创建实例，挂载到文档以后的地方 */
    let tpl = new LoadingTip().$mount().$el;
    /* 3、把创建实例添加到body中 */
    document.body.appendChild(tpl);
    /* 4、阻止遮罩层滑动 */
    document.querySelector('#modal').addEventListener('touchmove',function (e) {
      e.stopPropagation();
      e.preventDefault();
    })
    Loading.installed = true;
  }
  Vue.prototype.$loading.hide = () => {
    let tpl = document.querySelector('#modal');
    document.body.removeChild(tpl);
  }
}

export default Loading
