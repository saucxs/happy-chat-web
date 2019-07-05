<template>
<div class="tips" v-if="isShow">
	<div v-if="type === 'success' " class="common-style success-tip">
		<svg class="icon" aria-hidden="true" style="font-size : 0.4rem">
      <use  xlink:href="#iconsuccess"></use>
    </svg>{{message}}
	</div>
	<div v-if="type === 'warn' " class="common-style warn-tip">
		<svg class="icon" aria-hidden="true" style="font-size : 0.4rem">
      <use  xlink:href="#iconwarn"></use>
    </svg> {{message}}
	</div>
	<div v-if="type === 'error' " class="common-style error-tip">
		<svg class="icon" aria-hidden="true" style="font-size : 0.4rem">
      <use  xlink:href="#iconerror"></use>
    </svg> {{message}}
	</div>
</div>
</template>

<script type="text/javascript">
export default {
	name: 'Message',
	data() {
		return {
			message: '',
			type: "success",
			time: 3500,
			isShow: true
		}
	},
	mounted() {
		this.close()
	},
	methods: {
		close() {
			var that = this
			window.setTimeout(function() {
				that.isShow = false
			}, this.time);
		}
	}
}
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base.scss";
.tips {
    position: fixed;
    top: 50%;
    left: 50%;
    font-size: 0.24rem;
    transform: translate(-50%, 0);
    z-index: 999999999;
    .common-style{
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: all;
      padding: 0.14rem 0.2rem;
      border-radius: 0.06rem;
      box-shadow: 0 0.02rem 0.08rem rgba(0, 0, 0, .2);
      background: #fff;
    }
    .error-tip {
      color: $base-danger-color;
    }
    .success-tip{
      color: $base-success-color;
    }
    .warn-tip {
        color: $base-warning-color;
    }

}
</style>
