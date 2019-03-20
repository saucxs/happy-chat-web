<template>
<!-- 我 -->
<div class="wrapper">
	<Message-box :messageBoxEvent="this.messageBox.messageBoxEvent" :visible="this.messageBox.visible" :hasCancel="this.messageBox.hasCancel" @cancel="cancel" @confirm="confirm">
		<p slot="content">{{this.messageBox.message}}</p>
	</Message-box>
	<Header :currentTab="currentTab"></Header>
	<div class="content">
    <div class="content-box">
      <img :src="userInfo.avator" alt="">
      <p class="name">{{userInfo.name}}</p>
      <p class="href">
        <span @click="goGithub"><svg class="icon" aria-hidden="true"><use  xlink:href="#iconGitHub"></use></svg></span>
        <span @click="goWebsite"><svg class="icon" aria-hidden="true"><use  xlink:href="#iconWorld-WideWeb"></use></svg></span>
      </p>
      <p class="user-intro">{{userInfo.intro == '' ? '没有留下介绍~': userInfo.intro}}</p>
      <p class="user-more"><svg @click="goInfo" class="icon" aria-hidden="true"> <use  xlink:href="#iconacmore"></use></svg></p>
    </div>
		<!--<li class="info" @click="goInfo">-->
			<!--<img :src="userInfo.avator" alt="">-->
			<!--<span>{{userInfo.name}}</span>-->
			<!--<svg class="icon" aria-hidden="true"> <use  xlink:href="#icon-right"></use></svg>-->
		<!--</li>-->
		<!-- <img :src="userInfo.avator" alt="">
                    <p>用户名：{{userInfo.name}}</p>
                    <p>性别：{{userInfo.sex}}</p>
                    <p>来自：{{userInfo.place}}</p> -->
	</div>
	<div class="action" @click="logout">
		<span class="logout">退出登录</span>
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
				message: "", //弹窗内容
				hasCancel: true, //弹窗是否有取消键
				messageBoxEvent: "" //弹窗事件名称
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
				//登出
        socketWeb.emit('logout', this.userInfo.user_id)
				sessionStorage.removeItem("HappyChatUserToken");
        sessionStorage.removeItem("HappyChatUserInfo");
				let self = this;
				setTimeout(function() {
					self.$router.push({
						path: "/login"
					});
				}, 1000);
			}
		},
    //点击跳转到对方的gihub
    goGithub() {
      if (this.userInfo.github) {
        window.location.href = this.userInfo.github;
      } else {
        this.$message({
          message: '对方尚未放他的github链接哦',
          type: "error"
        });
      }
    },
    //点击跳转到对方的网站
    goWebsite() {
      if (this.userInfo.website) {
        window.location.href = this.userInfo.website;
      } else {
        this.$message({
          message: '对方尚未放他的网站链接哦',
          type: "error"
        });
      }
    }
	},
	mounted() {
		this.userInfo = JSON.parse(sessionStorage.getItem("HappyChatUserInfo"));
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    padding-top: 1rem;
    .content{
      margin-top: 8vh;
      .content-box{
        text-align: center;
        line-height: 10vh;
        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
        .name{
          font-size: 5vh;
          line-height: 0.8rem;
          color: #4290F7;
        }
        .href {
          span {
            font-size: 4vh;
            margin: 0 1vh;
            cursor: pointer;
          }
        }
        .user-intro{
          font-size: 4vh;
        }
        .user-more{
          font-size: 4vh;
          cursor: pointer;
        }
      }
    }
    .action {
        text-align: center;
        span {
            display: inline-block;
            font-size: 0.26rem;
            line-height: 0.26rem;
            padding: 0.16rem 0;
            width: 40%;
            cursor: pointer;
        }
        .logout {
            background-color: #4290F7;
            color: #fff;
        }
    }
}
</style>
