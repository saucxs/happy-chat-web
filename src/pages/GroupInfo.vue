<template>
<!-- 群资料 -->
<div class="wrapper-group">
	<div class="info">
    <p class="notice-title">群公告</p>
    <p class="notice-content">{{groupInfoGetter.group_notice}}</p>
    <p class="notice-title">群创建者：{{groupInfoGetter.group_creater}}</p>
    <p class="notice-title">群创建时间：<span class="notice-content">{{groupInfoGetter.creater_time}}</span></p>
    <p class="member-number">人数：{{groupMembers.length}}</p>
	</div>
  <ul class="members">
    <li class="member" v-for="(item,index) in groupMembers" @click="goInfo(item)">
      <div class="avatar">{{item.avator}}</div>
      <span class="member-name">{{item.name}}</span>
    </li>
  </ul>
	<div class="action action-spe">
    <span class="warning-span whole-span" v-if="isMyGroup" @click="exitGroup">退出群聊</span>
    <span class="primary-span whole-span" v-else @click="goChat">加入群聊</span>
	</div>
	<!-- <div v-else class="action">
        <span class="go-chat" @click="goChat">加入群聊</span>
    </div> -->
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
	data() {
		return {
			groupInfo: {}, //群资料
			userInfo: {}, //本机用户资料
		}
	},
  props: {
    groupMembers: Array,
    groupInfoGetter: Object,
    isMyGroup: Boolean
  },
	computed: {},
	methods: {
    ...mapActions(["getGroupInformation", "judgeIsInGroup", "exitChatGroup"]),
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
			// const path = `/group_chat/${this.$route.params.group_id}`
			// this.$router.push(path)
		},
    goInfo(item) {
      const path = `/user_info/${item.user_id}`
      this.$router.push(path)
    }
	},
	async created() {
		this.userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
		// await this.isInGroup();
		// this.getGroupInfo();

	}
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/chat.scss";
.wrapper-group {
  .info{
    padding: 0.15rem 0.2rem 0.3rem 0.2rem;
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
  .members{
    list-style: none;
    overflow-y: auto;
    font-size: 0.26rem;
    height: calc(100% - 5.22rem);
    max-height: calc(100% - 5.22rem);
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
}
</style>
