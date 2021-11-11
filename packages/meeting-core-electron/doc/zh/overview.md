# Dxz Meeting Electron SDK API Reference

Dxz Meeting Electron SDK是为 Electron 平台用户提供视频会议服务的开源 SDK。通过大学长开放平台自研RTC，RTM系统,为客户提供质量可靠的视频会议服务。

+ [meetingClient](#meetingclient) 
+ [meetingRoom](#meetingroom)

## 类方法

| 方法               | 描述                  |
| ----------------- | -------------------- |
| createMeeting     | 创建meetingClient实例 |
| createMeetingRoom | 创建meetingRoom实例   |

## meetingClient类

### 用户管理

| 方法            | 描述                          |
| -------------- | ----------------------------- |
| signUp         | 使用用户名和密码注册meeting客户端 |
| login          | 使用用户名和密码登录meeting客户端 |
| changePassword | 变更登录密码                    |
| getUserInfo    | 获取用户详细信息                 |
| updateUserInfo | 更改用户信息                    |
| updateUserInfo | 更改用户信息                    |

### 会议管理

| 方法             | 描述        |
| --------------- | ---------- |
| createMeeting   | 创建会议    |
| deleteMeeting   | 删除单个会议 |
| deleteMeetings  | 删除多个会议 |
| getMeetingInfo  | 获取会议信息 |
| getMeetingsList | 获取会议列表 |

## meetingRoom类

### 房间管理

| 方法           | 描述          |
| ------------- | ------------ |
| init          | 初始化会议房间 |
| join          | 加入会议房间   |
| leave         | 离开会议房间   |
| stopMeeting   | 结束会议      |
| setSystemInfo | 设置用户信息   |

### 房间用户管理

| 方法            | 描述                |
| -------------- | ------------------ |
| getUsers       | 获取在线的全部用户信息 |
| findUser       | 根据用户id查找用户    |
| kickOut        | 将用户踢出会议房间    |
| changeUserRole | 更改用户角色         |
| changeUserName | 更改用户名称         |
| changeUserName | 更改用户名称         |

### 会议音视频管理

| 方法             | 描述        |
| --------------- | ------------------ |
| createRTCClient | 创建音视频控制实例    |
| changeVideo     | 更改用户视频状态      |
| switchVideo     | 切换用户视频状态      |
| changeAudio     | 更改用户音频状态      |
| switchAudio     | 切换用户音频状态      |
| muteRoomAudio   | 将房间设置为静音状态   |
| unmuteRoomAudio | 将房间设置为非静音状态 |
| switchRoomAudio | 切换房间静音状态      |

### 音视频测试管理

| 方法                 | 描述            |
| --------------- | --------------- |
| createRTCTester | 创建音视频控制实例 |

### 工具管理

| 方法                  | 描述        |
| -------------------- | ---------- |
| createShareTool      | 创建共享工具 |
| createChatTool       | 创建聊天工具 |
| createHandTool       | 创建举手工具 |
| createWhiteboardTool | 创建白板工具 |

### 共享管理

| 方法                   | 描述                   |
| --------------------- | ---------------------- |
| getScreenWindowsInfo  | 获取当前可以共享的窗口信息 |
| getScreenDisplaysInfo | 获取当前可以共享的桌面信息 |
| startShareWhiteboard  | 开始共享白板             |
| startShareDesktop     | 开始共享桌面             |
| startShareApplication | 开始共享应用窗口          |
| stopShare             | 结束共享                |

### 投票管理

| 方法                | 描述              |
| ------------------ | ---------------- |
| createPoll         | 创建投票          |
| deletePoll         | 删除投票          |
| updatePoll         | 更改投票          |
| startPoll          | 开始投票          |
| stopPoll           | 结束投票          |
| commitPollAnswer   | 提交投票结果      |
| getMyPollAnswer    | 获取我的投票结果   |
| getPollResult      | 获取投票的全部结果 |
| getPollDetail      | 获取投票详情      |
| getPolls           | 获取全部投票的详情 |
| startSharePoll     | 开始分享通票结果   |
| stopSharePoll      | 停止分享通票结果   |

### 分组管理

| 方法                                 | 描述               |
| ----------------------------------- | ------------------ |
| startBreakoutGroups                 | 开始分组            |
| stopBreakoutGroups                  | 结束分组            |
| callHostToBreakoutGroup             | 在分组内呼叫主持人    |
| getBreakoutGroupsDetail             | 获取分组详情         |
| moveUserToOtherBreakoutGroup        | 移动用户去其他分组    |
| requestMoveUsersToBreakoutGroup     | 请求移动用户去其他分组 |
| broadcastMessageToAllBreakoutGroups | 发送消息去所有分组    |


### 实时消息管理

| 方法             | 描述                |
| --------------- | ------------------ |
| sendCustomEvent | 在房间内广播自定义信令 |

### 聊天管理

需要首先调用createChatTool函数创建聊天管理模块实例，然后通过该实例进行调用

| 方法               | 描述                   |
| ----------------- | ---------------------- |
| sendMessage       | 发送广播或者点对点聊天消息 |
| sendSystemMessage | 发送系统广播消息         |

### 事件 (MeetingCoreEvents)

通过房间实例上的on方法去监听消息

#### 房间事件 (MeetingCoreEvents.Room)

| 消息                             | 描述                           |
| ------------------------------- | ------------------------------ |
| LOCAL_USER_JOIN_SUCCESS         | 提示本地用户加入成功              |
| LOCAL_USER_JOIN_FAIL            | 提示本地用户加入失败              |
| INIT_COMPLETE                   | 提示系统初始化完成                |
| INIT_FAIL                       | 提示系统初始化失败                |
| SYNC_ROOM_ATTR_COMPLETE         | 提示同步房间信息完成              |
| SYNC_USER_INFO_COMPLETE         | 提示同步用户信息完成              |
| ROOM_START                      | 提示会议开始                     |
| ROOM_STOP                       | 提示会议结束                     |
| MEMBER_ONLINE                   | 提示用户上线但还没有完成用户信息设置 |
| MEMBER_OFFLINE                  | 提示用户离线                     |
| USER_ATTR_INIT                  | 提示用户上线并且已经完成用户信息设置 |
| CONTROL_CUSTOM_SIGNAL           | 提示接受到自定义事件               |
| CHANGE_AUDIO_REQUEST            | 提示请求更改音频状态               |
| CHANGE_VIDEO_REQUEST            | 提示请求更改视频状态               |
| CHANGE_NAME_REQUEST             | 提示请求更改用户显示名             |
| CHANGE_ROLE_REQUEST             | 提示请求更改用户角色               |
| BREAKOUT_GROUPS_START           | 提示分组开始                     |
| BREAKOUT_GROUPS_STOP            | 提示分组结束                     |
| BREAKOUT_CALL_HOST              | 分组时，提示有分组正在呼叫主持人    |
| BREAKOUT_BROADCAST_MESSAGE      | 分组时，提示收到分组广播消息       |
| BREAKOUT_MOVE_USER_TO_GROUP_REQ | 分组时，提示请求移动用户到其他分组  |
| AUDIO_MUTE_ALL                  | 提示房间被静音                   |
| AUDIO_UNMUTE_ALL                | 提示房间静音解除                 |
| ROOM_ATTR_UPDATE                | 提示房间属性更新                 |
| NAME_CHANGE                     | 提示用户显示名改变               |
| ROLE_CHANGE                     | 提示用户角色改变                 |
| AVATAR_CHANGE                   | 提示用户头像改变                 |
| VIDEO_CHANGE                    | 提示用户视频状态改变             |
| AUDIO_CHANGE                    | 提示用户音频状态改变             |
| HAND_CHANGE                     | 提示用户举手状态改变             |
| SHARE_CHANGE                    | 提示用户共享状态改变             |
| GROUP_ID_CHANGE                 | 提示用户分组状态改变             |
| USER_KICK_OUT                   | 提示用户被踢出房间               |
| REMOTE_LOGIN                    | 提示用户账号被远程登录            |
| SERVER_CONNECT_FAIL             | 提示链接服务器失败               |
| SERVER_CONNECTED                | 提示服务器已连接                 |
| CHAT_ROOM_MESSAGE               | 提示接收到聊天广播消息            |
| CHAT_PEER_MESSAGE               | 提示接收到聊天点对点消息          |
| CHAT_SYSTEM_ROOM_MESSAGE        | 提示接收到系统广播消息            |
| CHAT_SYSTEM_PEER_MESSAGE        | 提示接收到系统点对点消息          |
