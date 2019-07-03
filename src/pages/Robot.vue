<template>
  <!--机器人-->
  <div class="wrapper">
    <Header :currentTab="currentTab"></Header>
    <div class="chat-wrapper">
      <div class="secret-box">
        <ul>
          <li v-for="msg in robotMsgGetter">
            <ChatItem v-if="msg.user" :msg="msg.message" :name="msg.user" :time="time"></ChatItem>
            <ChatItem v-if="!msg.user" me="true" :name="name" :href="href" :img=img :msg="msg.message" :time="time"></ChatItem>
          </li>
        </ul>
      </div>
    </div>

    <div class="input-msg">
      <textarea v-model="inputMsg" @keydown.enter.prevent="sendMessage" ref="message"></textarea>
      <p class="btn" :class="{'enable':inputMsg!=''}" @click="sendMessage">发送</p>
    </div>
    <Footer :currentTab="currentTab"></Footer>
  </div>
</template>

<script>
  import Header from '../components/Header.vue'
  import Footer from '../components/Footer.vue'
  import ChatItem from '../components/ChatItem.vue'
  import axios from "axios";
  import { mapGetters, mapActions } from 'vuex';
  import  {toNomalTime} from "../utils/common"
export default {
  name: 'Robot',
  data () {
    return {
      currentTab: 2,
      inputMsg: "",
      time: toNomalTime((new Date()).getTime() ),
      img: "",
      isScrollToBottom: true,
      name: '',
      href: ''
    }
  },
  components: {
    Header,
    Footer,
    ChatItem
  },
  methods: {
    ...mapActions(["chatRobot"]),
    async sendMessage() {
      if (this.inputMsg.trim() == '') return;
      this.$store.commit('robotMsgMutation', { //提交自己的内容
        message: this.inputMsg
      })
      let data = {
       message: this.inputMsg
      }
      await this.chatRobot(data);
      this.inputMsg = '';
    },
    refresh() {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight + 10000)
      }, 0)
    }
  },
  watch: {
    robotMsgGetter() { //当数据改变了,则自动刷新
      this.refresh();
    }
  },
  computed: {
  ...mapGetters([
      'robotMsgGetter'
    ])
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
    this.img = userInfo.avator;
    this.name = userInfo.name;
    this.href = userInfo.user_id
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
     padding-bottom: 1.6rem;
    li{
      list-style-type: none;
    }
  }
  .input-msg {
    height: 0.66rem;
    position: fixed;
    bottom: 0.95rem;
    display: flex;
    width: 100%;
    z-index: 999;
    textarea {
      width: 80%;
      padding: 0.05rem 0.1rem;
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
      margin-right: 0.06rem;
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
