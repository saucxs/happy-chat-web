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
            <ChatItem v-if="userInfo.user_id === item.from_user" :href="item.from_user" :img="item.avatar" me="true" :msg="item.message" :name="item.name" :time="item.time"></ChatItem>
            <ChatItem v-else :img="item.avatar" :msg="item.message" :href="item.from_user" :name="item.name" :time="item.time"></ChatItem>
          </li>
        </ul>
      </div>
    </div>
    <div @click="showGroupInfoDialog = false" class="chat-info-modal" v-if="showGroupInfoDialog"></div>
    <group-info v-if="showGroupInfoDialog" class="chat-info" :groupMembers="groupMembers" :groupInfoGetter="groupInfoGetter" :isMyGroup="isMyGroup"></group-info>

    <input-area v-if="isMyGroup" @showEmojiPickerFunc="showEmojiPickerFunc" @sendMessageFunc="sendMessageFunc" :inputMsgData="inputMsg"></input-area>
    <span v-else @click="goChat" class="base-button button join-group">加入群聊</span>
  </div>
</template>

<script>
  import Header from '../components/Header.vue'
  import ChatItem from '../components/ChatItem.vue'
  import LoadMore from '../components/LoadMore.vue';
  import GroupInfo from  './GroupInfo'
  import InputArea from '../components/InputArea'
  import {	toNomalTime } from "../utils/common";
  import { mapGetters, mapActions } from 'vuex';
  export default {
    components: {
      Header,
      ChatItem,
      LoadMore,
      GroupInfo,
      InputArea
    },
    data() {
      return {
        page: 1,
        pageNum: 20,
        isShowLoading: false,
        isNoMore: false,
        groupInfo: {
          groupId: '' // 群id
        },
        groupAvator: '', // 群头像
        groupMember: [], // 群成员id
        message: [], // 群消息
        inputMsg: '',
        userInfo: {},
        //  btnInfo: "发送",
        type: 'bottom',
        showGroupInfoDialog: false,
        groupMembers: [],  // 群成员信息列表,
        isMyGroup: null,
        viewBox: '',
        beforeScrollHeight: '',
        afterScrollHeight: '',
        showEmojiPicker: false,
        keyWordHeight: ''
      }
    },

    computed: {
      ...mapGetters([
        'groupInfoGetter', // 群资料
        'groupMemberGetter' // 群成员
      ])
    },

    watch: {
      message() {
        this.viewBox = this.$refs.viewBox;
        if (this.type == 'bottom') {
          this.refresh();
        } else {
          this.nofresh()
        }
      },
//     viewBoxHeight(val){
//       this.viewBoxHeight = val;
//       console.log(this.viewBoxHeight, '-=-=-=-=-=')
//     }
    },
    methods: {
      ...mapActions(["getGroupChat", "saveGroupChatMsg", "addGroupChatRelation", "judgeIsInGroup"]),
      /*子组件回传*/
      showEmojiPickerFunc(val) {
        this.showEmojiPicker = val;
        this.$nextTick(()=>{
          this.viewBoxHeight = this.$refs.viewBox.clientHeight;
          // console.log(this.viewBoxHeight, '-=-=-=-=-=')
          this.keyWordHeight = document.body.clientHeight - this.viewBoxHeight - 176;
          // console.log(this.keyWordHeight, '键盘高度')
        })
        this.refresh()
      },
      sendMessageFunc(val) {
        this.inputMsg = val;
        this.sendMessage();
      },
      // 获取聊天记录
      getChatMsg() {
        let params = {
          page: this.page,
          pageNum: this.pageNum,
          groupId: this.groupInfo.groupId
        }
        this.$loading.show();
        this.getGroupChat(params).then((res) => {
          this.$loading.hide();
          if ( res.success ) {
            this.type = 'bottom'
            this.message = res.data.groupMsg;
            this.groupMembers = res.data.groupMemberInfo;
            this.$store.commit('groupInfoMutation', res.data.groupInfo[0])
            this.$store.commit('groupMemberMutation', res.data.groupMember)
            //  群成员不存在此用户id，则添加
            //  if (!res.data.groupMember.includes(this.userInfo.user_id)) {
            //    this.addGroupUserRelation();
            //    const data = {
            //      action: "push",
            //      message: "您已成功加入此群！",
            //      group_avatar: this.groupInfoGetter.group_avatar,
            //      group_name: this.groupInfoGetter.group_name,
            //      time: this.groupInfoGetter.creater_time,
            //      group_id: this.groupInfoGetter.group_id,
            //      type: "group",
            //      id: this.groupInfoGetter.group_id
            //    }
            //    this.$store.commit('updateListMutation', data)
            //  }
            if ( this.message.length == 0 || this.message.length < this.pageNum ) {
              this.isNoMore = true
            };
            this.message.forEach(element => {
              element.time = element.time;
              element.message = element.message.split(':')[1];
            });
          } else {
            this.$message({
              message: '服务器出错啦',
              type: "error"
            });
          }
        })
      },
      // 发送信息
      async sendMessage() {
        if ( this.inputMsg.trim() == '' ) return
        let data = {
          groupId: this.groupInfo.groupId, // 群id
          group_name: this.groupInfoGetter.group_name, // 群名称
          group_avatar: this.groupInfoGetter.group_avatar, // 群头像
          groupMember: this.groupMemberGetter, // 所有群成员的id
          from_user: this.userInfo.user_id, // 自己的id
          name: this.userInfo.name, // 自己的昵称
          avatar: this.userInfo.avatar, // 自己的头像
          message: this.inputMsg, // 消息内容
          time: toNomalTime(new Date().getTime()) // 时间
        }
        this.type = 'bottom';
        socketWeb.emit('sendGroupMsg', data);
        this.saveMsgByDB();
      },
      // 保存此条信息到数据库
      saveMsgByDB() {
        let params = {
          groupId: this.groupInfo.groupId,
          message: this.inputMsg,
          name: this.userInfo.name,
          time: toNomalTime((new Date()).getTime())
        }
        this.saveGroupChatMsg(params).then((res) => {
          if ( res.success ) {
            this.inputMsg = '';
          } else {
            this.$message({
              message: '服务器出错啦',
              type: "error"
            });
          }
        })
      },
      //  把新成员加入群名单
      addGroupUserRelation() {
        let params = {
          groupId: this.groupInfo.groupId
        }
        this.addGroupChatRelation(params).then(res => {
          if ( res.success ){
            this.getChatMsg();
            const data = {
              action: "push",
              message: "您已成功加入此群！",
              group_avatar: this.groupInfoGetter.group_avatar,
              group_name: this.groupInfoGetter.group_name,
              time: this.groupInfoGetter.creater_time,
              group_id: this.groupInfoGetter.group_id,
              type: "group",
              id: this.groupInfoGetter.group_id
            }
            this.$store.commit('updateListMutation', data);
            this.isMyGroup = true;
          } else {
            this.$message({
              message: res.message || '服务器出错啦',
              type: "warn"
            });
          }
        })
      },
      //  获取socket消息
      getMsgBySocket() {
        socketWeb.removeAllListeners('getGroupMsg');
        socketWeb.on('getGroupMsg', (data) => {
          // 收到soket群信息 如果该群群成员不包含自己 放弃这条soket
          if (!this.groupMemberGetter.includes(this.userInfo.user_id)) return;
          // 如果收到的soket信息不是来自当前聊天群 写入首页信息列表 并return
          data.type = 'group';
          if ( data.groupId != this.groupInfo.groupId ) {
            this.$store.commit('updateListMutation', data)
            return
          } else {
            // soket信息来自当前聊天群 vuex添加此条信息
            data.chatOfNow = true;
            this.$store.commit('updateListMutation', data)
            // 本地添加此条信息
            this.message.push(data);
          }
        })
      },
      // 将未读信息归零
      resetUnred() {
        this.$store.commit('resetUnredMutation', this.groupInfo.groupId)
      },
      //  消息置底
      refresh() {
        setTimeout(() => {
          this.viewBox.scrollTop = this.viewBox.scrollHeight
        }, 4)
      },
      //  消息保持不变
      nofresh() {
        setTimeout(() => {
          this.afterScrollHeight = this.viewBox.scrollHeight - this.beforeScrollHeight;
          this.viewBox.scrollTop = this.afterScrollHeight;
        }, 4)
      },
      loadMore() {
        if ( !this.isMyGroup ) {
          this.$message({
            message: '请先加入群聊',
            type: "warn"
          });
        } else {
          this.beforeScrollHeight = this.viewBox.scrollHeight;
          if ( !this.isNoMore ) {
            this.isShowLoading = true;
            this.page = this.page + 1;
            let params = {
              page: this.page,
              pageNum: this.pageNum,
              groupId: this.groupInfo.groupId
            }
            this.getGroupChat(params).then((res) => {
              if (res.success) {
                this.type = 'unBottom';
                if ( res.data.groupMsg.length < this.pageNum ) {
                  this.isNoMore = true;
                }
                res.data.groupMsg.forEach(element => {
                  element.time = element.time;
                  element.message = element.message.split(':')[1];
                });
                if ( res.data.groupMsg.length == 0 ) return ;
                this.message.unshift(...res.data.groupMsg);
                this.isShowLoading = false;
              }
            })
          }
        }
      },
      showGroupInfoChild(val) {
        this.showGroupInfoDialog = val;
      },
      // 看该用户是否在某个群中(根据返回的数组长度是不是为零
      isInGroup() {
        let params = {
          group_id: this.$route.params.group_id
        }
        this.judgeIsInGroup(params).then((res) => {
          if ( res.success ) {
            this.isMyGroup = res.data.group_user.length === 0 ? false : true;
          } else {
            this.$message({
              message: '服务器出错啦',
              type: "error"
            });
          }
        })
      },
      goChat() {
        this.addGroupUserRelation();
      },
      handleScroll() {
        this.viewBox = this.$refs.viewBox;
      },
      handleOnresize() {
        this.viewBox = this.$refs.viewBox;
        // console.log(this.viewBox.clientHeight, '聊天页高度')
        this.viewHeight = this.viewBox.clientHeight;
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
      //  window.addEventListener('scroll', this.handleScroll, true);  //  监听（绑定）滚轮滚动事件
      this.viewBoxHeight = this.$refs.viewBox.clientHeight;
    },
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/chat.scss";
</style>
