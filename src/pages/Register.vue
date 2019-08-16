<template>
<!--  注册 -->
<div class="login">
	<Message-box :visible="this.messageBox.visible" :messageBoxEvent="this.messageBox.messageBoxEvent" @confirm="confirm" :hasCancel=false>
		<p slot="content">{{this.messageBox.message}}</p>
	</Message-box>
	<div class="wrapper fadeInDown">
		<div id="formContent">
      <div class="flex-style">
        <h2 class="inactive" @click="goLogin()"> 登&nbsp;&nbsp;录 </h2>
        <h2 class="active">注&nbsp;&nbsp;册 </h2>
      </div>
			<div class="fadeIn first">
        <svg id="icon" class="icon-logo" alt="happyChat乐聊" title="happyChat乐聊" aria-hidden="true">
          <use xlink:href="#iconliaotian-copy-copy-copy"></use>
        </svg>
        <div class="system-name">{{systemName}}</div>
			</div>
			<form class="register-form">
				<div class="login-form-flex">
          <span class="normal-word">用户名：</span><input v-focus style="-webkit-user-select:text !important" maxlength="16" type="text" class="input-class fadeIn second" v-model="name" placeholder="用户名">
        </div>
        <div class="login-form-flex">
          <span class="normal-word">密&nbsp;&nbsp;&nbsp;码：</span><input style="-webkit-user-select:text !important" maxlength="24" type="password" class="input-class fadeIn third" v-model="password" placeholder="密码">
        </div>
				<div class="login-form-flex">
          <span class="normal-word">邮&nbsp;&nbsp;&nbsp;箱：</span><input style="-webkit-user-select:text !important" maxlength="36" type="email" class="input-class fadeIn third" v-model="email" placeholder="邮箱">
        </div>
        <div class="action action-box-spe" :class="{'disabled': disabledFlag}">
          <span  @click="startRegister" class="primary-span">注 册</span>
        </div>
				<!--<input type="button" :disabed="disabledFlag" @click="startRegister" class="fadeIn fourth" value="注册">-->
			</form>
		</div>
	</div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { checkEmail } from "../utils/common"
export default {
	data() {
		return {
			name: '',
			password: '',
      email: '',
			messageBox: {
				visible: false,
				message: "", // 弹窗内容
				hasCancel: true, // 弹窗是否有取消键
				messageBoxEvent: "" //  弹窗事件名称
			},
      disabledFlag: false
		}
	},
  computed: {
    ...mapGetters([
      'systemName'
    ])
  },
	methods: {
    ...mapActions(["register", "activateEmail"]),
	  actualRegister() {
	    let params = {
	      name: this.name,
        password: this.password,
        email: this.email
      }
      if (this.name !== "" && this.password !== "" && this.email !== "" && checkEmail(this.email)) {
        this.register(params).then(res => {
          if (res) {
            if (res.success) {
              // 弹窗
              this.messageBox.messageBoxEvent = 'register'
              this.messageBox.visible = true;
              this.messageBox.message = res.message || "您已注册成功";
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          }
          this.disabledFlag = false;
        }).catch(err => {
          console.log(err)
          this.$message({
            message: '服务器出错啦',
            type: "error"
          });
          this.disabledFlag = false;
        })
      } else {
        let message;
        if (this.name === "") { message = "请输入用户名" }
        if (this.password === "") { message = "请输入密码" }
        if (this.email === "") { message = "请输入邮箱" }
        if (!checkEmail(this.email)) { message = "请输入正确的邮箱" }
        this.$message({
          message: message,
          type: "warn"
        });
      }
    },
    startRegister() {
      this.disabledFlag = true;
      this.actualRegister()
		},
		confirm(value) {
			if (value === 'register') {
				this.messageBox.visible = false;
				this.$router.push("/login");
			}
		},
    goLogin() {
      this.$router.push({ path: '/login' });
    }
	}
}
</script>

<style lang="scss" scoped>
@import '../assets/css/loginregister.scss';
</style>
