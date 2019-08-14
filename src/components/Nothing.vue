<template>
  <div class="no-content">
    <svg class="icon img" aria-hidden="true">
      <use xlink:href="#iconkong"></use>
    </svg>
    <div class="action" @click="goOther" v-if="type !== '' && name !== ''">
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
      required: false
    },
    name: {
      type: String,
      default: '',
      required: false
    }
  },
  methods: {
    goOther: function () {
      let path;
      if(this.type === 'addAuthor'){
        path = `/user_info/16`
        this.$router.push(path)
      }else if(this.type === 'addGroup'){
        path = `/group_chat/64bd8fa0-a149-11e9-8893-6bfa70c9461a`
        this.$router.push(path)
      }else if(this.type === 'goSearch'){
        path = `/add`
        this.$router.push(path)
      }
    }
  }
};
</script>
