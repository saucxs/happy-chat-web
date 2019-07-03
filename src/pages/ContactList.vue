<template>
  <!--通讯录-->
<div class="wrapper">
	<Header :currentTab="currentTab"></Header>
	<div class="new-friend" @click="newFriendList">
		<svg class="icon img" aria-hidden="true"> <use  xlink:href="#iconfriends"></use></svg><span>新朋友</span>
		<svg class="icon enter" aria-hidden="true"> <use  xlink:href="#iconright"></use></svg>
	</div>
	<p class="tab"><span :class="friend" @click="showFriends">朋友</span><span :class="group" @click="showGroups">群组</span></p>
  <div class="chat-wrapper">
    <div class="secret-box">
      <ul v-if="friend">
        <li v-for="(data, index) in alreadyFriends">
          <div class="list-box" @click="enterIt(data.other_user_id,'friend')">
            <img :src="data.avator" alt="">
            <div class="content">
              <p>{{data.name}}</p>
              <p>
                <svg class="icon" aria-hidden="true">
                  <use v-if="data.sex === 0"  xlink:href="#iconxingbienan"></use>
                  <use v-else xlink:href="#iconxingbienv"></use>
                </svg>
              </p>
            </div>
            <div class="remark">{{data.remark === ''? '没有留下备注~': data.remark}}</div>
          </div>
        </li>
      </ul>
      <ul v-if="group">
        <li v-for="(data, index) in alreadyGroups">
          <div class="list-box" @click="enterIt(data.group_id,'group')">
            <img :src="data.avator" alt="">
            <div class="content">
              <p>{{data.group_name}}</p>
              <p>群主：{{data.group_creater}}</p>
            </div>
            <div class="remark">{{data.group_notice === ''? '没有留下公告~': data.group_notice.slice(0,10)+'...'}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
	<Footer :currentTab="currentTab"></Footer>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import axios from "axios"
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		Header,
		Footer
	},

	data() {
		return {
			currentTab: 3,
			friend: "hover",
			group: "",
      alreadyFriends: [],
      alreadyGroups: []
		}
	},

	computed: {},

	watch: {},

	methods: {
    ...mapActions(["getAlreadyFriends", "getAlreadyGroups"]),
    enterIt(val,type) {
      if(type === 'friend'){
        this.$router.push(`/user_info/${val}`)
      }else if(type === 'group'){
        this.$router.push(`/group_info/${val}`)
      }
    },
		showFriends() {
			this.friend = "hover";
			this.group = '';
		},
		showGroups() {
			this.friend = '';
			this.group = "hover";
		},
    newFriendList () {
      this.$router.push({path: 'contact_list/new_friends'})
    },
    alreadyFriendsList(){
      this.getAlreadyFriends({user_id: this.userInfo.user_id}).then(res => {
        if (res) {
          this.alreadyFriends =  res.data.alreadyFriends
        }
      })
    },
    alreadyGroupsList () {
      this.getAlreadyGroups({user_id: this.userInfo.user_id}).then(res => {
        if (res) {
          this.alreadyGroups =  res.data.alreadyGroups
        }
      })
    }

	},

	mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
    this.alreadyFriendsList();
    this.alreadyGroupsList()
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
  .secret-box{
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
        .remark {
          font-size: 0.2rem;
          margin-left: 2vh;
        }
      }
    }
    .new-friend {
        background-color: #fff;
        color: #333;
        display: flex;
        display: -webkit-flex;
        padding: 0.16rem;
        margin-bottom: 0.16rem;
        text-decoration: none;
        .icon {
            font-size: 0.4rem;
            line-height: 0.4rem;
        }
        .enter {
            position: absolute;
            right: 0.2rem;
        }
        span {
            font-size: 0.28rem;
            line-height: 0.5rem;
            margin-left: 0.2rem;
            // overflow: hidden;
        }
    }
    .tab {
        font-size: 0.3rem;
        background-color: #fff;
        color: #333;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        // border: red;
        span {
            padding: 0.16rem;
        }
        .hover {
            color: #1E90FF;
            border-bottom: 0.03rem solid #1E90FF;
        }
    }
}
</style>
