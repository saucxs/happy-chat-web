<template>
<!-- 登录 -->
<div class="login">
	<Message-box :visible="this.messageBox.visible" :messageBoxEvent="this.messageBox.messageBoxEvent" @confirm="confirm" :hasCancel=false>
		<p slot="content">{{this.messageBox.message}}</p>
	</Message-box>
	<div class="wrapper fadeInDown">
		<div id="formContent">
      <div class="flex-style">
        <h2 class="active"> 登&nbsp;&nbsp;录 </h2>
        <h2 class="inactive" @click="goRegister()"> 注&nbsp;&nbsp;册 </h2>
      </div>
			<div class="fadeIn first">
        <svg id="icon" class="icon-logo" alt="happyChat乐聊" title="happyChat乐聊" aria-hidden="true">
          <use xlink:href="#iconliaotian-copy-copy-copy"></use>
        </svg>
        <div class="system-name">{{systemName}}</div>
			</div>
			<form>
        <div class="login-form-flex">
          <span class="normal-word">用户名：</span><input style="-webkit-user-select:text !important" maxlength="16" v-focus @keyup.enter="startLogin" type="text"  class="input-class fadeIn second" placeholder="用户名" v-model="name">
        </div>
        <div class="login-form-flex">
          <span class="normal-word">密&nbsp;&nbsp;&nbsp;码：</span><input style="-webkit-user-select:text !important" maxlength="24" @keyup.enter="startLogin" type="password" class="input-class fadeIn third" placeholder="密码" v-model="password">
        </div>
        <div class="action action-box-login">
          <span @click="startLogin" class="primary-span">登&nbsp;&nbsp;&nbsp;录</span>
        </div>
			</form>
      <!--github登陆-->
      <div class="oauth-line-box">
        第三方登陆
      </div>
      <div class="oauth-box">
        <svg @click="goGithubOAuth" id="icon" class="icon github-icon" alt="github登陆" title="github登陆" aria-hidden="true">
          <use xlink:href="#iconGitHub"></use>
        </svg>
      </div>
      <div class="feed-back flex-style">
        <a href="https://github.com/saucxs/happy-chat-web" target="_blank">项目地址</a>
        <span class="feedback-link" @click="goFeedback()">留言反馈</span>
      </div>
		</div>
	</div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getUrlKey } from '../utils/common'
export default {
	name: "login",
	props: {},
	components: {},
  watch: {},
  computed: {
    ...mapGetters([
      'systemName'
    ])
  },
	data() {
		return {
			name: "",
			password: "",
			messageBox: {
				visible: false,
				message: "", // 弹窗内容
				hasCancel: true, // 弹窗是否有取消键
				messageBoxEvent: "" //  弹窗事件名称
			}
		};
	},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.queryData()
    })
  },
	methods: {
    ...mapActions(["login", "github"]),
    startLogin() {
			if (this.name !== "" && this.password !== "") {
			  let params = {
          name: this.name,
          password: this.password
        }
        this.$loading.show();
			  this.login(params).then(res => {
			    if (res) {
            this.$loading.hide();
			      if (res.success) {
              // 保存soket.io
              socketWeb.emit('login', res.userInfo.user_id)
			        localStorage.setItem("HappyChatUserToken", res.token);
			        localStorage.setItem("HappyChatUserInfo", JSON.stringify(res.userInfo));
			        // 弹窗提示
              this.$store.commit('firstLoadMutation', true)
              this.messageBox.messageBoxEvent = 'login'
              this.messageBox.visible = true;
              this.messageBox.message = "您已登录成功"
            } else {
              this.$message({
                message: res.message,
                type: "warn"
              });
            }
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            message: '服务器出错啦',
            type: "error"
          });
        });
			} else {
				const message = this.name === "" ? "请输入用户名" : "请输入密码";
				this.$message({
					message: message,
					type: "warn"
				});
			}
		},
		confirm(value) {
			if (value === 'login') {
				this.messageBox.visible = false;
        let redirect = decodeURIComponent(this.$route.query.redirect || '/robot');
        this.$router.push({ path: redirect });
			}
		},
    goGithubOAuth() {
      window.location.href = 'https://github.com/login/oauth/authorize?client_id=ceeee7092960dc0704b7&redirect_uri=https://chat.chengxinsong.cn/login'
    },
    goRegister() {
      this.$router.push({ path: '/register' });
    },
    queryData() {
      let code = getUrlKey('code');
      if(code) {
        this.$loading.show();
        this.github({code: code}).then(res => {
          if(res.success) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.$loading.hide();
            this.$store.commit('firstLoadMutation', true);
            // 保存soket.io
            socketWeb.emit('login', res.userInfo.user_id)
            localStorage.setItem("HappyChatUserToken", res.token);
            localStorage.setItem("HappyChatUserInfo", JSON.stringify(res.userInfo));
            this.$router.push({ path:  '/robot' });
          }
        })
      }
    },
    goFeedback() {
      this.$router.push({ path: '/feedback' });
    }
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/loginregister.scss";
</style>
