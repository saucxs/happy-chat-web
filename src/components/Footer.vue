<template>
  <!--  主页面底部 -->
  <div class="footer">
    <router-link class="item" to="message">
      <svg class="icon" aria-hidden="true">
            <use class="active" v-show="currentTab === 1" xlink:href="#iconmessage-copy"></use>
            <use v-show="currentTab !== 1" xlink:href="#iconmessage"></use>
        </svg>
    </router-link>
    <router-link class="item" to="robot">
      <svg class="icon" aria-hidden="true">
            <use v-show="currentTab === 2" xlink:href="#iconrobot-copy"></use>
            <use v-show="currentTab !== 2" xlink:href="#iconrobot"></use>
        </svg>
    </router-link>
    <router-link class="item" :class="this.tabTipsGetter.addFriendReq" to="contact_list">
    <!-- <router-link v-else class="item " to="contact_list"> -->
      <svg class="icon" aria-hidden="true">
            <use v-show="currentTab === 3" xlink:href="#icongroup-copy"></use>
            <use v-show="currentTab !== 3" xlink:href="#icongroup"></use>
        </svg>
    </router-link>
    <router-link class="item" to="me">
      <svg class="icon" aria-hidden="true">
            <use v-show="currentTab === 4" xlink:href="#iconmine-copy"></use>
            <use v-show="currentTab !== 4" xlink:href="#iconmine"></use>
        </svg>
    </router-link>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from 'vuex';
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
    border-top: 0.05rem solid #eee;
    height: 0.75rem;
    .item {
      margin: 0 auto;
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
      transform: scale(1.1) rotate(1turn);
    }
  }
</style>
