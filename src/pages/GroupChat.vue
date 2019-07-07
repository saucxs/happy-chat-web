<template>
<!--  群聊 -->
<div class="wrapper">
	<Header goback='true' groupInfo='true' :chatTitle="groupInfoGetter.group_name" @showGroupInfo="showGroupInfoChild"></Header>
  <div class="chat-wrapper" :class="{'chat-wrapper-emoji': showEmojiPicker}">
    <div class="secret-box-spe">
      <ul ref="viewBox">
        <li>
          <load-more :is-no-more="isNoMore" :is-show-loading="isShowLoading" @load-more="loadMore"></load-more>
        </li>
        <li v-for="item in message">
          <ChatItem v-if="userInfo.user_id === item.from_user" :href="item.from_user" :img="item.avator" me="true" :msg="item.message" :name="item.name" :time="item.time"></ChatItem>
          <ChatItem v-else :img="item.avator" :msg="item.message" :href="item.from_user" :name="item.name" :time="item.time"></ChatItem>
        </li>
      </ul>
      <!--<picker :i18n="{ search: 'Recherche', categories: { search: 'Résultats de recherche', recent: 'Récents' } }" />-->
      <!--<div class="emoji-page">-->
        <!--<textarea-emoji-picker v-model="text"/>-->
      <!--</div>-->
    </div>
  </div>
  <div @click="showGroupInfoDialog = false" class="chat-info-modal" v-if="showGroupInfoDialog"></div>
  <group-info v-if="showGroupInfoDialog" class="chat-info" :groupMembers="groupMembers" :groupInfoGetter="groupInfoGetter" :isMyGroup="isMyGroup"></group-info>

  <div class="input-msg" :class="{ 'input-msg-select':showEmojiPicker}" v-if="isMyGroup">
    <picker
      class="emoji-select"
      v-if="showEmojiPicker"
      title="Pick your emoji..."
      emoji="point_up"
      @select="addEmoji"
    />
    <svg class="svg-icon" :class="{ 'triggered': showEmojiPicker }" @mousedown.prevent="toggleEmojiPicker" viewBox="0 0 24 24" >
      <path fill="#888888" d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />
    </svg>
    <textarea ref="textarea"  v-model="inputMsg" @keydown.enter.prevent="sendMessage" placeholder="输入..."></textarea>
    <p class="btn" :class="{'enable':inputMsg!=''}" @click="sendMessage">{{btnInfo}}</p>
  </div>
  <span v-else @click="goChat" class="base-button button">加入群聊</span>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import ChatItem from '../components/ChatItem.vue'
import LoadMore from '../components/LoadMore.vue';
import GroupInfo from  './GroupInfo'

//import TextareaEmojiPicker from '../components/TextareaEmojiPicker'

import { Picker } from 'emoji-mart-vue';

import {	toNomalTime } from "../utils/common";
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		Header,
		ChatItem,
    LoadMore,
    GroupInfo,
//    TextareaEmojiPicker ,
    Picker
	},
	data() {
		return {
      showEmojiPicker: false,
      page: 1,
      pageNum: 20,
      isShowLoading: false,
      isNoMore: false,
			groupInfo: {
				groupId: '' //群id
			},
			groupAvator: '', //群头像
			groupMember: [], //群成员id
			message: [], //群消息
			inputMsg: '',
			userInfo: {},
			btnInfo: "发送",
      type: 'bottom',
      showGroupInfoDialog: false,
      groupMembers: [],  //群成员信息列表,
      isMyGroup: null,
      viewBox: '',
      beforeScrollHeight: '',
      afterScrollHeight: ''
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
      this.viewBox = this.$refs.viewBox;
      if(this.type == 'bottom'){
        this.refresh();
      }else{
        this.nofresh()
      }
		}
	},
	methods: {
    ...mapActions(["getGroupChat", "saveGroupChatMsg", "addGroupChatRelation", "judgeIsInGroup"]),
    /*展示表情框*/
    toggleEmojiPicker () {
      this.showEmojiPicker = !this.showEmojiPicker;
      this.refresh();
    },
    addEmoji (emoji) {
      const textarea = this.$refs.textarea;
      const cursorPosition = textarea.selectionEnd;
      const start = this.inputMsg.substring(0, textarea.selectionStart);
      const end = this.inputMsg.substring(textarea.selectionStart);
      this.inputMsg = start + emoji.native + end;
      textarea.focus();
      this.$nextTick(() => {
        textarea.selectionEnd = cursorPosition + emoji.native.length;
      })
    },
		//获取聊天记录
		getChatMsg() {
      let params = {
        page: this.page,
        pageNum: this.pageNum,
        groupId: this.groupInfo.groupId
      }
      this.$loading.show();
      this.getGroupChat(params).then((res) => {
        this.$loading.hide();
        if (res.success) {
          this.type = 'bottom'
          this.message = res.data.groupMsg;
          this.groupMembers = res.data.groupMemberInfo;
          this.$store.commit('groupInfoMutation', res.data.groupInfo[0])
          this.$store.commit('groupMemberMutation', res.data.groupMember)
          // 群成员不存在此用户id，则添加
          // if (!res.data.groupMember.includes(this.userInfo.user_id)) {
          //   this.addGroupUserRelation();
          //   const data = {
          //     action: "push",
          //     message: "您已成功加入此群！",
          //     group_avator: this.groupInfoGetter.group_avator,
          //     group_name: this.groupInfoGetter.group_name,
          //     time: this.groupInfoGetter.creater_time,
          //     group_id: this.groupInfoGetter.group_id,
          //     type: "group",
          //     id: this.groupInfoGetter.group_id
          //   }
          //   this.$store.commit('updateListMutation', data)
          // }
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
      this.type = 'bottom'
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
        this.viewBox.scrollTop = this.viewBox.scrollHeight
			}, 100)
		},
    // 消息保持不变
    nofresh() {
      setTimeout(() => {
        this.afterScrollHeight = this.viewBox.scrollHeight - this.beforeScrollHeight;
        this.viewBox.scrollTop = this.afterScrollHeight;
      }, 100)
    },
    loadMore() {
      console.log(this.isMyGroup, '-=-=-=-=-=-=')
      if(!this.isMyGroup){
        this.$message({
          message: '请先加入群聊',
          type: "warn"
        });
      }else{
        this.beforeScrollHeight = this.viewBox.scrollHeight;
        if (!this.isNoMore) {
          this.isShowLoading = true;
          this.page = this.page + 1;
          let params = {
            page: this.page,
            pageNum: this.pageNum,
            groupId: this.groupInfo.groupId
          }
          this.getGroupChat(params).then((res) => {
            if (res.success) {
              this.type = 'unBottom'
              if (res.data.groupMsg.length < this.pageNum) {
                this.isNoMore = true;
              }
              res.data.groupMsg.forEach(element => {
                element.time = element.time;
                element.message = element.message.split(':')[1];
              });
              if(res.data.groupMsg.length == 0) return ;
              this.message.unshift(...res.data.groupMsg);
              this.isShowLoading = false;
            }
          })
        }
      }
    },
    showGroupInfoChild(val) {
      console.log('子组件传递的值', val)
      this.showGroupInfoDialog = val;
    },
    //看该用户是否在某个群中(根据返回的数组长度是不是为零
    isInGroup() {
      let params = {
        group_id: this.$route.params.group_id
      }
      this.judgeIsInGroup(params).then((res) => {
        if(res.success){
          this.isMyGroup = res.data.group_user.length === 0 ? false : true;
        }else{
          this.$message({
            message: '服务器出错啦',
            type: "error"
          });
        }
      }).catch(err => {
        console.log('err', err)
        const errorMsg = err.error
        this.$message({
          message: errorMsg,
          type: "error"
        });
      })
    },
    goChat() {
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
      this.$store.commit('updateListMutation', data);
      this.isMyGroup = true;
    },
    handleScroll() {
      this.viewBox = this.$refs.viewBox;
    }
	},
	async created() {
		this.groupInfo.groupId = this.$route.params.group_id;
		this.userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
    await this.isInGroup();
		await this.getChatMsg();
		this.resetUnred();
		this.getMsgBySocket();
	},
  mounted: function () {
    // window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
  },
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/chat.scss";
  .svg-icon {
    cursor: pointer;
    height: 0.7rem;
    width: 0.7rem;
  }
  .emoji-select{
    width: 100% !important;
    position: fixed;
    height: 5rem !important;
    bottom: 0;
  }
  .emoji-mart-preview{
    height: 48px !important;
  }

</style>
