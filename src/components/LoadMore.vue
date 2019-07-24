<template>
  <div class="load-more" @click="loadMore">
    <p class="has-more" v-show="!isNoMore && !isShowLoading">加载更多</p>
    <p class="no-more" v-show="isNoMore">没有更多了</p>
    <loading v-show="isShowLoading"></loading>
  </div>
</template>

<script>
import Loading from './LoadSpecial.vue';
export default {
  components: {
    Loading
  },
  props: {
    isNoMore: {
      type: Boolean,
      default: false,
      required: true
    },
    isShowLoading: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  methods: {
    loadMore: function () {
      this.$emit('load-more');
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
.load-more {
  text-align: center;
  padding-top: 0.16rem;
  .has-more {
    cursor: pointer;
    font-size: 0.25rem;
    color: $base-color;
  }
  .no-more {
    cursor: default;
    font-size: 0.2rem;
    color: $gray-color;
  }
}
</style>

