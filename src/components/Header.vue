<template>
<div class="header">
	<svg v-if="goback" class="icon goback" aria-hidden="true" @click="goBack">
    <use xlink:href="#iconback"></use>
  </svg>
	<span>{{title}}</span>
	<svg v-show="currentTab === 1 || currentTab === 3" class="icon add" aria-hidden="true" @click="add">
    <use xlink:href="#iconadd-copy"></use>
  </svg>
	<svg v-show="groupInfo" class="icon add" aria-hidden="true" @click="lookGroupInfo">
    <use xlink:href="#icongroup-copy-white"></use>
  </svg>
	<svg v-show="userInfo" class="icon add" aria-hidden="true" @click="lookUserInfo">
    <use xlink:href="#icongroup-copy-white"></use>
  </svg>
</div>
</template>

<script>
export default {
	name: 'Header',
	props: ['currentTab', 'chatTitle', 'goback', 'groupInfo', 'userInfo'],
	data() {
		return {}
	},
	computed: {
		title() {
			if (this.currentTab === 1) {
				return '消息'
			} else if (this.currentTab === 2) {
				return '机器人'
			} else if (this.currentTab === 3) {
				return '通讯录'
			} else if (this.currentTab === 4) {
				return '我'
			} else {
				return this.chatTitle
			}
		}
	},
	methods: {
		add() {
			this.$router.push("/add");
		},
		lookGroupInfo() {
		  //  this.showGroupInfo = true;
		  this.$emit('showGroupInfo',true)
			//  const path = `/group_info/${this.$route.params.group_id}`;
			//  this.$router.push(path);
		},
		lookUserInfo() {
			const path = `/user_info/${this.$route.params.user_id}`;
			this.$router.push(path);
		},
		goBack() {
			this.$router.back();
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/base.scss";
.header {
   border-bottom: 1px solid #f3eeee;
   height: 1rem;
   background-color: $base-color;
   line-height: 1rem;
   overflow: hidden;
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: center;
   font-size: 0.34rem;
   color: white;
  .icon {

  }
  .add {
    font-size: 0.45rem;
    position: absolute;
    right: 0.2rem;
  }
  .goback {
    position: absolute;
    left: 0.2rem;
    font-size: 0.4rem;
  }
 }
</style>
