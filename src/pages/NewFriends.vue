<template>
<div class="wrapper">
	<Header goback='true' chatTitle="新好友通知"></Header>
  <div class="chat-wrapper-no-footer">
    <div class="secret-box">
      <ul>
        <Nothing v-if="newFriendGetter.length === 0" :name="'加好友'" :type="'addAuthor'"></Nothing>
        <li else v-for="data in newFriendGetter">
          <div class="list-box" @click="enterIt(data.from_user)">
            <img :src="data.avatar" alt="">
            <div class="content">
              <p>{{data.name}}</p>
              <p>{{data.content}}</p>
            </div>
          </div>

          <div class="result">
            <span v-if="data.status === 0" class="agree-btn" @click="agreeBeFriend(data.from_user)">同意</span>
            <span v-if="data.status === 1">已通过验证</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import axios from "axios"
import { mapGetters, mapActions } from 'vuex';
import { toNomalTime } from "../utils/common"
import Nothing from '../components/Nothing.vue'
export default {
	components: {
		Header,
    Nothing
	},

	data() {
		return {
			userInfo: {},
			time: ""
		}
	},
	computed: {
		...mapGetters([
			'newFriendGetter'
		])
	},

	watch: {},

	methods: {
    ...mapActions(["getNewFriends","beFriends","updateNewFriendsState"]),
		enterIt(val) {
			this.$router.push(`/user_info/${val}`)
		},
		// 同意加好友
		async agreeBeFriend(val) {
			this.beFriends({
        other_user_id: val,
        time: toNomalTime((new Date()).getTime()) // 时间
      })
      this.updateNewFriends(val);
		},
		// 更新验证状态
		async updateNewFriends(val) {
      this.updateNewFriendsState({ from_user: val })
			let data = {};
			this.newFriendGetter.forEach((ele) => {
				if (ele.from_user == val) {
					ele.status = 1;
					data = {
						avatar: ele.avatar, // 加我的人的头像
						id: val, // 加我的人的id
						other_user_id: val,
						message: "我们已成为好友，开始聊天吧！",
						time: toNomalTime((new Date()).getTime()), // 时间
						name: ele.name, // 加我的人的名字
						type: "private",
						action: "push"
					}
				}
			})
			this.$store.commit('updateListMutation', data)
			const data2 = {
				from_user: this.userInfo.user_id, // 自己的id
				to_user: val,
				name: this.userInfo.name, // 自己的昵称
				avatar: this.userInfo.avatar, // 自己的头像
				message: data.message, // 消息内容
				type: 'private',
				action: "request",
				status: '1', // 是否在线 0为不在线 1为在线
				time: toNomalTime((new Date()).getTime()) // 时间
			};
      socketWeb.emit('sendPrivateMsg', data2); // 让对方的信息列表也可以显示添加成功的信息

		}
	},
	created() {
		this.userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
    this.$store.commit('friendReqTipsMutation', false);
    this.getNewFriends({user_id: this.userInfo.user_id});
	}
}
</script>

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
.secret-box {
  height: 100%;
  padding: 0px 0px 20px 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  overflow-y: auto;
}

.list-box{
      padding: 1.5vh 2vh;
      display: flex;
      justify-items: center;
      align-items: center;
    }
    ul {
        margin-top: 0.2rem;
        li {
            cursor: pointer;
            background-color: #fff;
            list-style-type: none;
            margin-bottom: 0.16rem;
            position: relative;
            img {
                width: 0.8rem;
                height: 0.8rem;
            }
            .content {
                display: inline-block;
                margin-left: 2vh;
                line-height: 3vh;
                p:nth-child(1) {
                    font-size: 0.24rem;
                }
                p:nth-child(2) {
                    font-size: 0.2rem;
                }
            }
            .result {
                z-index: 999;
                span {
                    font-size: 0.2rem;
                    position: absolute;
                    right: 0.3rem;
                    //  top: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .agree-btn {
                    color: #fff;
                    background-color: #1E90FF;
                    padding: 0.1rem 0.2rem;
                    border-radius: 0.03rem;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
