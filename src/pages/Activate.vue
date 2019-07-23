<template>
<!--  登录 -->
<div class="activate">
	<div class="wrapper fadeInDown">
		<div id="formContent">
			<h2 class="active"> 激活邮箱 </h2>
			<div class="fadeIn first">
        <svg id="icon" class="icon" alt="User Icon" aria-hidden="true">
          <use xlink:href="#iconliaotian"></use>
        </svg>
			</div>
      <p class="message-tip">{{message}}</p>
      <div class="action">
        <span @click="goBackLogin" class="primary-span">返回登录</span>
      </div>
		</div>
	</div>
</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	name: "activate",
	props: {},
	components: {},
	data() {
		return {
			code: this.$route.params.code,
      message: ''
		};
	},
  //  beforeRouteEnter: (to, from, next) => {
  //    next(vm => {
  //      let data = {
  //        code: vm.code
  //      }
  //      vm.activateEmail(data).then(res => {
  //        if (res) {
  //          vm.message = res.message;
  //        }
  //      }).catch(err => {
  //        this.$message({
  //          message: '服务器出错啦',
  //          type: "error"
  //        });
  //      })
  //    });
  //  },
  created() {
	  this.activateEmailFunction();
  },
	methods: {
    ...mapActions(["activateEmail"]),
    goBackLogin () {
      this.$router.push('/login')
    },
    activateEmailFunction() {
      let data = {
        code: this.code
      }
      this.activateEmail(data).then(res => {
        if (res) {
          this.message = res.message;
        }
      }).catch(err => {
        this.$message({
          message: err || '服务器出错啦',
          type: "error"
        });
      })
    }
	}
};
</script>

<style lang="scss" scoped>
@import "../assets/css/activate.scss";
</style>
