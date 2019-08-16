<template>
  <!--机器人-->
  <div class="wrapper">
    <Header :currentTab="currentTab"></Header>
    <div class="chat-wrapper">
      <div class="secret-box">
        <ul ref="viewBox">
          <li v-for="msg in robotMsgGetter">
            <ChatItem v-if="msg.user" :msg="msg.message" :name="msg.user" :time="time"></ChatItem>
            <ChatItem v-if="!msg.user" me="true" :name="userInfo.name" :href="userInfo.user_id" :img=userInfo.avatar :msg="msg.message" :time="time"></ChatItem>
          </li>
        </ul>
      </div>
    </div>

    <div class="input-msg">
      <textarea style="-webkit-user-select:text !important" v-focus v-model="inputMsg" @keydown.enter.prevent="sendMessage(inputMsg)" ref="message"></textarea>
      <p class="btn" :class="{'enable':inputMsg!=''}" @click="sendMessage(inputMsg)">发送</p>
    </div>
    <Footer :currentTab="currentTab"></Footer>
  </div>
</template>

<script>
  import Header from '../components/Header.vue'
  import Footer from '../components/Footer.vue'
  import ChatItem from '../components/ChatItem.vue'
  import { mapGetters, mapActions } from 'vuex';
  import  { toNomalTime } from "../utils/common"
  export default {
    name: 'Robot',
    data () {
      return {
        currentTab: 2,
        inputMsg: "",
        time: toNomalTime((new Date()).getTime()),
        isScrollToBottom: true,
        viewBox: '',
        userInfo: JSON.parse(localStorage.getItem("HappyChatUserInfo"))
      }
    },
    components: {
      Header,
      Footer,
      ChatItem
    },
    methods: {
      ...mapActions(["chatRobot"]),
      async sendMessage(val) {
        this.inputMsg = '';
        if (val.trim() == '') return;
        this.$store.commit('robotMsgMutation', { // 提交自己的内容
          message: val
        })
        let data = {
          message: val,
          userId: this.userInfo.user_id,
        }
        await this.chatRobot(data);
        this.refresh();
      },
      refresh() {
        this.viewBox = this.$refs.viewBox;
        setTimeout(() => {
          this.viewBox.scrollTop = this.viewBox.scrollHeight;
        }, 4)
      }
    },
    watch: {
      robotMsgGetter() { // 当数据改变了,则自动刷新
        this.refresh();
        let message = this.$refs.message;
        message.focus();
      }
    },
    computed: {
      ...mapGetters([
        'robotMsgGetter',
        'userInfoDataGetter'
      ])
    },
    created() {

    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  min-width: 100%;
  width: 100%;
  position: relative;
  .chat-wrapper{
    height: calc(100% - 2rem);
    width: 100%;
    position: relative;
  }
  .secret-box{
    height: 100%;
    padding: 0px 0px 20px 0;
    display: flex;
    flex-direction: column;
    list-style: none;
    overflow-y: auto;
  }
  .title{
    font-size: 0.32rem;
    text-align: center;
  }
  ul {
     display: flex;
     flex-direction: column;
     width: 100%;
     padding-bottom: 0.8rem;
    li{
      list-style-type: none;
    }
  }
  .input-msg {
    height: 0.76rem;
    position: fixed;
    bottom: 0.95rem;
    display: flex;
    width: 100%;
    z-index: 999;
    textarea {
      width: 80%;
      height: 100%;
      padding: 0.06rem 0.1rem;
      border-radius: 0.02rem;
      outline: none;
      resize: none;
      border: none;
      overflow-y: hidden;
      font: 0.24rem 'Microsoft Yahei';
    }
    p.btn {
      font-size: 0.22rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 100%;
      width: 20%;
      background: #ccc;
      color: white;
      border-radius: 0.02rem;
      cursor: not-allowed;
      font-family: 'Microsoft Yahei';

    &.enable {
       background: #1E90FF;
       cursor: pointer;
     }
    }
  }
}
</style>
