<template>
<!-- 用户资料 -->
<div class="wrapper">
	<!--弹窗-->
	<Message-box :messageBoxEvent="this.messageBox.messageBoxEvent" :visible="this.messageBox.visible" :title="	this.messageBox.title" :canInput="this.messageBox.canInput" :hasCancel="this.messageBox.hasCancel" @cancel="cancel" @confirm="confirm">
		<p slot="content">{{this.messageBox.message}}</p>
	</Message-box>
	<!--编辑用户资料-->
	<Message-box v-if="this.isMe" :clear="clear" :messageBoxEvent="this.messageBox.messageBoxEvent" :visible="this.messageBox.visible" :title="this.messageBox.title" :canEditorInfo="this.messageBox.canEditorInfo" :myInfoSpe="JSON.parse(JSON.stringify(userInfo))" :hasCancel="this.messageBox.hasCancel"
	    @cancel="cancel" @confirm="confirm">
		<p slot="content">{{this.messageBox.message}}</p>
	</Message-box>
	<Header goback='true' chatTitle="用户资料"></Header>
  <div class="chat-wrapper-no-footer">
    <div class="secret-box-spe">
      <div class="content">
        <div class="content-box">
          <svg id="icon" class="icon" alt="User Icon" aria-hidden="true">
            <use xlink:href="#iconniu"></use>
          </svg>
        </div>
        <p class="href">
          <span @click="goGithub"><svg class="icon" aria-hidden="true"><use  xlink:href="#iconGitHub"></use></svg></span>
          <span @click="goWebsite"><svg class="icon" aria-hidden="true"><use  xlink:href="#iconWorld-WideWeb"></use></svg></span>
        </p>
        <p v-if="this.isMyFriend">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconbeizhu"></use>
          </svg>
          <span>备注</span>：{{this.remark}}
        </p>
        <p>
          <span>用户名</span>：{{userInfo.name}}
        </p>
        <p>
          <span>性别</span>：{{userInfo.sex == 1 ? '男' : '女' }} <svg class="icon" aria-hidden="true">
          <use v-if="userInfo.sex == 1"  xlink:href="#iconxingbienan"></use>
          <use v-else xlink:href="#iconxingbienv"></use>
        </svg>
        </p>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconplaceholder"></use>
          </svg>
          <span>来自</span>：{{userInfo.place}}
        </p>
      </div>
      <div v-if="this.isAddingMe" class="action">
        <span class="add-as-friend" @click="agreeBeFriend">通过验证</span>
      </div>
      <div v-if="this.isMyFriend === true && this.isHisFriend === true " class="action-box">
        <div class="action">
          <span class="primary-span editor-remark" @click="editorRemark">修改备注</span>
          <span class="primary-span go-chat" @click="goChat">发消息</span>
        </div>
        <div class="action">
          <span class="warning-span shield-it" @click="shieldIt">屏蔽此人</span>
          <span class="warning-span de-friended" @click="deFriended">删除好友</span>
        </div>
      </div>
      <div v-if="this.isMyFriend === true && this.isHisFriend === false " class="action">
        <span class="warning-span de-friended" @click="deFriended">删除好友</span>
        <span class="primary-span add-as-friend" @click="enterReqPage">让对方重新加自己为好友</span>
      </div>
      <div v-if="this.isMyFriend === false && this.isHisFriend === true && this.isAddingMe === false " class="action">
        <span class="primary-span add-as-friend" @click="enterReqPage">加为好友</span>
      </div>
      <div v-if="this.isMyFriend === false && this.isHisFriend === false && this.isAddingMe === false && this.isMe === false" class="action">
        <span class="primary-span add-as-friend" @click="enterReqPage">加为好友</span>
      </div>
      <div v-if="this.isMe" class="action">
        <span class="primary-span editor-info" @click="editorInfo('basic')">编辑我的信息</span>
        <span v-if="!userInfo.github_id" class="primary-span editor-info" @click="editorInfo('password')">修改密码</span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {
    Header
  },
	data() {
		return {
			userInfo: {}, // 用户信息
			myInfo: {}, // 我的信息
			remark: '', // 备注
			isMyFriend: false, // 他是否是我的好友
			isHisFriend: false, // 我是否是他的好友
			isAddingMe: false,
			isMe: false,
			messageBox: {
				visible: false, // 弹窗是否显示
				title: "提示", // 弹窗名称
				message: "", // 弹窗内容
				canInput: false, // 弹窗是否能输入
				hasCancel: true, // 弹窗是否有取消键
				messageBoxEvent: "", // 弹窗事件名称
				canEditorInfo: false // 编辑用户资料的弹窗
			},
      clear: false
		}
	},
	computed: {
		...mapGetters([
			'newFriendGetter'
		])
	},
	methods: {
    ...mapActions(["queryUserInfo", "isFriendJudge","confirmEditorRemark",
      "confirmEditorInfo", "confirmDeleteFriend", "updateNewFriendsState",
      "beFriends", "confirmUpdatePassword"]),
		// 获取用户资料
		getInfo() {
			// 如果是自己，那就用本地的个人信息即可，省一次请求
			if (this.isMe) {
				this.userInfo = this.myInfo;
				return
			};
			let data = { user_id: this.$route.params.user_id };
			this.queryUserInfo(data).then(res => {
        this.userInfo = res.data.userInfo[0];
      }).catch(err => {
        console.log('err1', err)
      })
		},
		//  查询此用户是否是我的好友
		isFriend() {
      let data = { other_user_id: this.$route.params.user_id };
      this.isFriendJudge(data).then(res => {
        if (res.data.isMyFriend.length != 0) {
          this.isMyFriend = true;
          this.remark = res.data.isMyFriend[0].remark;
        }
        if (res.data.isHisFriend.length != 0) {
          this.isHisFriend = true;
        }
      }).catch(err => {
        console.log('err1', err)
      })
		},
		// 判断这个人是否请求加我未通过
		isAddingMeFun() {
			this.newFriendGetter.forEach((ele) => {
				if (ele.from_user == this.$route.params.user_id && ele.status !== 1) {
					this.isAddingMe = true;
					return
				}
			})
		},
		// 点击跳转到对方的gihub
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
		// 点击跳转到对方的网站
		goWebsite() {
			if (this.userInfo.website) {
				window.location.href = this.userInfo.website;
			} else {
				this.$message({
					message: '对方尚未放他的网站链接哦',
					type: "error"
				});
			}
		},
		// 进入验证页面
		enterReqPage() {
			const path = `/user_info/verify/${this.$route.params.user_id}`
			this.$router.push(path)
		},
		// 进入聊天页面
		goChat() {
			const path = `/private_chat/${this.$route.params.user_id}`
			this.$router.push(path)
		},
		// 重新加载本页面
		stay() {
			const path = `/user_info/${this.$route.params.user_id}`
			this.$router.push(path)
		},
		// 修改备注
		editorRemark() {
			this.messageBox.messageBoxEvent = 'editorRemark'
			this.messageBox.visible = true;
			this.messageBox.canInput = true;
			this.messageBox.title = '修改备注';
		},
		// 修改我的信息
		editorInfo(type) {
      if(type === 'basic'){
        this.messageBox.messageBoxEvent = 'editorInfo'
        this.messageBox.visible = true;
        this.messageBox.canEditorInfo = true;
        this.messageBox.title = '修改我的信息';
      } else if(type === 'password') {
        this.clear = false;
        this.messageBox.messageBoxEvent = 'editorPassword'
        this.messageBox.visible = true;
        this.messageBox.canEditorInfo = true;
        this.messageBox.title = '修改密码';
      }
		},
		// 屏蔽此人
		shieldIt() {


    },
		// 删除好友
		deFriended() {
			this.messageBox.messageBoxEvent = 'delFriend'
			this.messageBox.visible = true;
			this.messageBox.message = "确定要删除此好友？"
		},
		// 同意加好友
		async agreeBeFriend() {
      this.beFriends({ other_user_id: this.$route.params.user_id });
			await this.updateNewFriends();
			this.messageBox.messageBoxEvent = 'agreeBeFriend'
			this.messageBox.visible = true;
			this.messageBox.message = "添加好友成功，进入聊天？"
			//  })
		},
		// 更新验证状态
		async updateNewFriends() {
      this.updateNewFriendsState({
        from_user: this.$route.params.user_id
      })
		},
		// 弹窗取消事件
		cancel(value) {
			this.messageBox.visible = false;
			this.messageBox.canInput = false;
			this.messageBox.message = null;
			if (value === 'agreeBeFriend') {
				location.reload();
			}
		},
		// 弹窗确定事件
		confirm(value) {
			// 删除好友
			if (value === 'delFriend') {
			  let params = {
          user_id: this.myInfo.user_id,
          other_user_id: this.$route.params.user_id
        }
        this.confirmDeleteFriend(params).then(res => {
          if(res){
            this.messageBox.visible = false;
            this.messageBox.message = null;
            const data = {
              action: "delete",
              id: this.$route.params.user_id
            }
            this.$store.commit('updateListMutation', data)
            this.$message({
              message: '删除此好友成功',
              type: "success"
            });
            this.isMyFriend = false;
          }
        }).catch(err => {
          console.log('err', err)
        })
			}
			// 同意加为好友
			if (value === 'agreeBeFriend') {
				this.goChat();
			}
			// 修改备注
			if (value.messageBoxEvent === 'editorRemark') {
			  let params = {
          remark: value.canInputText,
          other_user_id: this.$route.params.user_id
        }
			  this.confirmEditorRemark(params).then( res => {
			    if(res){
            this.remark = value.canInputText;
            this.messageBox.canInput = false;
            this.messageBox.visible = false;
          }
        })
			}
			// 编辑个人信息
			if (value.messageBoxEvent === 'editorInfo') {
				// 验证url
				var urlP = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
				var re = new RegExp(urlP);
				if (value.myInfo.website) {
					if (!re.test(value.myInfo.website)) {
						this.$message({
							message: '请输入正确的网址',
							type: "error"
						});
						return
					} else {
						value.myInfo.website = value.myInfo.website.substr(0, 4) != 'http' ? ('http:// ' + value.myInfo.website) : value.myInfo.website;
					}
				}
				if (value.myInfo.github) {
					if (!re.test(value.myInfo.github)) {
						this.$message({
							message: '请输入正确的网址',
							type: "error"
						});
						return
					} else {
						value.myInfo.github = value.myInfo.github.substr(0, 4) != 'http' ? ('http:// ' + value.myInfo.github) : value.myInfo.github;
					}
				}
        let params = {
          github: value.myInfo.github,
          website: value.myInfo.website,
          sex: value.myInfo.sex,
          place: value.myInfo.place
        }
        this.confirmEditorInfo(params).then(res => {
          if (res.success) {
            localStorage.setItem("HappyChatUserInfo", JSON.stringify(value.myInfo));
            this.userInfo = value.myInfo;
            this.messageBox.visible = false;
          } else {
            this.$message({
              message: res.message || '服务器异常',
              type: "warn"
            });
          }
        })
			}
		  //	修改秘密
      if(value.messageBoxEvent === 'editorPassword'){
        if(!value.password.old && !value.password.old.trim()){
          this.$message({
            message: '请输入原密码',
            type: "warn"
          });
          return
        } else if (!value.password.new && !value.password.new.trim()) {
          this.$message({
            message: '请输入新密码',
            type: "warn"
          });
          return
        } else if (value.password.new.trim() !== value.password.confirmNew.trim()) {
          this.$message({
            message: '新密码两次输入不一致',
            type: "warn"
          });
          return
        }
        this.confirmUpdatePassword(value.password).then(res => {
          if (res.success) {
            this.clear = true;
            this.$message({
              message: '修改密码成功',
              type: "success"
            });
            this.messageBox.visible = false;
          } else {
            this.$message({
              message: res.message || '服务器异常',
              type: "warn"
            });
          }
        })
      }
		}
	},
	async created() {
		this.myInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
		this.isMe = String(this.myInfo.user_id) === this.$route.params.user_id ? true : false;
// 		await this.$store.dispatch('newFriendAction', this.myInfo.user_id)
		await this.isAddingMeFun();
		await this.isFriend();
		this.getInfo();
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
    .content {
      text-align: center;
      .content-box{
        text-align: center;
        padding: 0.4rem 0;
      }
      img {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        margin: 4vh 0;
      }
      p {
        font-size: 0.34rem;
        color: #4290F7;
        margin-bottom: 2vh;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          font-size: 0.45rem;
        }
      }
      .href {
        .icon {
          font-size: 0.5rem;
        }
        span {
          margin: 0 1vh;
          cursor: pointer;
        }
      }
    }
}
</style>
