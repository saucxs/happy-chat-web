<template>
  <!-- 编辑或创建群 -->
  <div class="wrapper">
    <Header goback='true' chatTitle="群资料"></Header>
    <Message-box :messageBoxEvent="this.messageBox.messageBoxEvent" :visible="this.messageBox.visible" :hasCancel='false' @confirm="confirm">
      <p slot="content">{{this.messageBox.message}}</p>
    </Message-box>
    <div class="chat-wrapper-no-footer">
      <div class="secret-box-spe">
        <div class="content">
          <div class="content-box">
            <svg id="icon" class="icon" alt="User Icon" aria-hidden="true">
              <use xlink:href="#icongroup"></use>
            </svg>
          </div>
          <p>群名:</br><input type="text" style="-webkit-user-select:text !important" v-model="groupInfo.group_name" placeholder="不超过10个字哦" maxlength="10"/></p>
          <p>群公告:</br><textarea rows="4" type="text" style="-webkit-user-select:text !important" v-model="groupInfo.group_notice" placeholder="不超过40个字哦" maxlength="40"/></textarea>
          </p>
          <div class="action" v-if="editGroupId" @click="editGroup">
            <span class="creat_group">编辑群</span>
          </div>
          <div class="action" v-else @click="createGroup">
            <span class="creat_group">确定建群</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import Header from '../components/Header.vue'
  import { mapActions } from 'vuex';
  import { toNomalTime } from "../utils/common";

  export default {
    data() {
      return {
        userInfo: {},
        groupInfo: {
          group_name: "",
          group_notice: "",
          group_avatar: "#icongroup",
          group_creater: "",
          creater_time: "",
          update_time: ''
        },
        group_id: "",
        messageBox: {
          visible: false,
          message: "", // 弹窗内容
          messageBoxEvent: "" // 弹窗事件名称
        },
        editGroupId: this.$route.params.group_id
      }
    },
    computed: {},
    components: {
      Header
    },
    methods: {
      ...mapActions([
        "confirmCreateGroup",
        "confirmJoinGroup",
        "confirmEditGroup",
        "getGroupInformation"
      ]),
      // 创建群
      createGroup() {
        this.groupInfo.creater_time = toNomalTime((new Date()).getTime()); // 时间
        this.groupInfo.group_creater = this.userInfo.name;
        if (this.groupInfo.group_name && this.groupInfo.group_notice) {
          this.confirmCreateGroup(this.groupInfo).then((res) => {
            if (res.success) {
              this.group_id = res.data.group_id;
              const data = {
                message: "创建群成功！",
                time: this.groupInfo.creater_time,
                group_name: this.groupInfo.group_name,
                group_avatar: this.groupInfo.group_avatar,
                type: "group",
                action: "push",
                id: this.group_id,
                group_id: this.group_id
              }
              this.$store.commit('updateListMutation', data)
              this.joinGroup();
            } else {
              this.$message({
                message: '服务器出错啦',
                type: "error"
              });
            }
          }).catch(err => {
            const errorMsg = err.response.error
            this.$message({
              message: errorMsg,
              type: "error"
            });
          })
        } else {
          let message;
          if (this.groupInfo.group_name.trim() === "") { message = "请输入群名" }
          if (this.this.groupInfo.group_notice.trim() === "") { message = "请输入群公告" }
          this.$message({
            message: message,
            type: "warn"
          });
        }
      },
      // 编辑群资料
      editGroup() {
        this.groupInfo.update_time = toNomalTime((new Date()).getTime()); // 时间
        if (this.groupInfo.group_name && this.groupInfo.group_notice) {
          this.groupInfo.editGroupId = this.editGroupId;
          this.confirmEditGroup(this.groupInfo).then(res => {
            if (res.success){
              this.messageBox.messageBoxEvent = 'updateGroup'
              this.messageBox.visible = true;
              this.messageBox.message = "修改群成功"
            }
          })
        } else {
          let message;
          if (this.groupInfo.group_name.trim() === "") { message = "请输入群名" }
          if (this.this.groupInfo.group_notice.trim() === "") { message = "请输入群公告" }
          this.$message({
            message: message,
            type: "warn"
          });
        }
      },
      // 把自己加进这个群中
      joinGroup() {
        this.confirmJoinGroup({
          group_id: this.group_id
        }).then((res) => {
          if (res.success) {
            this.messageBox.messageBoxEvent = 'createGroup'
            this.messageBox.visible = true;
            this.messageBox.message = "创建群成功"
          } else {
            this.$message({
              message: '服务器出错啦',
              type: "error"
            });
          }
        }).catch(err => {
          const errorMsg = err.response.error
          this.$message({
            message: errorMsg,
            type: "error"
          });
        })
      },
      confirm(value) {
        if (value === 'createGroup') {
          this.$router.push({
            path: `/message`
          });
        } else if (value === 'updateGroup'){
          this.$router.push({
            path: `/group_chat/` + this.editGroupId
          });
        }
      }
    },
    created() {
      this.userInfo = JSON.parse(localStorage.getItem("HappyChatUserInfo"));
      if (this.editGroupId) {
        this.getGroupInformation({groupId: this.editGroupId}).then(res => {
          if (res.success){
            this.groupInfo = res.data.groupInfo[0];
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
  .content {
    margin-top: 0.8rem;
  .content-box{
    text-align: center;
    padding: 0.4rem 0 0.6rem 0;
  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin: 1rem 0 0;
  }
  }
  p {
    font-size: 0.36rem;
    margin: 0 0.6rem 0.6rem;
  }
  /*在IE10+浏览器中, 使用css即可隐藏input文本输入框右侧的叉号*/
  ::-ms-reveal,
  input[type=text]::-ms-clear {
    display: none;
  }
  ::-ms-reveal,
  input::-ms-clear {
    display: none;
  }
  input {
  //  display: inline-block;
    /*去除点击出现轮廓颜色*/
    width: 100%;
    outline: none;
    border: 0.01rem solid #fff;
    padding: 0.15rem;
    -webkit-appearance: none;
    /*去除系统默认的样式，苹果手机上的阴影*/
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    /*点击高亮的颜色*/
    /*padding已在重置样式中去除，如果没有去除，记得有padding哦*/
  }
  input,
  textarea::-webkit-input-placeholder {
    /* WebKit browsers */
    font-size: 0.36rem;
    color: #999;
  }
  input,
  textarea:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-size: 0.36rem;
    color: #999;
  }
  input,
  textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-size: 0.36rem;
    color: #999;
  }
  input,
  textarea:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    font-size: 0.36rem;
    color: #999;
  }
  textarea {
    width: 100%;
    color: #999;
    /*别忘了文本域的box-sizing属性值是border-box;所有的边框和padding都是在你固定的宽高的基础上绘制*/
    /*去除点击出现轮廓颜色*/
    outline: none;
    /*如果有需要，去掉右下角的可拉伸变大小的图标和功能*/
    resize: none;
    /*padding已在重置样式中去除，如果没有去除，记得有padding哦*/
    border: 0.01rem solid #fff;
    padding: 0.15rem;
    font-size: 0.36rem;
  }
  }
  .action {
  .creat_group {
    background-color: #4290F7;
    color: #fff;
    font-size: 0.26rem;
  }
  }
  }
</style>
