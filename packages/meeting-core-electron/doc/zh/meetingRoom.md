# meetingRoom

## Index
### Constructors

* [Constructors](#constructor)

### Properties

* [user](#user)
* [users](#users)
* [userId](#userid)
* [remoteUsers](#remoteusers)
* [roomAudio](#roomaudio)
* [enableAudioChange](#enableaudiochange)
* [pollInfo](#pollinfo)
* [breakoutGroupsInfo](#breakoutgroupsinfo)
* [chatClient](#chatclient)
* [shareClient](#shareclient)
* [screenShareId](#screenshareid)

### Methods

* [init](#init)
* [join](#join)
* [leave](#leave)
* [kickOut](#kickout)
* [on](#on)
* [createShareTool](#createsharetool)
* [createChatTool](#createchattool)
* [createHandTool](#createhandtool)
* [createWhiteboardTool](#createwhiteboardtool)
* [createRTCClient](#creatertcclient)
* [createRTCTester](#creatertctester)
* [getUsers](#getusers)
* [findUser](#finduser)
* [changeVideo](#changevideo)
* [switchVideo](#switchvideo)
* [changeAudio](#changeaudio)
* [switchAudio](#switchaudio)
* [muteRoomAudio](#muteroomaudio)
* [unmuteRoomAudio](#unmuteroomaudio)
* [switchRoomAudio](#switchroomaudio)
* [changeUserRole](#changeuserrole)
* [changeUserName](#changeusername)
* [getScreenWindowsInfo](#getscreenwindowsinfo)
* [getScreenDisplaysInfo](#getscreendisplaysinfo)
* [startShareWhiteboard](#startsharewhiteboard)
* [startShareDesktop](#startsharedesktop)
* [startShareApplication](#startshareapplication)
* [stopShare](#stopshare)
* [setSystemInfo](#setsysteminfo)
* [stopMeeting](#stopmeeting)
* [sendCustomEvent](#sendcustomevent)
* [createPoll](#createpoll)
* [deletePoll](#deletepoll)
* [updatePoll](#updatepoll)
* [startPoll](#startpoll)
* [stopPoll](#stoppoll)
* [commitPollAnswer](#commitpollanswer)
* [getMyPollAnswer](#getmypollanswer)
* [getPollResult](#getpollresult)
* [getPollDetail](#getpolldetail)
* [getPolls](#getpolls)
* [startSharePoll](#startsharepoll)
* [stopSharePoll](#stopsharepoll)
* [startBreakoutGroups](#startbreakoutgroups)
* [stopBreakoutGroups](#stopbreakoutgroups)
* [moveUserToOtherBreakoutGroup](#moveusertootherbreakoutgroup)
* [requestMoveUsersToBreakoutGroup](#requestmoveuserstobreakoutgroup)
* [broadcastMessageToAllBreakoutGroups](#broadcastmessagetoallbreakoutgroups)
* [callHostToBreakoutGroup](#callhosttobreakoutgroup)
* [getBreakoutGroupsDetail](#getbreakoutgroupsdetail)

## Constructors

### constructor

```
new meetingClient:meetingClient
    return meetingClient
```

## Properties

### user
```javascript
user: object
```
### users
```javascript
users: Array(user)
```

### userId
```javascript
userId: Number
```

### remoteUsers
```javascript
remoteUsers: Array(user)
```

### roomAudio
```javascript
roomAudio: Boolean
```

### enableAudioChange
```javascript
enableAudioChange: Boolean
```

### pollInfo
````javascript
pollInfo: Object
````

### breakoutGroupsInfo
```javascript
breakoutGroupsInfo: Object
```

### chatClient
```javascript
chatClient: Object
```

### shareClient
```javascript
shareClient: Object
```

### screenShareId
```javascript
screenShareId: Number
```

## Methods

### init

```
init(props: Object): void
```
初始化会议房间

**Parameters**
* props: Object 
  * authToken: String  
    api调用所使用的token
  * refreshToken: String   
    token过期时用于获取新的token
  * meetingId: Number   
    会议ID
  * userId: Number   
    用户ID
  * apiBaseURL: string   
    后端服务器地址
  * initUserInfo: Object  
    初始化所使用到的用户信息

**Return**  
None

### join
```
async join(password: String|null): Promise
```
加入会议房间

**Parameters**
* password: String  
  （可选参数）会议密码

**Return**  
异步函数，返回Promise对象

### leave
```
leave(): void
```
离开会议房间

**Parameters**
None

**Return**  
None

### kickOut
```
async kickOut(userId): Promise
```
将用户提出房间

**Parameters**
* userId: Number  
  用户ID

**Return**  
异步函数，返回Promise对象

### on
```
on(event: String, callback: Function): Promise
```
监听会议房间内的事件

**Parameters**
* event: String 
  事件
* callback: Function  
  处理事件的回调函数

**Return**  
异步函数，返回Promise对象

### createShareTool
```
createShareTool(): ShareTool
```
创建共享功能所使用的实例对象

**Parameters**
None

**Return**  
返回ShareTool实例对象

### createChatTool
```
createChatTool(): ChatTool 
```
创建聊天功能所使用的实例对象

**Parameters**
None

**Return**  
返回ChatTool实例对象

### createHandTool
```
createHandTool(): HandTool 
```
创建举手功能所使用的实例对象

**Parameters**
None

**Return**  
返回HandTool实例对象

### createWhiteboardTool
```
async createWhiteboardTool(domId: String, color: String|hex|null): Promise(WhiteboardTool)
```
创建白板功能所使用的实例对象

**Parameters**
* domId: String  
  作为白板容器的HTML dom节点的ID
* color: String|hex|null  
  白板出示画笔的颜色，支持RGB格式和hex格式。如果不填写，则会随机一个颜色值

**Return**  
在Promise对象内返回WhiteboardTool实例

### createRTCClient
```
createRTCClient(opts: Object): RTCClient
```
创建音视频管理所使用的RTCClient实例

**Parameters**
* opts: Object
  * audio: Boolean   
    初始音频状态
  * video: Boolean  
    初始视频状态
  

**Return**  
返回RTCClient实例

### createRTCTester
```
createRTCTester(): RTCTester
```
创建音视频测试所使用的RTCTester实例

**Parameters**
None

**Return**  
返回RTCTester实例

### getUsers
```
getUsers(): Array(User)
```
返回当前房间内所有用户信息

**Parameters**
None

**Return**  
返回房间内用户信息列表

### findUser
```
findUser(userId: Number): User
```
根据用户ID查找该用户的详细信息

**Parameters**
* userId: Number   
  用户ID

**Return**  
返回用户信息

### changeVideo
```
changeVideo(state: Boolean, userId: Number|null): Promise
```
变更指定用户的视频状态

**Parameters**
* state: Boolean   
  视频状态
* userId: Number   
  (可选参数)用户ID, 如果不指定该参数，则改变本地登录用户的视频状态

**Return**  
返回Promise指示改变是否成功

### switchVideo
```
switchVideo(state: Boolean): Promise
```
切换本地登录用户的视频状态

**Parameters**
* state: Boolean   
  视频状态

**Return**  
返回Promise指示切换是否成功

### changeAudio
```
changeAudio(state: Boolean, userId: Number|null): Promise
```
变更指定用户的音频状态

**Parameters**
* state: Boolean   
  音频状态
* userId: Number   
  (可选参数)用户ID, 如果不指定该参数，则改变本地登录用户的视频状态

**Return**  
返回Promise指示改变是否成功

### switchAudio
```
switchAudio(state: Boolean): Promise
```
切换本地登录用户的音频状态

**Parameters**
* state: Boolean   
  音频状态

**Return**  
返回Promise指示切换是否成功

### muteRoomAudio
```
muteRoomAudio(enableAudioChange: Boolean): Promise
```
将房间设置为静音状态

**Parameters**
* enableAudioChange: Boolean   
  是否允许其他会议参入人调整音频状态

**Return**  
返回Promise指示房间静音操作是否成功

### unmuteRoomAudio
```
unmuteRoomAudio(): Promise
```
解除房间静音状态

**Parameters**
None

**Return**  
返回Promise指示房间解除静音操作是否成功

### switchRoomAudio
```
switchRoomAudio(enableAudioChange: Boolean): Promise
```
切换房间静音状态

**Parameters**
* enableAudioChange: Boolean   
  是否允许其他会议参入人调整音频状态

**Return**  
返回Promise指示房间静音切换是否成功

### changeUserRole
```
changeUserRole(role: String, userId: Number|null): Promise
```
更改指定用户的角色信息

**Parameters**
* role: String   
  用户角色，当前可选 host | co-host | attendee
* userId: Number|null   
  （可选参数）用户ID，如果未指定，则更改本地登录用户的角色信息

**Return**  
返回Promise指示用户角色信息修改是否成功

### changeUserName
```
changeUserName(name: String, userId: Number|null): Promise
```
更改指定用户的显示名

**Parameters**
* name: String   
  用户显示名
* userId: Number|null   
  （可选参数）用户ID，如果未指定，则更改本地登录用户的角色信息

**Return**  
返回Promise指示用户显示名修改是否成功

### getScreenWindowsInfo
```
getScreenWindowsInfo(): Array
```
获取当前可以共享的应用窗口实例列表

**Parameters**
None

**Return**  
返回应用窗口实例列表

### getScreenDisplaysInfo
```
getScreenDisplaysInfo(): Array
```
获取当前可以共享的桌面实例列表

**Parameters**
None

**Return**  
返回桌面实例列表

### startShareWhiteboard
```
startShareWhiteboard(): Promise
```
开始共享白板

**Parameters**
None

**Return**  
返回Promise指示开始共享白板操作是否成功

### startShareDesktop
```
startShareDesktop(): Promise
```
开始共享桌面

**Parameters**
None

**Return**  
返回Promise指示开始共享桌面操作是否成功

### startShareApplication
```
startShareApplication(): Promise
```
开始共享应用窗口

**Parameters**
None

**Return**  
返回Promise指示开始共享应用窗口操作是否成功

### stopShare
```
stopShare(): Promise
```
停止共享

**Parameters**
None

**Return**  
返回Promise指示停止共享操作是否成功

### setSystemInfo
```
setSystemInfo(info: Object): void
```
设置当前系统信息

**Parameters**
* info: Object  
  * device: String  
    设备名, 一般填写PC
  * os: String  
    系统名称
  * language: String  
    系统语言
  * osVersion: String  
    系统语言
  * cpu: String  
    CPU信息

**Return**  
None

### stopMeeting
```
stopMeeting(): Promise
```
结束会议, 远端会触发ROOM_STOP事件

**Parameters**
None

**Return**  
返回Promise对象指示结束会议操作是否成功

### sendCustomEvent
```
sendCustomEvent(type: String, opts: Object, uid: Number|null): void
```
发送自定义事件, 远端会触发CONTROL_CUSTOM_SIGNAL事件

**Parameters**
None

**Return**  
None

### createPoll
```
createPoll(title: String, questions: Array, isAnonymous: Boolean): Promise
```
创建投票

**Parameters**
* title: String  
  投票名称
* questions: Array(question)  
  投票中的问题列表
  * question: Object
    * content: String  
      问题的内容
    * isSingle: Boolean  
      问题是单选还是多选
    * options: Array  
      答案选项列表
      * content: String  
        答案选项内容
* isAnonymous: Boolean  
  是否是匿名投票，默认是false

**Return**  
返回Promise对象指示创建投票是否成功

### deletePoll
```
deletePoll(pollId: String): Promise
```
删除指定投票

**Parameters**
* pollId: Number  
  投票ID

**Return**  
返回Promise对象指示删除投票是否成功

### updatePoll
```
updatePoll(pollId: Number, title: String, questions: Array, isAnonymous: Boolean): Promise
```
更新指定投票

**Parameters**
* pollId: Number  
  投票ID
* title: String  
  投票名称
* questions: Array(question)  
  投票中的问题列表
  * question: Object
    * content: String  
      问题的内容
    * isSingle: Boolean  
      问题是单选还是多选
    * options: Array(question)
      question
      * content: String  
        答案选项内容
* isAnonymous: Boolean  
  是否是匿名投票，默认是false

**Return**  
返回Promise对象指示更新投票是否成功

### startPoll
```
startPoll(pollId: String): Promise
```
开始指定投票

**Parameters**
* pollId: Number  
  投票ID

**Return**  
返回Promise对象指示开始投票是否成功

### stopPoll
```
stopPoll(pollId: String): Promise
```
结束指定投票

**Parameters**
* pollId: Number  
  投票ID

**Return**  
返回Promise对象指示结束投票是否成功

### commitPollAnswer
```
commitPollAnswer(pollId: String, questions: Array): Promise
```
提交投票结果

**Parameters**
* pollId: Number  
  投票ID
* questions: Array(question)
  question: Object
    * id: Number
    * options: Array(String)  
      答案列表

**Return**  
返回Promise对象指示提交投票结果是否成功

### getMyPollAnswer
```
getMyPollAnswer(pollId: String): Promise
```
获取当前用户指定投票的投票结果

**Parameters**
* pollId: Number  
  投票ID

**Return**  
返回Promise对象指示获取投票结果是否成功并返回投票结果

### getPollResult
```
getPollResult(pollId: String): Promise
```
获取指定投票的全部投票结果

**Parameters**
* pollId: Number  
  投票ID

**Return**  
返回Promise对象指示获取投票结果是否成功并返回投票结果

### getPollDetail
```
getPollDetail(pollId: String): Promise
```
获取指定投票详细信息

**Parameters**
* pollId: Number  
  投票ID

**Return**  
返回Promise对象指示获取投票详细是否成功并返回投票详情

### getPolls
```
getPolls(): Promise
```
获取全部投票列表

**Parameters**
None

**Return**  
返回Promise对象指示获取投票详细列表是否成功并返回投票详情列表

### startSharePoll
```
startSharePoll(pollId: String): Promise
```
开始分享指定投票的投票结果

**Parameters**
* pollId: Number  
  投票ID

**Return**  
返回Promise对象指示开始分享投票结果是否成功

### stopSharePoll
```
stopSharePoll(pollId: String): Promise
```
结束分享指定投票的投票结果

**Parameters**
* pollId: Number  
  投票ID

**Return**  
返回Promise对象指示结束分享投票结果是否成功

### startBreakoutGroups
```
startBreakoutGroups(groups: Array): Promise
```
开始分组

**Parameters**
* groups: Object 
  * id: Number  
    分组的ID
  * name: String  
    分组名称
  * users: Array(Number)  
    用户ID列表

**Return**  
返回Promise对象指示开始分组是否成功

### stopBreakoutGroups
```
stopBreakoutGroups(): Promise
```
结束分组

**Parameters**
None

**Return**  
返回Promise对象指示结束组是否成功

### moveUserToOtherBreakoutGroup
```
moveUserToOtherBreakoutGroup(toGroupId: Number, uid: Number|:null): Promise
```
移动用户到指定分组

**Parameters**
* toGroupId: Number   
  目标分组ID
* uid: Number|null  
  (可选参数)要想移动用户的ID，如果未指定则移动当前本地用户

**Return**  
返回Promise对象指示移动用户到指定分组是否成功

### requestMoveUsersToBreakoutGroup
```
requestMoveUsersToBreakoutGroup(toGroupId: Number, userIds: Array(Number)): Promise
```
移动一组用户到指定分组

**Parameters**
* toGroupId: Number   
  目标分组ID
* userIds: Array(Number)  
  移动用户ID列表

**Return**  
返回Promise对象指示移动用户到指定分组是否成功

### broadcastMessageToAllBreakoutGroups
```
broadcastMessageToAllBreakoutGroups(message: String, groupId: Number|null): void 
```
向分组发送消息

**Parameters**
* message: String 
  消息字符串
* groupId: Number   
  (可选参数)目标分组ID, 如果不指定该参数，则发送消息到所有分组。默认不指定

**Return**  
None

### callHostToBreakoutGroup
```
callHostToBreakoutGroup(groupId: Number): void 
```
在分组内呼叫主持人

**Parameters**
* groupId: Number   
  目标分组ID

**Return**  
None

### getBreakoutGroupsDetail
```
getBreakoutGroupsDetail(): Promise 
```
获取分组详细信息

**Parameters**
None

**Return**  
返回Promise对象指示获取分组详细信息是否成功并返回分组详细信息
