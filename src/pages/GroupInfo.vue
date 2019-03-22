<template>
<!-- 群资料 -->
<div class="wrapper">
	<Header goback='true' chatTitle="群资料"></Header>
	<div class="content">
    <div class="content-box">
      <svg id="icon" class="icon" alt="User Icon" aria-hidden="true">
        <use xlink:href="#icongroup"></use>
      </svg>
    </div>
		<p>
			<span>群名</span>：{{this.groupInfo.group_name}}
		</p>
		<p>
			<span>群创建者</span>：{{this.groupInfo.group_creater}}
		</p>
		<p>
			<span>群创建时间</span>：{{this.groupInfo.creater_time}}
		</p>
		<p>
			<span>群公告</span>：{{this.groupInfo.group_notice}}
		</p>
	</div>
	<div class="action">
		<span v-if="isMyGroup" class="del-group" @click="exitGroup">退出群聊</span>
		<span class="go-chat" @click="goChat">{{isMyGroup ? '进入群聊' : '加入群聊' }}</span>
	</div>
	<!-- <div v-else class="action">
        <span class="go-chat" @click="goChat">加入群聊</span>
    </div> -->
</div>
</template>

<script>
import Header from '../components/Header.vue'
import axios from "axios"
import { mapGetters, mapActions } from 'vuex';
export default {
	data() {
		return {
			groupInfo: {}, //群资料
			userInfo: {}, //本机用户资料
			isMyGroup: null
		}
	},
	computed: {},
	components: {
		Header
	},
	methods: {
    ...mapActions(["getGroupInformation", "judgeIsInGroup", "exitChatGroup"]),
		//获取群资料
		getGroupInfo() {
      let params = {
        groupId: this.$route.params.group_id
      }
      this.getGroupInformation(params).then(res => {
        console.log(res, '建群信息');
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
		exitGroup() {
      let params = {
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
			const path = `/group_chat/${this.$route.params.group_id}`
			this.$router.push(path)
		}
	},
	async created() {
		this.userInfo = JSON.parse(sessionStorage.getItem("HappyChatUserInfo"));
		await this.isInGroup();
		this.getGroupInfo();

	}
}
</script>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    padding-top: 8vh;
    .content {
      text-align: center;
      margin-top: 3vh;
      .content-box{
        text-align: center;
        padding: 4vh 0 6vh 0;
      }
        img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            margin: 1rem 0 0.6rem;
        }
        p {
            font-size: 3vh;
            line-height: 0.8rem;
            color: #4290F7;
            span {
                font-size: 3vh;
            }
        }
    }
    .action {
        position: absolute;
        width: 100%;
        top: 8.8rem;
        text-align: center;
        span {
            display: inline-block;
            font-size: 0.26rem;
            line-height: 0.26rem;
            padding: 0.16rem 0;
            width: 40%;
            cursor: pointer;
        }
        .go-chat {
            background-color: #4290F7;
            color: #fff;
        }
        .del-group {
            background-color: #E16762;
            color: #fff;
        }
    }
}
</style>
