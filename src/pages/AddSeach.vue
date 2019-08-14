<template>
<div class="wrapper">
	<Header goback='true' :chatTitle="chatTitle"></Header>
  <div class="chat-wrapper-no-footer">
    <div v-if="userDataList.length > 0 || groupDataList.length > 0" class="secret-box-spe">
      <ul>
        <li v-if="userDataList !== []" v-for="data in userDataList">
          <div class="people-box" @click="enterUserCard(data.id)">
            <img :src="data.avatar" alt="">
            <div class="content">
              <p>{{data.name}}
                <svg v-if="data.sex = 0" class="icon" aria-hidden="true"> <use  xlink:href="#icon-icon1"></use></svg>
                <svg v-else class="icon" aria-hidden="true"> <use  xlink:href="#icon-icon"></use></svg>
              </p>
              <p>
                <svg v-if="data.place" class="icon" aria-hidden="true"> <use  xlink:href="#icon-placeholder"></use></svg> {{data.place}}
                <svg v-if="data.github" class="icon" aria-hidden="true"> <use  xlink:href="#icon-github"></use></svg> {{data.github}}
              </p>
            </div>
          </div>
        </li>
        <li v-if="groupDataList !== []" v-for="data in groupDataList">
          <div class="people-box" @click="enterGroupCard(data.group_id)">
            <img :src="data.group_avatar" alt="">
            <div class="content">
              <p class="group-creater">{{data.group_name}} <svg class="icon" aria-hidden="true"> <use  xlink:href="#icon-group_fill"></use></svg>
                <span> {{data.group_creater}}</span>
              </p>
              <p>
                <span>群公告：{{data.group_notice}}</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <Nothing v-else :name="'返回'" :type="'goSearch'"></Nothing>
  </div>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Nothing from '../components/Nothing.vue'
import { mapGetters, mapActions } from 'vuex';
import axios from "axios"
export default {
	components: {
		Header,
    Nothing
	},
	data() {
		return {
			chatTitle: "查找中...",
			userDataList: [],
			groupDataList: []
		}
	},
	computed: {},
	watch: {},
	methods: {
    ...mapActions(["findPerson","getGroupInformation"]),
		getChatTitle() {
			const username = this.$route.params.username;
			const groupname = this.$route.params.groupname;
			if (username) {
				this.findPeople(username)
			} else if (groupname) {
				this.findGroup(groupname);
			}
		},
		// 找人
		findPeople(username) {
      this.findPerson({ name: username }).then(res => {
        if(res.success){
          this.userDataList = res.data.userInfo;
          this.chatTitle = "查找结果（"+ this.userDataList.length +"人）";
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
		// 找群
		findGroup(groupname) {
      this.getGroupInformation({groupName: groupname}).then(res => {
        if(res.success){
          this.groupDataList = res.data.groupInfo;
          this.chatTitle = "查找结果（"+ this.groupDataList.length +"群）";
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
		enterUserCard(val) {
			this.$router.push(`/user_info/${val}`)
		},
		enterGroupCard(val) {
			this.$router.push(`/group_chat/${val}`)
		}
	},

	mounted() {
		this.getChatTitle();
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
    .people-box{
      display: flex;
      align-items: center;
      padding: 1.5vh 2vh;
      img {
        margin-right: 20px;
      }
    }

    .can-find {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    ul {
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
                font-size: 0.24rem;
                p:nth-child(1) {
                    font-size: 0.28rem;
                    .icon {
                        width: 0.26rem;
                        height: 0.26rem;
                        margin-left: 0.1rem;
                    }
                }
                p:nth-child(2) {
                    font-size: 0.2rem;
                    line-height: 0.3rem;
                    color: #555;
                    .icon {
                        width: 0.36rem;
                        height: 0.36rem;
                        margin: 0 0.1rem;
                    }
                }
                .group-creater {
                    .icon {
                        width: 0.4rem !important;
                        height: 0.4rem !important;
                    }
                    span {
                        font-size: 0.22rem;
                    }
                }
            }
        }
    }
}
</style>
