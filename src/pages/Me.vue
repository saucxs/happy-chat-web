<template>
<!-- 我 -->
<div class="wrapper">
	<Message-box :messageBoxEvent="this.messageBox.messageBoxEvent" :visible="this.messageBox.visible" :hasCancel="this.messageBox.hasCancel" @cancel="cancel" @confirm="confirm">
		<p slot="content">{{this.messageBox.message}}</p>
	</Message-box>
	<Header :currentTab="currentTab"></Header>
  <div class="chat-wrapper-spe">
    <div class="secret-box-spe">
      <div class="content">
        <div class="content-box">
          <img :src="userInfo.avatar" alt="">
          <p class="name">{{userInfo.name}}</p>
          <p class="href">
            <span @click="goGithub"><svg class="icon" aria-hidden="true"><use  xlink:href="#iconGitHub"></use></svg></span>
            <span @click="goWebsite"><svg class="icon" aria-hidden="true"><use  xlink:href="#iconWorld-WideWeb"></use></svg></span>
          </p>
          <p class="user-intro">{{userInfo.intro == null ? '没有留下介绍~': userInfo.intro}}</p>
          <p class="user-more"><span @click="goInfo"><svg class="icon" aria-hidden="true"><use  xlink:href="#iconacmore"></use></svg>更多信息</span></p>
        </div>
      </div>
      <div class="action">
        <span @click="logout" class="warning-span">退出登录</span>
      </div>
    </div>
  </div>
	<Footer :currentTab="currentTab"></Footer>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
	name: 'message',
	data() {
		return {
			currentTab: 4,
			messageBox: {
				visible: false,
				message: "", // 弹窗内容
				hasCancel: true, // 弹窗是否有取消键
				messageBoxEvent: "" // 弹窗事件名称
			},
			userInfo: {}
		}
	},
	components: {
		Header,
		Footer
	},
	methods: {
		goInfo() {
			const path = `/user_info/${this.userInfo.user_id}`;
			this.$router.push(path)
		},
		logout() {
			this.messageBox.messageBoxEvent = 'logOut'
			this.messageBox.visible = true;
			this.messageBox.message = "确定退出？"
		},
		cancel(value) {
			this.messageBox.visible = false;
		},
		confirm(value) {
			if (value === 'logOut') {
        this.$store.commit('firstLoadMutation', true)
				// 登出
        this.$store.commit('firstLoadMutation', true)
        socketWeb.emit('logout', this.userInfo.user_id)
				localStorage.removeItem("HappyChatUserToken");
        localStorage.removeItem("HappyChatUserInfo");
				let self = this;
				setTimeout(function() {
					self.$router.push({
						path: "/login"
					});
				}, 1000);
			}
		},
    // 点击跳转到对方的gihub
    goGithub() {
      if (this.userInfo.github) {
        window.location.href = this.userInfo.github;
      } else {
        this.$message({
          message: '对方尚未放他的github链接哦',
          type: "warn"
        });
      }
    },
    // 点击跳转到对方的网站
    goWebsite() {
      if (this.userInfo.website) {
        window.location.href = this.userInfo.website;
      } else {
        this.$message({
          message: '对方尚未放他的网站链接哦',
          type: "warn"
        });
      }
    }
	},
	mounted() {
		this.userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
    .content{
      margin-top: 0.4rem;
      .content-box{
        text-align: center;
        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
        .name{
          font-size: 0.5rem;
          color: #4290F7;
        }
        .href {
          span {
            font-size: 0.6rem;
            margin: 0 0.3rem;
            cursor: pointer;
          }
        }
        .user-intro{
          font-size: 0.3rem;
          line-height: 0.6rem;
          margin: 0 0.4rem 0.4rem;
        }
        .user-more{
          font-size: 0.3rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0.3rem;
          text-decoration: underline;
        }
      }
    }
}
</style>
