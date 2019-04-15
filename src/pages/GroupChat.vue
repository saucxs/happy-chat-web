<template>
<!--  群聊 -->
<div class="wrapper">
	<Header goback='true' groupInfo='true' :chatTitle="groupInfoGetter.group_name"></Header>
	<ul>
		<li v-for="item in message">
			<ChatItem v-if="userInfo.user_id === item.from_user" :href="item.from_user" :img="item.avator" me="true" :msg="item.message" :name="item.name" :time="item.time"></ChatItem>
			<ChatItem v-else :img="item.avator" :msg="item.message" :href="item.from_user" :name="item.name" :time="item.time"></ChatItem>
		</li>
	</ul>
	<div class="input-msg">
		<textarea v-model="inputMsg" @keydown.enter.prevent="sendMessage"></textarea>
		<p class="btn" :class="{'enable':inputMsg!=''}" @click="sendMessage">{{btnInfo}}</p>
	</div>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import ChatItem from '../components/ChatItem.vue'
import axios from "axios"
import {	toNomalTime } from "../utils/common";
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		Header,
		ChatItem
	},
	data() {
		return {
			groupInfo: {
				groupId: '' //群id
			},
			groupAvator: '', //群头像
			groupMember: [], //群成员id
			message: [], //群消息
			inputMsg: '',
			userInfo: {},
			btnInfo: "发送"
		};
	},

	computed: {
		...mapGetters([
			'groupInfoGetter', //群资料
			'groupMemberGetter' //群成员
		])
	},

	watch: {
		message() {
			this.refresh();
		}
	},
	methods: {
    ...mapActions(["getGroupChat", "saveGroupChatMsg", "addGroupChatRelation"]),
		//获取聊天记录
		getChatMsg() {
      let params = {
        groupId: this.groupInfo.groupId
      }
      this.$loading.show();
      this.getGroupChat(params).then((res) => {
        this.$loading.hide();
        if (res.success) {
          this.message = res.data.groupMsg;
          this.$store.commit('groupInfoMutation', res.data.groupInfo[0])
          this.$store.commit('groupMemberMutation', res.data.groupMember)
          // 群成员不存在此用户id，则添加
          if (!res.data.groupMember.includes(this.userInfo.user_id)) {
            this.addGroupUserRelation();
            const data = {
              action: "push",
              message: "您已成功加入此群！",
              group_avator: this.groupInfoGetter.group_avator,
              group_name: this.groupInfoGetter.group_name,
              time: this.groupInfoGetter.creater_time,
              group_id: this.groupInfoGetter.group_id,
              type: "group",
              id: this.groupInfoGetter.group_id
            }
            // this.$store.commit('updateListMutation', data)
            this.$store.commit('updateListMutation', data)
          }
          if (this.message.length == 0) return;
          this.message.forEach(element => {
            element.time = element.time;
            element.message = element.message.split(':')[1];
          });
        }else{
          this.$message({
            message: '服务器出错啦',
            type: "error"
          });
        }
      }).catch(err => {
        const errorMsg = err.error
        this.$message({
          message: errorMsg,
          type: "error"
        });
      })

		},
		//发送信息
		async sendMessage() {
			if (this.inputMsg.trim() == '') return
			let data = {
				groupId: this.groupInfo.groupId, //群id
				group_name: this.groupInfoGetter.group_name, //群名称
				group_avator: this.groupInfoGetter.group_avator, //群头像
				groupMember: this.groupMemberGetter, //所有群成员的id
				from_user: this.userInfo.user_id, //自己的id
				name: this.userInfo.name, //自己的昵称
				avator: this.userInfo.avator, //自己的头像
				message: this.inputMsg, //消息内容
				time: toNomalTime(new Date().getTime()) //时间
			}
      socketWeb.emit('sendGroupMsg', data)
			this.saveMsgByDB();

		},
		//保存此条信息到数据库
		saveMsgByDB() {
      let params = {
        groupId: this.groupInfo.groupId,
        message: this.inputMsg,
        name: this.userInfo.name,
        time: toNomalTime((new Date()).getTime())
      }
      this.saveGroupChatMsg(params).then((res) => {
        if(res.success){
          this.inputMsg = '';
        }else{
          this.$message({
            message: '服务器出错啦',
            type: "error"
          });
        }
      })
		},

		// 把新成员加入群名单
		addGroupUserRelation() {
      let params = {
        groupId: this.groupInfo.groupId
      }
      this.addGroupChatRelation(params)
		},
		// 获取socket消息
		getMsgBySocket() {
      socketWeb.removeAllListeners('getGroupMsg');
      socketWeb.on('getGroupMsg', (data) => {
				//收到soket群信息 如果该群群成员不包含自己 放弃这条soket
				if (!this.groupMemberGetter.includes(this.userInfo.user_id)) return;
				//如果收到的soket信息不是来自当前聊天群 写入首页信息列表 并return
				data.type = 'group'
				if (data.groupId != this.groupInfo.groupId) {
					this.$store.commit('updateListMutation', data)
					return
				} else {
					//soket信息来自当前聊天群 vuex添加此条信息
					data.chatOfNow = true;
					this.$store.commit('updateListMutation', data)
					//本地添加此条信息
					this.message.push(data);
				}
			})
		},
		//将未读信息归零
		resetUnred() {
			this.$store.commit('resetUnredMutation', this.groupInfo.groupId)
		},
		// 消息置底
		refresh() {
			setTimeout(() => {
				window.scrollTo(0, document.body.scrollHeight + 10000)
			}, 0)
		}
	},
	async created() {
		this.groupInfo.groupId = this.$route.params.group_id;
		this.userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
		await this.getChatMsg();
		this.resetUnred();
		this.getMsgBySocket()
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/chat.scss";
</style>
