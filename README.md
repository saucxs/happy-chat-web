# [happy-chat-web](https://github.com/saucxs/happy-chat-web)
[![](https://img.shields.io/badge/Powered%20by-saucxs%20-brightgreen.svg)](https://github.com/saucxs/happy-chat-web)
[![GitHub license](https://img.shields.io/github/license/saucxs/happy-chat-web.svg)](https://github.com/saucxs/happy-chat-web/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/saucxs/happy-chat-web.svg)](https://github.com/saucxs/happy-chat-web/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/saucxs/happy-chat-web.svg)](https://github.com/saucxs/happy-chat-web/network)
[![GitHub issues](https://img.shields.io/github/issues/saucxs/happy-chat-web.svg)](https://github.com/saucxs/happy-chat-web/issues)

乐聊，一个快乐聊天的应用，支持pc端和无线端。技术栈：vue+vuex+koa+websocketIO+mysql+redis。线上地址：https://chat.chengxinsong.cn

## 1、功能
+ 版本v 1.0.0
    - [x] 1、支持注册用户和邮件激活用户；
    - [x] 2、支持登陆
    - [x] 3、支持机器人聊天；
    - [x] 4、支持加好友，一对一聊天；
    - [x] 5、支持创建群，加群，一对多聊天；
    - [x] 6、支持删除好友，退出群
    - [x] 7、支持个人信息编辑
    - [x] 8、支持添加好友备注
    - [x] 9、支持聊天中文字发送
    - [x] 10、支持浏览器：Chrome，Firefox，Safari，IE9及以上； 

+ 版本v 1.1.0
    - [x] 1、支持聊天中表情发送
    - [x] 2、支持聊天内容分页获取，滚动条保持在分页时候的地方
    - [ ] 3、支持聊天中图片发送
    
+ 版本v 1.1.1
    - [x] 1、支持https和http2.0，前端路由模式history
    
+ 版本v 1.1.2
    - [x] 1、数据埋点，页面PV相关数据统计
    - [x] 2、登陆日志统计
    
+ 版本v 1.1.3
    - [x] 1、留言反馈模块
    - [x] 2、支持用户名登陆修改密码
    
## 2、线上地址

https://chat.chengxinsong.cn
    
## 3、源码使用
```js
git clone https:// github.com/saucxs/happy-chat-web.git

cd happy-chat-web

npm i

npm run dev 
```

## 4、截图

聊天

![chat](./images/chat.png)


机器人

![robot](./images/robot.png)

消息列表

![message](./images/message.png)

通讯录

![contact](./images/contact.png)

个人信息

![personal](./images/personal.png)

等等

## 5、源码地址
项目采用前后端分离，暂时没有给出数据库，有需求可以联系我。
+ 前端代码：https://github.com/saucxs/happy-chat-web
+ 后端代码：https://github.com/saucxs/happy-chat-node

## 6、相应文章
+ [happyChat开发系列：使用websocket.io实现双向通信的乐聊大前端开发](http://www.chengxinsong.cn/post/40)
+ [【nginx系列】nginx升级到支持HTTP2.0](https://www.mwcxs.top/page/784.html)

## 7、最后

欢迎fork和star，有问题提issue
