<template>
<!--留言反馈 -->
<div class="wrapper">
	<Header goback='true' chatTitle="留言反馈"></Header>
  <div class="chat-wrapper-spe" :class="{'chat-wrapper-feedback':!userInfo}">
    <div class="secret-box-spe" :class="{'secret-box-feedback': !userInfo}">
      <div class="box-style">
        <div class="flex-style box-item" v-if="!userInfo">
          <span class="title">邮&nbsp;&nbsp;箱：</span>
          <input type="text" v-model="feedback.email" placeholder="请输入邮箱" maxlength="30"/>
        </div>
        <div class="flex-style">
          <span class="title">内&nbsp;&nbsp;容：</span>
          <textarea rows="3" type="text" v-model="feedback.content" placeholder="不超过50个字哦" maxlength="50"/></textarea>
        </div>
        <div class="action action-box-feedback">
          <span @click="submit" class="primary-span">提&nbsp;&nbsp;&nbsp;交</span>
        </div>
      </div>
      <hr>
      <h2>历史反馈</h2>
      <div v-scroll = "onScroll" class="feedback-box-history" v-if="feedbackListData.length > 0">
        <div class="feedback-item" v-for="item in feedbackListData">
          <div class="flex-style flex-style-feedback-history">
            <p class="item-box">
              <svg id="icon" class="icon" alt="happyChat乐聊" title="happyChat乐聊" aria-hidden="true">
                <use xlink:href="#iconEmail"></use>
              </svg>
              <span>{{item.email}}</span>
            </p>
            <p class="item-box">
              <svg id="icon" class="icon" alt="happyChat乐聊" title="happyChat乐聊" aria-hidden="true">
                <use xlink:href="#iconIP"></use>
              </svg>
              <span>{{item.ip}}</span>
            </p>
          </div>
          <p class="item-content">{{item.content}}</p>
          <p class="item-reply" v-if="item.reply"><span style="color: #E6A23C">回复：</span>{{item.reply}}</p>
          <p class="item-date">
            <svg id="icon" class="icon" alt="happyChat乐聊" title="happyChat乐聊" aria-hidden="true">
              <use xlink:href="#icontime"></use>
            </svg>
            <span>{{item.date}}</span>
          </p>
        </div>
      </div>
      <Nothing v-else></Nothing>
    </div>
  </div>
  <Footer v-if="userInfo" :currentTab="currentTab"></Footer>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { mapGetters, mapActions } from 'vuex';
import Nothing from '../components/Nothing.vue'
import { checkEmail } from "../utils/common"
export default {
	name: 'feedback',
	data() {
		return {
			currentTab: 5,
      feedback: {
			  email: '',
        content: ''
      },
      params: {
        page: 1,
        pageNum: 50,
      },
      userInfo: JSON.parse(localStorage.getItem("HappyChatUserInfo"))
		}
	},
	components: {
		Header,
    Footer,
    Nothing
	},
  computed: {
    ...mapGetters([
      'feedbackListData'
    ])
  },
	methods: {
    ...mapActions(["getFeedback", "submitFeedback"]),
    onScroll() {
      console.log('留言反馈：置底操作加载新数据的指令输出')
      // if(this.feedbackListData.length >= this.params.pageNum){
      //   this.params.page = this.params.page + 1;
      //   this.getFeedback(this.params)
      // }
    },
    submit() {
      let flag;
      if(this.userInfo){
        this.feedback.email = this.userInfo.email;
        this.feedback.user_id = this.userInfo.user_id;
        flag = true
      }else{
        flag = checkEmail(this.feedback.email)
      }
      if( flag && this.feedback.content.trim()) {
        this.$loading.show();
        this.submitFeedback(this.feedback).then(res =>{
          this.$loading.hide();
          if (res.success) {
            this.feedback = {};
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getFeedback(this.params);
          }
        })
      }else {
        let message;
        if (!checkEmail(this.feedback.email)){ message = "请输入正确的邮箱" }
        if (!this.feedback.content.trim()){ message = "请输入内容" }
        this.$message({
          message: message,
          type: "warn"
        });
      }
    }
	},
	mounted() {
    this.$loading.show();
    this.getFeedback(this.params).then(res => {
      this.$loading.hide();
    })
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
  .chat-wrapper-feedback{
    overflow-y: hidden;
    height: calc(100vh - 1rem) !important;
  }
  .secret-box-feedback{
    overflow-y: hidden;
  }
  input, textarea {
    font-size: 0.3rem;
    color: #999;
    border: 0.01rem solid #fff;
    padding: 0.15rem;
    width: 70%;
  }
  h2 {
    font-size: 0.36rem;
    font-weight: 600;
    text-transform: uppercase;
    display: inline-block;
    margin: 0.2rem 0.4rem;
    color: #1E90FF;
  }
  .action-box-feedback{
    margin: 0.2rem;
  }
  .feedback-box-history{
    padding: 0 0.4rem;
    overflow-y: auto;
    .feedback-item{
      padding: 0.1rem 0;
      border-bottom: 1px solid #ccc;
      margin-bottom: 0.14rem;
    }
    .flex-style-feedback-history{
      justify-content: space-between;
    }
    .item-box{
      font-size: 0.26rem;
      color: #999;
      display: flex;
      align-items: center;
      span{
        margin-left: 0.1rem;
      }
    }
    .item-content{
      font-size: 0.26rem;
      margin-top: 0.14rem;
      word-break:break-all;
      word-wrap:break-word;
    }
    .item-reply{
      font-size: 0.26rem;
      margin-top: 0.14rem;
      word-break:break-all;
      word-wrap:break-word;
      color: #999;
      margin-left: 0.2rem;
    }
    .item-date {
      font-size: 0.2rem;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .box-style{
    margin-top: 0.4rem;
    .box-item{
      margin-bottom: 0.3rem;
    }
    .title{
      font-size: 0.3rem;
    }
  }
}
</style>
