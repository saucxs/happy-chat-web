 <template>
<!-- 消息 -->
<div class="wrapper">
	<Header :currentTab="currentTab"></Header>
	<ul>
    <li v-for="data in msgListGetter" @click="enterChat(data.type,data.id)">
      <a v-if="data.type === 'group'" href="">
        <!--<img v-if="data.group_avator" :src="data.group_avator" alt="" class="img">-->
        <svg class="icon img" aria-hidden="true">
          <use xlink:href="#iconniu"></use>
        </svg>
        <span class="group-unread" v-if="data.unread">{{data.unread}}</span>
      </a>
      <a v-if="data.type === 'private'" href="">
        <!--<img v-if="data.avator" :src="data.avator" alt="" class="img">-->
        <svg class="icon img" aria-hidden="true">
          <use xlink:href="#iconniu"></use>
        </svg>
        <span class="private-unread" v-if="data.unread">{{data.unread}}</span>
      </a>
      <div class="content">
        <div v-if="data.type === 'group'" class="title">{{data.group_name}}<span>{{data.time}}</span></div>
        <div v-if="data.type === 'private'" class="title">{{data.remark?data.remark: data.name}}<span>{{data.time}}</span></div>
        <div class="message">{{data.message}}</div>
      </div>
    </li>
	</ul>
	<Footer :currentTab="currentTab"></Footer>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { mapGetters, mapActions } from 'vuex';
export default {
	name: 'message',
	data() {
		return {
			currentTab: 1,
      webSocket: ''
		}
	},
	components: {
		Header,
		Footer
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
    // 获取私聊和群的消息
    getMsgBySocket() {
      socketWeb.removeAllListeners('getPrivateMsg');
      socketWeb.removeAllListeners('getGroupMsg');
      socketWeb.on('getPrivateMsg', (data) => {
        data.type = 'private';
        // console.log(data, '获取数据')
        data.name = data.remark?data.remark: data.name;
        this.$store.commit('updateListMutation', data)
      })
      socketWeb.on('getGroupMsg', (data) => {
        data.type = 'group'
        this.$store.commit('updateListMutation', data)
      })
    }

	},
	created() {
    if (this.firstLoad) {
      this.messageList()
      this.$store.commit('firstLoadMutation', false)
    }
    this.getMsgBySocket();
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
    padding-top: 0.8rem;
    background-color: #fff;
    z-index: 1;
    ul {
        background-color: #fff;
        padding-bottom: 1vh;
        li {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            align-items: center;
            margin: 0 0.2rem;
            list-style-type: none;
            a {
                position: relative;
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
                    background-color: #98d1f2;
                }
                //  ::after {
                //   content: "";
                //   width: 0.26rem;
                //   height: 0.26rem;
                //   display: inline-block;
                //   border-radius: 50%;
                //   background-color: red;
                //   position: absolute;
                //   left: -0.08rem;
                //   z-index: -1;
                // }
            }
            .content {
                display: inline-block;
                margin-left: 0.2rem;
                max-width: 80%;
                .title {
                    font-size: 0.32rem;
                    span {
                        font-size: 0.2rem;
                        color: #676767;
                        position: absolute;
                        right: 0.5rem;
                    }
                }
                .message {
                    color: #676767;
                    font-size: 0.24rem;
                    max-height: 0.72rem;
                    overflow: hidden;
                    position: relative;
                }
                .message :after {
                    content: "...";
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
            }
        }
    }
}
</style>
