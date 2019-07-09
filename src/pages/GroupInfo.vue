<template>
<!-- 群资料 -->
<div class="wrapper-group">
	<div class="info">
    <p class="notice-title">群公告</p>
    <p class="notice-content">{{groupInfoGetter.group_notice}}</p>
    <p class="notice-title">群创建者：{{groupInfoGetter.group_creater}}</p>
    <p class="notice-title">群创建时间：<span class="notice-content">{{groupInfoGetter.creater_time}}</span></p>
    <p class="member-number">人数：{{groupMembers.length}}</p>
    <p class="edit-group-box">
      <span @click="goEditGroup" class="edit-group-info" v-if="groupInfoGetter.group_creater == userInfo.name">修改群资料</span>
    </p>

	</div>
  <ul :class="ownerFlag?'members-spe':'members'">
    <li class="member" v-for="(item,index) in groupMembers" @click="goInfo(item)">
      <div class="avatar">{{item.avator}}</div>
      <span class="member-name">{{item.name}}</span>
    </li>
  </ul>
  <div class="box-button-group">
    <span v-if="isMyGroup" @click="copyGroupUrl" class="warning-button button-spe">分享群链接</span>
    <span v-if="isMyGroup" @click="exitGroup" class="warning-button button-spe">退出群聊</span>
    <span v-else @click="goChat" class="base-button button">加入群聊</span>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
	data() {
		return {
			groupInfo: {}, //群资料
			userInfo: {}, //本机用户资料,
      shareGroupUrl: window.location,
      ownerFlag: false
		}
	},
  props: {
    groupMembers: Array,
    groupInfoGetter: Object,
    isMyGroup: Boolean
  },
	computed: {},
	methods: {
    ...mapActions(["getGroupInformation", "judgeIsInGroup", "addGroupChatRelation", "exitChatGroup"]),
    /*去编辑群*/
    goEditGroup() {
      this.$router.push({
        path: `/edit_group/` + this.$route.params.group_id
      });
    },
		//获取群资料
		getGroupInfo() {
      let params = {
        groupId: this.$route.params.group_id
      }
      this.getGroupInformation(params).then(res => {
        if(res.success){
          this.groupInfo = res.data.groupInfo[0];
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
		exitGroup() {
      let params = {
        user_id: this.userInfo.user_id,
        group_id: this.$route.params.group_id
      }
      this.exitChatGroup(params).then((res) => {
        const data = {
          action: "delete",
          id: this.$route.params.group_id
        }
        if(res.success){
          this.$store.commit('updateListMutation', data)
          this.$router.push('/message');
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
		},
    // 把新成员加入群名单
    addGroupUserRelation() {
      let params = {
        groupId: this.groupInfoGetter.group_id,
      }
      this.addGroupChatRelation(params).then(res => {
        if(res.success){
          this.getChatMsg();
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
        }else{
          this.$message({
            message: res.message,
            type: "warn"
          });
        }
      })
    },
    goInfo(item) {
      const path = `/user_info/${item.user_id}`
      this.$router.push(path)
    },
    copyGroupUrl(){
      let thatMessage = this.$message
      this.$copyText(this.shareGroupUrl).then(function (e) {
        thatMessage({
          message: '复制成功',
          type: "success"
        });
      }, function (e) {
        thatMessage({
          message: '复制失败',
          type: "error"
        });
      })
    },
	},
	async created() {
		this.userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
		// await this.isInGroup();
		// this.getGroupInfo();
    if(this.groupInfoGetter.group_creater == this.userInfo.name){
      this.ownerFlag = true
    }
	}
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/chat.scss";
.wrapper-group {
  .edit-group-box{
    display: flex;
    justify-content: center;
    padding-top: 0.1rem;
  }
  .edit-group-info{
    font-size: 0.24rem;
    padding: 0.1rem 0.2rem;
    background: $base-success-color;
    color: #ffffff;
    border-radius: 0.24rem;
  }
  .info{
    padding: 0.2rem;
    .notice-title{
      color: #676767;
      padding-bottom: 0.1rem;
      font-size: 0.26rem;
      position: relative;
    }
    .notice-content{
      word-wrap: break-word;
      height: 0.6rem;
      overflow: hidden;
      overflow-y: auto;
      font-size: 0.2rem;
    }
    .member-number{
      font-size: 0.26rem;
      padding-top: 0.1rem;
      color: #676767;
    }
  }
  .members-spe{
    padding-top: 0.1rem;
    background: #fff;
    list-style: none;
    overflow-y: auto;
    font-size: 0.26rem;
    height: calc(100% - 5.6rem);
    max-height: calc(100% - 5.6rem);
  }
  .members{
    padding-top: 0.1rem;
    background: #fff;
    list-style: none;
    overflow-y: auto;
    font-size: 0.26rem;
    height: calc(100% - 4.8rem);
    max-height: calc(100% - 4.8rem);
  }
  .member{
    padding: 0.15rem 0.2rem;
    display: flex;
    align-items: center;
    cursor: pointer;
  .avatar{
    position: relative;
    text-align: center;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    border: 1px solid #676767;
    line-height: 0.4rem;
    color: white;
    display: inline-block;
  }
  .member-name{
    font-size: 0.26rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 0.6rem);
    padding-left: 10px;
  }
  }
}
</style>
