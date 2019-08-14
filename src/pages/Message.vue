 <template>
<!-- 消息 -->
<div class="wrapper">
	<Header :currentTab="currentTab"></Header>
  <div class="chat-wrapper-spe">
    <div class="secret-box-spe" v-if="msgListGetter.length > 0">
      <ul v-scroll = "onScroll">
        <li v-for="data in msgListGetter">
          <div class="list-box" @click="enterChat(data.type,data.id)">
            <a v-if="data.type === 'group'" href="">
              <!--<img v-if="data.group_avatar" :src="data.group_avatar" alt="" class="img">-->
              <svg class="icon img" aria-hidden="true">
                <use xlink:href="#iconniu"></use>
              </svg>
              <span class="group-unread" v-if="data.unread">{{data.unread}}</span>
            </a>
            <a v-if="data.type === 'private'" href="">
              <!--<img v-if="data.avatar" :src="data.avatar" alt="" class="img">-->
              <svg class="icon img" aria-hidden="true">
                <use xlink:href="#iconniu"></use>
              </svg>
              <span class="private-unread" v-if="data.unread">{{data.unread}}</span>
            </a>
            <div class="content">
              <div v-if="data.type === 'group'" class="title">{{data.group_name}}<span>{{data.time}}</span></div>
              <div v-if="data.type === 'private'" class="title">{{data.remark?data.remark: data.name}}<span>{{data.time}}</span></div>
              <div class="message" v-if="data.message">{{data.message | dotdot(32) }}</div>
              <div class="message message-no" v-else>暂无消息~</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <Nothing v-else :name="'加好友'" :type="'addAuthor'"></Nothing>
  </div>
	<Footer :currentTab="currentTab"></Footer>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Nothing from '../components/Nothing.vue'
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'message',
	data() {
		return {
			currentTab: 1,
      webSocket: '',
      userInfo: ''
		}
	},
	components: {
		Header,
		Footer,
    Nothing
	},
	computed: {
		...mapGetters([
		  'firstLoad',
			'msgListGetter'
		])
	},
	methods: {
    ...mapActions(["messageList"]),
		enterChat(chatType, chatId) {
      const path = chatType == 'private' ? `/private_chat/${chatId}` : `/group_chat/${chatId}`
      this.$router.push(path)
		},
    //  获取私聊和群的消息
    getMsgBySocket() {
      socketWeb.removeAllListeners('getPrivateMsg');
      socketWeb.removeAllListeners('getGroupMsg');
      socketWeb.on('getPrivateMsg', (data) => {
        data.type = 'private';
        data.name = data.remark?data.remark: data.name;
        this.$store.commit('updateListMutation', data)
      })
      socketWeb.on('getGroupMsg', (data) => {
        data.type = 'group'
        this.$store.commit('updateListMutation', data)
      })
    },
    onScroll() {
      console.log('置底操作加载新数据的指令输出')
    }

	},
	created() {
    if (this.firstLoad) {
      this.$loading.show();
      this.messageList().then(res => {
        this.$loading.hide();
      })
      this.$store.commit('firstLoadMutation', false)
    }
    this.getMsgBySocket();
	}
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/chat.scss";
.wrapper {
    ul {
        background-color: #fff;
        .list-box{
          padding: 0.24rem 0.15rem;
          display: flex;
          justify-items: center;
          align-items: center;
          border-bottom: 1px solid $base-gray-color-1;
        }
        li {
          cursor: pointer;
          background-color: #fff;
          list-style-type: none;
          position: relative;
            a {
              display: inherit;
                .img {
                    width: 0.8rem;
                    height: 0.8rem;
                    margin-right: 0.04rem;
                    border-radius: 50%;
                    vertical-align: 0;
                    display: inline-block;
                }
                span {
                    font-size: 0.2rem;
                    border-radius: 50%;
                    padding: 0 0.088rem;
                    position: absolute;
                    top: 0.2rem;
                    left: 0.7rem;
                    color: #fff;
                    z-index: 2;
                }
                .private-unread {
                    background-color: red;
                }
                .group-unread {
                    background-color: red;
                }
            }
            .content {
                display: inline-block;
                margin-left: 0.2rem;
                max-width: 80%;
                width: 80%;
                .title {
                    font-size: 0.32rem;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.05rem;
                    span {
                        font-size: 0.2rem;
                        color: $gray-color-light;
                    }
                }
                .message {
                    color: #cccccc;
                    font-size: 0.24rem;
                    overflow: hidden;
                    position: relative;
                }
                .message-no {
                  color: #cccccc;
                }
            }
        }
        li:last-child{
          border-bottom: none;
        }
    }
}
</style>
