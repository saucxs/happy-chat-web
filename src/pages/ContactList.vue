<template>
  <!--通讯录-->
<div class="wrapper">
	<Header :currentTab="currentTab"></Header>
	<div class="new-friend" @click="newFriendList">
		<svg class="icon img" aria-hidden="true"> <use  xlink:href="#iconfriends"></use></svg><span>新朋友</span>
		<svg class="icon enter" aria-hidden="true"> <use  xlink:href="#iconright"></use></svg>
	</div>
	<p class="tab">
    <span :class="friend" @click="showFriends">朋友</span>
    <span :class="group" @click="showGroups">群组</span>
  </p>
  <div class="chat-wrapper-contract-list">
    <div class="secret-box">
      <ul v-if="friend">
        <Nothing v-if="alreadyFriends.length === 0" :name="'加好友'" :type="'addAuthor'"></Nothing>
        <li v-else v-for="(data, index) in alreadyFriends">
          <div class="list-box" @click="enterIt(data.other_user_id,'friend')">
            <img :src="data.avatar" alt="">
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
        <Nothing v-if="alreadyGroups.length === 0" :name="'加群'" :type="'addGroup'"></Nothing>
        <li v-else v-for="(data, index) in alreadyGroups">
          <div class="list-box" @click="enterIt(data.group_id,'group')">
            <img :src="data.avatar" alt="">
            <div class="content">
              <p>{{data.group_name}}</p>
              <p>群主：{{data.group_creater}}</p>
            </div>
            <div class="remark" v-if="data.group_notice === ''">没有留下公告~</div>
            <div class="remark" v-else>{{data.group_notice | dotdot(16) }}</div>
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
import Nothing from '../components/Nothing.vue'
import axios from "axios"
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		Header,
		Footer,
    Nothing
	},
	data() {
		return {
			currentTab: 3,
			friend: "hover",
			group: "",
      alreadyFriends: ['1'],
      alreadyGroups: ['1']
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
        this.$router.push(`/group_chat/${val}`)
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
      this.$loading.show();
      this.getAlreadyFriends().then(res => {
        if (res) {
          this.$loading.hide();
          this.alreadyFriends =  res.data.alreadyFriends
        }
      })
    },
    alreadyGroupsList () {
      this.getAlreadyGroups().then(res => {
        if (res) {
          this.alreadyGroups =  res.data.alreadyGroups
        }
      })
    }

	},

	mounted() {
    Promise.all([this.alreadyFriendsList(),this.alreadyGroupsList()]);
	}
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/chat.scss";
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
      padding: 0.2rem 0.15rem;
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
          margin-left: 0.2rem;
          color: $gray-color;
        }
      }
    }
    .new-friend {
        background-color: #fff;
        color: #333;
        display: flex;
        display: -webkit-flex;
        padding: 0.2rem;
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
            //  overflow: hidden;
        }
    }
    .tab {
        font-size: 0.3rem;
        background-color: #fff;
        color: #333;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        span {
            padding: 0.2rem;
        }
        .hover {
            color: #1E90FF;
            border-bottom: 0.03rem solid #1E90FF;
        }
    }
}
</style>
