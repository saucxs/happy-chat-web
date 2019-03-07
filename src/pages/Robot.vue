<template>
  <!--机器人-->
  <div class="wrapper">
    <p class="title">机器人</p>
    <ul>
      <li>
        <div class="chat-item">

        </div>
      </li>
    </ul>
    <div class="input-msg">
      <textarea v-model="inputMsg" @keydown.enter.prevent="sendMessage" ref="message"></textarea>
      <p class="btn" :class="{'enable':inputMsg!=''}" @click="sendMessage">发送</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Robot',
  data () {
    return {
      inputMsg: "",
      img: "",
      isScrollToBottom: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrapper {
  padding-top: 0.6rem;
  z-index: 1;
  .title{
    font-size: 0.32rem;
    text-align: center;
  }
  ul {
     display: flex;
     flex-direction: column;
     width: 100%;
     padding-bottom: 1.6rem;
   // touch-action:none !important;
    li {
      margin-top: -1rem;
      padding: 0;
    }
  }
  .input-msg {
    height: 0.46rem;
    position: fixed;
    bottom: 0.62rem;
    display: flex;
    width: 100%;
    z-index: 999;
    textarea {
      width: 87.8%;
      margin: 0 0.06rem;
      padding-top: 0.07rem;
      padding-left: 0.06rem;
      border-radius: 0.02rem;
      outline: none;
      resize: none;
      border: none;
      overflow-y: hidden;
      font: 0.16rem/0.18rem 'Microsoft Yahei';
    }
    p.btn {
      font-size: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-right: 0.06rem;
      height: 100%;
      width: 11%;
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
