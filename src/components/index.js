import MessageBox from './MessageBox/index'
import Message from './Message/index'

const install = function (Vue) {
  Vue.component(Message.name, Message)
  Vue.component(MessageBox.name, MessageBox);

  Vue.prototype.$message = Message.installMessage;
}

export default install
