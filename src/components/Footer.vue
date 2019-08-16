<template>
  <!-- 主页面底部 -->
  <div class="footer">
    <router-link class="item" to="message">
      <svg class="icon" aria-hidden="true">
        <use class="active" v-show="currentTab === 1" xlink:href="#iconmessage-copy"></use>
        <use v-show="currentTab !== 1" xlink:href="#iconmessage"></use>
      </svg>
      <p>消息</p>
    </router-link>
    <router-link class="item" to="robot">
      <svg class="icon" aria-hidden="true">
        <use v-show="currentTab === 2" xlink:href="#iconrobot-copy"></use>
        <use v-show="currentTab !== 2" xlink:href="#iconrobot"></use>
      </svg>
      <p>机器人</p>
    </router-link>
    <router-link class="item" :class="this.tabTipsGetter.addFriendReq" to="contact_list">
      <svg class="icon" aria-hidden="true">
        <use v-show="currentTab === 3" xlink:href="#icongroup-copy"></use>
        <use v-show="currentTab !== 3" xlink:href="#icongroup"></use>
      </svg>
      <p>通讯录</p>
    </router-link>
    <router-link class="item" to="me">
      <svg class="icon" aria-hidden="true">
        <use v-show="currentTab === 4" xlink:href="#iconme-copy"></use>
        <use v-show="currentTab !== 4" xlink:href="#iconme"></use>
      </svg>
      <p>我的乐聊</p>
    </router-link>
    <router-link class="item" to="feedback">
      <svg class="icon" aria-hidden="true">
        <use v-show="currentTab === 5" xlink:href="#iconfeedback-copy"></use>
        <use v-show="currentTab !== 5" xlink:href="#iconfeedback"></use>
      </svg>
      <p>留言反馈</p>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Footer',
  props: ['currentTab'],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'tabTipsGetter'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 99;
    font-size: 0.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eee;
    border-top: 1px solid #e7e7e7;
    border-bottom: 1px solid #f8f8f8;
    padding: 0rem 0.1rem;
    .icon {
      width: 0.9em;
      height: 0.9em;
    }
    .item {
      text-align: center;
      display: block;
      color:#5d656b;
      text-decoration: none;
       flex: 1;
      padding: 0.1rem 0;
      p{
        font-size: 0.18rem;
        margin-top: -0.05rem;
      }
    }
    .tips::after {
      content: "";
      width: 0.18rem;
      height: 0.18rem;
      display: inline-block;
      position: relative;
      border-radius: 50%;
      background-color: red;
      position: absolute;
    }
    .router-link-active{
      transform: scale(1.16) rotate(1turn);
      p{
        color: #1E90FF;
      }
    }
  }
</style>
