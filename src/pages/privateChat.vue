<template>
<!--  私聊 -->
<div class="wrapper">
	<Header goback='true' userInfo='true' :chatTitle="remarkName ? remarkName: someOneInfoGetter.name"></Header>
  <div class="chat-wrapper" :class="{'chat-wrapper-emoji': showEmojiPicker}">
    <div class="secret-box-spe">
      <ul ref="viewBox">
        <load-more :is-no-more="isNoMore" :is-show-loading="isShowLoading" @load-more="loadMore"></load-more>
        <li v-for="item in privateDetail">
          <ChatItem v-if="fromUserInfo.user_id === item.from_user" :href="item.from_user" :img="item.avatar" me="true" :msg="item.message" :name="item.name" :time="item.time"></ChatItem>
          <ChatItem v-else :img="item.avatar" :msg="item.message" :href=" item.from_user " :name="remarkName ? remarkName: item.name" :time="item.time"></ChatItem>
        </li>
      </ul>
    </div>
  </div>
  <input-area @showEmojiPickerFunc="showEmojiPickerFunc" @sendMessageFunc="sendMessageFunc" :inputMsgData="inputMsg"></input-area>
  <!--<div class="input-msg" :class="{ 'input-msg-select':showEmojiPicker}">-->
    <!--<picker-->
      <!--class="emoji-select"-->
      <!--v-if="showEmojiPicker"-->
      <!--title="Pick your emoji..."-->
      <!--emoji="point_up"-->
      <!--@select="addEmoji"-->
    <!--/>-->
    <!--<svg class="svg-icon" :class="{ 'triggered': showEmojiPicker }" @mousedown.prevent="toggleEmojiPicker" viewBox="0 0 24 24" >-->
      <!--<path fill="#888888" d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />-->
    <!--</svg>-->
		<!--<textarea ref="textarea" @focus="getFocus()" v-model="inputMsg" @keydown.enter.prevent="sendMessage" placeholder="输入..."></textarea>-->
		<!--<p class="btn" :class="{'enable':inputMsg!=''}" @click="sendMessage">{{btnInfo}}</p>-->
	<!--</div>-->
</div>
</template>

<script>
import Header from '../components/Header.vue'
import ChatItem from '../components/ChatItem.vue'
import LoadMore from '../components/LoadMore.vue';
import InputArea from '../components/InputArea'
import {	toNomalTime} from "../utils/common";
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		Header,
		ChatItem,
    LoadMore,
    InputArea
	},

	data() {
		return {
      page: 1,
      pageNum: 20,
      isShowLoading: false,
      isNoMore: false,
			inputMsg: '',
			privateDetail: [], // 私聊相关
			toUserInfo: { // 被私聊者
				to_user: '',
				avatar: '',
				sex: '',
				place: '',
				status: ''
			},
			isMyFriend: false, // 他是否是我的好友
			isHisFriend: false, // 我是否是他的好友
			fromUserInfo: {}, // 用户自己
			btnInfo: "发送",
      remarkName: '',
      anotherRemarkName: '',
      type: 'bottom',
      viewBox: '',
      beforeScrollHeight: '',
      afterScrollHeight: '',
      showEmojiPicker: false,
		}
	},

	computed: {
		...mapGetters([
			'someOneInfoGetter'
		])
	},

	watch: {
		privateDetail() {
      this.viewBox = this.$refs.viewBox;
      if(this.type == 'bottom'){
        this.refresh();
      }else{
        this.nofresh()
      }
		}
	},

	methods: {
    ...mapActions(["getPrivateDetail","isFriendJudge","queryUserInfoSpecial","savePrivateMsg"]),
    /*子组件回传*/
    showEmojiPickerFunc(val){
      this.showEmojiPicker = val;
      this.refresh()
    },
    sendMessageFunc(val){
      this.inputMsg = val;
      this.sendMessage()
    },
		// 获取数据库的消息
		getPrivateMsg() {
      let params = {
        page: this.page,
        pageNum: this.pageNum,
        to_user: this.toUserInfo.to_user
      }
      this.$loading.show();
      this.getPrivateDetail(params).then(res => {
        this.$loading.hide();
        if (res.success) {
          this.type = 'bottom'
          this.privateDetail = res.data.privateDetail;
          if (this.privateDetail.length == 0 || res.data.privateDetail.length < this.pageNum) {
            this.isNoMore = true;
          }
          this.privateDetail.forEach(element => {
            element.time = element.time;
            element.message = element.message.split(':')[1];
          });
        }

      }).catch(err => {
        const errorMsg = err.response.error
        this.$message({
          message: errorMsg,
          type: "error"
        });
      })
		},
		// 发送信息
		sendMessage() {
			if (this.inputMsg.trim() == '') return
			if (!this.isMyFriend) {
				this.$message({
					message: 'ta不是您的好友，请先加ta为好友',
					type: "error"
				});
				return
			}
			if (!this.isHisFriend) {
				this.$message({
					message: '您不是ta的好友，请先加ta为好友',
					type: "error"
				});
				return
			}
      this.type = 'bottom'
			this.sendMsgBySocket();
			this.saveMsgByDB();
		},
		// 用socket发消息
		sendMsgBySocket() {
			const data = {
				from_user: this.fromUserInfo.user_id, // 自己的id
				to_user: this.toUserInfo.to_user, // 对方id
				name: this.fromUserInfo.name, // 自己的昵称
        remark: this.remarkName, // 别人给的备注
				avatar: this.fromUserInfo.avatar, // 自己的头像
				message: this.inputMsg, // 消息内容
				type: 'private',
				status: '1', // 是否在线 0为不在线 1为在线
				time: toNomalTime((new Date()).getTime()), // 时间
			};
			//  console.log(this.anotherRemarkName,'remark')
      data.remark = this.anotherRemarkName;
      socketWeb.emit('sendPrivateMsg', data)
			this.$store.commit('updateListMutation', data);
		},
		// 用数据库存消息
		saveMsgByDB() {
			const data = {
				from_user: this.fromUserInfo.user_id, // 自己的id
				to_user: this.toUserInfo.to_user, // 对方的id
				name: this.fromUserInfo.name, // 自己的昵称
        remark: this.remarkName, // 别人给的备注
				avatar: this.fromUserInfo.avatar, // 自己的头像
				message: this.inputMsg, // 消息内容
				status: '1', // 是否在线 0为不在线 1为在线
				time: toNomalTime((new Date()).getTime()), // 时间
			}
			//  存此条私聊信息到数据库
      this.savePrivateMsg(data)	.then(res => {
        if(res){
          this.inputMsg = '';
          //  存此条私聊信息到本地
          this.privateDetail.push(data);
        }
      }).catch(err => {
        const errorMsg = err.response.error
        this.$message({
          message: errorMsg,
          type: "error"
        });
      })
		},
		//  获取socket消息
		getMsgBySocket() {
      socketWeb.removeAllListeners('getPrivateMsg');
      socketWeb.on('getPrivateMsg', (data) => {
				// 如果收到的soket信息不是发给自己的 放弃这条soket 没必要了 因为私聊是点对点发送的
				//  if(data.to_user != this.fromUserInfo.user_id) return
				// 如果收到的soket信息不是来自当前聊天者 写入首页信息列表 并return
				//  console.log(data.from_user, '!=', this.toUserInfo.to_user)
				//  	// soket信息不是来自当前聊天者 vuex添加此条信息 有未读提示
				if (data.from_user != this.toUserInfo.to_user) {
					data.chatOfNow = false;
					this.$store.commit('updateListMutation', data)
					return
				} else {
					// soket信息来自当前聊天者 vuex添加此条信息 没未读提示
					data.chatOfNow = true;
					this.$store.commit('updateListMutation', data)
				}
				// 本地添加此条信息
				this.privateDetail.push(data);
			})
		},
		//  查询此用户与我的关系
		isFriend() {
      let params = {
        other_user_id: this.toUserInfo.to_user
      }
      this.isFriendJudge(params).then(res => {
        if (res) {
          this.isMyFriend = res.data.isMyFriend.length !== 0 ? true : false;
          this.isHisFriend = res.data.isHisFriend.length !== 0 ? true : false;
          if(res.data.isHisFriend.length > 0 && res.data.isMyFriend.length > 0){
            this.remarkName = res.data.isMyFriend[0].remark;
            this.anotherRemarkName = res.data.isHisFriend[0].remark;
          }
        }
      }).catch(err => {
        const errorMsg = err.response.error
        this.$message({
          message: errorMsg,
          type: "error"
        });
      })
		},
		// 将未读信息归零
		resetUnred() {
			this.$store.commit('resetUnredMutation', this.toUserInfo.to_user)
		},
		//  消息置底
    refresh() {
      setTimeout(() => {
        this.viewBox.scrollTop = this.viewBox.scrollHeight
      }, 100)
    },
    nofresh() {
      setTimeout(() => {
        this.afterScrollHeight = this.viewBox.scrollHeight - this.beforeScrollHeight;
        this.viewBox.scrollTop = this.afterScrollHeight;
      }, 100)
    },
    loadMore() {
      console.log('加載更多');
      this.beforeScrollHeight = this.viewBox.scrollHeight;
      if (!this.isNoMore) {
        this.isShowLoading = true;
        this.page = this.page + 1;
        let params = {
          page: this.page,
          pageNum: this.pageNum,
          to_user: this.toUserInfo.to_user
        }
        this.getPrivateDetail(params).then((res) => {
          if (res.success) {
            this.type = 'unBottom'
            if (res.data.privateDetail.length < this.pageNum) {
              this.isNoMore = true;
            }
            res.data.privateDetail.forEach(element => {
              element.time = element.time;
              element.message = element.message.split(':')[1];
            });
            this.privateDetail.unshift(...res.data.privateDetail);
            this.isShowLoading = false;
          }
        })
      }
    }
	},
	created() {
		this.toUserInfo.to_user = this.$route.params.user_id;
		this.fromUserInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
		this.isFriend();
		this.resetUnred();
		this.getPrivateMsg();
		this.getMsgBySocket();
		this.queryUserInfoSpecial({user_id: this.toUserInfo.to_user})
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/chat.scss";
</style>
