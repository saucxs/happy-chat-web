<template>
  <div class="no-content">
    <svg class="icon img" aria-hidden="true">
      <use xlink:href="#iconkong"></use>
    </svg>
    <div class="action" @click="goOther">
      <span class="primary-span">{{name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '',
      required: true
    },
    name: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    goOther: function () {
      let path;
      if(this.type === 'addAuthor'){
        path = `/user_info/16`
        this.$router.push(path)
      }else if(this.type === 'addGroup'){
        path = `/group_chat/f69fa910-4c64-11e9-941f-cb9c589f1e1d`
        this.$router.push(path)
      }
    }
  }
};
</script>
