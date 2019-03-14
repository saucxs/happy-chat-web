<template>
<!--  登录 -->
<div class="login">
	<Message-box :visible="this.messageBox.visible" :messageBoxEvent="this.messageBox.messageBoxEvent" @confirm="confirm" :hasCancel=false>
		<p slot="content">{{this.messageBox.message}}</p>
	</Message-box>
	<div class="wrapper fadeInDown">
		<div id="formContent">
			<h2 class="active"> 激活 </h2>
			<div class="fadeIn first">
        <svg id="icon" class="icon" alt="User Icon" aria-hidden="true">
          <use xlink:href="#iconliaotian"></use>
        </svg>
			</div>
      <h3>恭喜激活成功</h3>
		</div>
	</div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
	name: "activate",
	props: {},
	components: {},
	data() {
		return {
			code: this.$route.params.code
		};
	},
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.activateEmail(vm.code);
    });
  },
	methods: {
    ...mapActions(["activateEmail"])
	}
};
</script>

<style lang="scss" scoped>
@import "../assets/css/loginregister.scss";
</style>
