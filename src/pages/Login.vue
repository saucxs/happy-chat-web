<template>
<!-- 登录 -->
<div class="login">
	<Message-box :visible="this.messageBox.visible" :messageBoxEvent="this.messageBox.messageBoxEvent" @confirm="confirm" :hasCancel=false>
		<p slot="content">{{this.messageBox.message}}</p>
	</Message-box>
	<div class="wrapper fadeInDown">
		<div id="formContent">
			<h2 class="active"> 登录 </h2>
			<router-link to="/register">
				<h2 class="inactive"> 注册 </h2>
			</router-link>
			<div class="fadeIn first">
        <svg id="icon" class="icon" alt="User Icon" aria-hidden="true">
          <use xlink:href="#iconliaotian"></use>
        </svg>
			</div>
			<form>
        <div>
          <span class="normal-word">用户名：</span><input style="-webkit-user-select:text !important" maxlength="16" v-focus @keyup.enter="startLogin" type="text"  class="input-class fadeIn second" placeholder="用户名" v-model="name">
        </div>
        <div>
          <span class="normal-word">密码：</span><input style="-webkit-user-select:text !important" maxlength="24" @keyup.enter="startLogin" type="password" class="input-class fadeIn third" placeholder="密码" v-model="password">
        </div>
        <div class="action action-box-spe">
          <span @click="startLogin" class="primary-span">登录</span>
        </div>
			</form>
		</div>
	</div>
</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	name: "login",
	props: {},
	components: {},
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
	computed: {},

	watch: {},

	methods: {
    ...mapActions(["login"]),
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
        this.$store.commit('firstLoadMutation', true)
        let redirect = decodeURIComponent(this.$route.query.redirect || '/robot');
        this.$router.push({ path: redirect });
        window.location.reload();
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/loginregister.scss";
</style>
