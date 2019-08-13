<template>
  <!-- 输入框组件 -->
  <div class="input-msg" :class="{ 'input-msg-select':showEmojiPicker}">
    <picker
      class="emoji-select"
      v-if="showEmojiPicker"
      title="Pick your emoji..."
      emoji="point_up"
      @select="addEmoji"
    />
    <svg class="svg-icon" :class="{ 'triggered': showEmojiPicker }" @mousedown.prevent="toggleEmojiPicker" viewBox="0 0 24 24" >
      <path fill="#E6A23C" d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />
    </svg>
    <div class="input-box">
      <textarea style="-webkit-user-select:text !important" @click="clickTextArea" ref="textarea" @focus="getFocus()" v-model="inputMsg" @keydown.enter.prevent="sendMessage(inputMsg)" placeholder="输入..."></textarea>
    </div>
    <p class="btn" :class="{'enable':inputMsg!=''}" @click="sendMessage(inputMsg)">{{btnInfo}}</p>
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'inputArea',
  components: {
    Picker
  },
  props: ['inputMsgData'],
  data() {
    return {
      inputMsg: '',
      btnInfo: "发送",
      showEmojiPicker: false,
      emojiSelect: false
    }
  },
  computed: {
    ...mapGetters([
      'isMobile',   // 是否是无线端
      'tabTipsGetter'
    ])
  },
  watch: {
    showEmojiPicker() {
      this.$emit('showEmojiPickerFunc', this.showEmojiPicker)
    },
    inputMsgData() {
      this.inputMsg = this.inputMsgData;
      let textarea = this.$refs.textarea;
      textarea.focus();
    }
  },
  methods: {
    ...mapActions([
      ''
    ]),
    /* 点击输入框 */
    clickTextArea(){
      let textarea = this.$refs.textarea;
      if (this.isMobile) {
        this.showEmojiPicker = false;
        this.emojiSelect = false;
        textarea.focus();
      }
    },
    /* 获取焦点事件 */
    getFocus(){
      let textarea = this.$refs.textarea;
      if (this.isMobile) {
        if(!this.emojiSelect){
          this.showEmojiPicker = false;
          textarea.focus();
        }else{
          this.showEmojiPicker = true;
          textarea.blur();
        }
      } else {
        textarea.focus();
      }
    },
    /* 展示表情框 */
    toggleEmojiPicker () {
      this.$loading.show();
      this.showEmojiPicker = !this.showEmojiPicker;
      let textarea = this.$refs.textarea;
      if (this.isMobile) {
        if (this.showEmojiPicker) {
          textarea.blur();
        } else {
          textarea.focus();
        }
      } else {
        textarea.focus();
      }
      this.$loading.hide();
    },
    /* 添加表情 */
    addEmoji (emoji) {
      this.emojiSelect = true;
      let textarea = this.$refs.textarea;
      const cursorPosition = textarea.selectionEnd;
      const start = this.inputMsg.substring(0, textarea.selectionStart);
      const end = this.inputMsg.substring(textarea.selectionStart);
      this.inputMsg = start + emoji.native + end;
      this.$nextTick(() => {
        textarea.selectionEnd = cursorPosition + emoji.native.length;
        textarea.focus();
      })
    },
    sendMessage(val){
      this.inputMsg = '';
      this.$emit('sendMessageFunc', val)
    }
  }

}
</script>

<style lang="scss" scoped>
  .svg-icon {
    cursor: pointer;
    height: 0.8rem;
    width: 0.8rem;
    padding: 0.06rem;
  }

</style>
