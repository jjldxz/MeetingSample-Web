# MeetingCoreEvents.Room

通过meetingRoom实例上的on方法去监听MeetingCoreEvents.Room里的所有事件

## Events
* [LOCAL_USER_JOIN_SUCCESS](#local_user_join_success)
* [LOCAL_USER_JOIN_FAIL](#local_user_join_fail)
* [INIT_COMPLETE](#init_complete)
* [INIT_FAIL](#init_complete)
* [SYNC_ROOM_ATTR_COMPLETE](#sync_room_attr_complete)
* [SYNC_USER_INFO_COMPLETE](#sync_user_info_complete)
* [ROOM_START](#room_start)
* [ROOM_STOP](#room_stop)
* [MEMBER_ONLINE](#member_online)
* [MEMBER_OFFLINE](#member_offline)
* [USER_ATTR_INIT](#user_attr_init)
* [CONTROL_CUSTOM_SIGNAL](#control_custom_signal)
* [CHANGE_AUDIO_REQUEST](#change_audio_request)
* [CHANGE_VIDEO_REQUEST](#change_video_request)
* [CHANGE_NAME_REQUEST](#change_name_request)
* [CHANGE_ROLE_REQUEST](#change_role_request)
* [BREAKOUT_GROUPS_START](#breakout_groups_start)
* [BREAKOUT_GROUPS_STOP](#breakout_groups_stop)
* [BREAKOUT_CALL_HOST](#breakout_call_host)
* [BREAKOUT_BROADCAST_MESSAGE](#breakout_broadcast_message)
* [BREAKOUT_MOVE_USER_TO_GROUP_REQ](#breakout_move_user_to_group_req)
* [AUDIO_MUTE_ALL](#audio_mute_all)
* [AUDIO_UNMUTE_ALL](#audio_unmute_all)
* [ROOM_ATTR_UPDATE](#room_attr_update)
* [NAME_CHANGE](#name_change)
* [ROLE_CHANGE](#role_change)
* [AVATAR_CHANGE](#avatar_change)
* [VIDEO_CHANGE](#video_change)
* [AUDIO_CHANGE](#audio_change)
* [HAND_CHANGE](#hand_change)
* [SHARE_CHANGE](#share_change)
* [GROUP_ID_CHANGE](#group_id_change)
* [USER_KICK_OUT](#user_kick_out)
* [REMOTE_LOGIN](#remote_login)
* [SERVER_CONNECT_FAIL](#server_connect_fail)
* [SERVER_CONNECTED](#server_connected)
* [CHAT_ROOM_MESSAGE](#chat_room_message)
* [CHAT_PEER_MESSAGE](#chat_peer_message)
* [CHAT_SYSTEM_ROOM_MESSAGE](#chat_system_room_message)
* [CHAT_SYSTEM_PEER_MESSAGE](#chat_system_peer_message)

## Listeners

### LOCAL_USER_JOIN_SUCCESS
```
on(MeetingCoreEvents.Room.LOCAL_USER_JOIN_SUCCESS, cb: Function)
```
提示本地用户加入成功

**Parameters**
* **evt**: MeetingCoreEvents.Room.LOCAL_USER_JOIN_SUCCESS
* **cb**: function
  * (roomId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    
    **Returns**: void

**Returns**: this

### LOCAL_USER_JOIN_FAIL
```
on(MeetingCoreEvents.Room.LOCAL_USER_JOIN_FAIL, cb: Function)
```
提示本地用户加入失败

**Parameters**
* **evt**: MeetingCoreEvents.Room.LOCAL_USER_JOIN_FAIL
* **cb**: function
  * (roomId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID

    **Returns**: void

**Returns**: this

### INIT_COMPLETE
```
on(MeetingCoreEvents.Room.INIT_COMPLETE, cb: Function)
```
提示系统初始化完成

**Parameters**
* **evt**: MeetingCoreEvents.Room.INIT_COMPLETE
* **cb**: function
  * (roomId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    
    **Returns**: void

**Returns**: this

### INIT_FAIL
```
on(MeetingCoreEvents.Room.INIT_FAIL, cb: Function)
```
提示系统初始化完成

**Parameters**
* **evt**: MeetingCoreEvents.Room.INIT_FAIL
* **cb**: function
  * (roomId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID

    **Returns**: void

**Returns**: this

### SYNC_ROOM_ATTR_COMPLETE
```
on(MeetingCoreEvents.Room.SYNC_ROOM_ATTR_COMPLETE, cb: Function)
```
提示同步房间信息完成

**Parameters**
* **evt**: MeetingCoreEvents.Room.SYNC_ROOM_ATTR_COMPLETE
* **cb**: function
  * (roomId: Number, roomAttrs: Array): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **roomAttrs**: Array  
      属性列表

    **Returns**: void

**Returns**: this

### SYNC_USER_INFO_COMPLETE
```
on(MeetingCoreEvents.Room.SYNC_USER_INFO_COMPLETE, cb: Function)
```
提示同步用户信息完成

**Parameters**
* **evt**: MeetingCoreEvents.Room.SYNC_USER_INFO_COMPLETE
* **cb**: function
  * (roomId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID

    **Returns**: void

**Returns**: this

### ROOM_START
```
on(MeetingCoreEvents.Room.ROOM_START, cb: Function)
```
提示会议开始

**Parameters**
* **evt**: MeetingCoreEvents.Room.ROOM_START
* **cb**: function
  * (roomId: Number, senderId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **senderId**: Number  
      发送者ID

    **Returns**: void

**Returns**: this

### ROOM_STOP
```
on(MeetingCoreEvents.Room.ROOM_STOP, cb: Function)
```
提示会议结束

**Parameters**
* **evt**: MeetingCoreEvents.Room.ROOM_STOP
* **cb**: function
  * (roomId: Number, senderId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **senderId**: Number  
      发送者ID

    **Returns**: void

**Returns**: this

### MEMBER_ONLINE
```
on(MeetingCoreEvents.Room.MEMBER_ONLINE, cb: Function)
```
提示用户上线但还没有完成用户信息设置

**Parameters**
* **evt**: MeetingCoreEvents.Room.MEMBER_ONLINE
* **cb**: function
  * (roomId: Number, userId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **userId**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### MEMBER_OFFLINE
```
on(MeetingCoreEvents.Room.MEMBER_OFFLINE, cb: Function)
```
提示用户离线

**Parameters**
* **evt**: MeetingCoreEvents.Room.MEMBER_OFFLINE
* **cb**: function
  * (roomId: Number, userId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **userId**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### USER_ATTR_INIT
```
on(MeetingCoreEvents.Room.USER_ATTR_INIT, cb: Function)
```
提示用户上线并且已经完成用户信息设置

**Parameters**
* **evt**: MeetingCoreEvents.Room.USER_ATTR_INIT
* **cb**: function
  * (roomId: Number, user: User): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **user**: User  
      上线用户信息

    **Returns**: void

**Returns**: this

### CONTROL_CUSTOM_SIGNAL
```
on(MeetingCoreEvents.Room.CONTROL_CUSTOM_SIGNAL, cb: Function)
```
提示接受到自定义事件

**Parameters**
* **evt**: MeetingCoreEvents.Room.CONTROL_CUSTOM_SIGNAL
* **cb**: function
  * (event: String, data: Object, userId: Number): void  
    **Parameters**
    * **event**: String  
      自定义事件
    * **data**: Object 
      自定义事件的携带的参数
    * **userId**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### CHANGE_AUDIO_REQUEST
```
on(MeetingCoreEvents.Room.CHANGE_AUDIO_REQUEST, cb: Function)
```
提示请求更改指定用户音频状态

**Parameters**
* **evt**: MeetingCoreEvents.Room.CHANGE_AUDIO_REQUEST
* **cb**: function
  * (roomId: Number, receiverId: Number, state: Boolean): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **receiverId**: Number
      接收者ID
    * **state**: Boolean  
      音频状态，打开/关闭

    **Returns**: void

**Returns**: this

### CHANGE_VIDEO_REQUEST
```
on(MeetingCoreEvents.Room.CHANGE_VIDEO_REQUEST, cb: Function)
```
提示请求更改指定用户视频状态

**Parameters**
* **evt**: MeetingCoreEvents.Room.CHANGE_VIDEO_REQUEST
* **cb**: function
  * (roomId: Number, receiverId: Number, state: Boolean): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **receiverId**: Number
      接收者ID
    * **state**: Boolean  
      视频状态，打开/关闭

    **Returns**: void

**Returns**: this

### CHANGE_NAME_REQUEST
```
on(MeetingCoreEvents.Room.CHANGE_NAME_REQUEST, cb: Function)
```
提示请求更改用户显示名

**Parameters**
* **evt**: MeetingCoreEvents.Room.CHANGE_NAME_REQUEST
* **cb**: function
  * (roomId: Number, receiverId: Number, name: String): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **receiverId**: Number
      接收者ID
    * **name**: String  
      用户显示名

    **Returns**: void

**Returns**: this

### CHANGE_ROLE_REQUEST
```
on(MeetingCoreEvents.Room.CHANGE_ROLE_REQUEST, cb: Function)
```
提示请求更改用户角色

**Parameters**
* **evt**: MeetingCoreEvents.Room.CHANGE_ROLE_REQUEST
* **cb**: function
  * (roomId: Number, receiverId: Number, role: String): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **receiverId**: Number
      接收者ID
    * **role**: String  
      用户角色

    **Returns**: void

**Returns**: this

### BREAKOUT_GROUPS_START
```
on(MeetingCoreEvents.Room.BREAKOUT_GROUPS_START, cb: Function)
```
提示分组开始

**Parameters**
* **evt**: MeetingCoreEvents.Room.BREAKOUT_GROUPS_START
* **cb**: function
  * (): void  
    **Parameters**  
    * None  

    **Returns**: void

**Returns**: this

### BREAKOUT_GROUPS_STOP
```
on(MeetingCoreEvents.Room.BREAKOUT_GROUPS_STOP, cb: Function)
```
提示分组结束

**Parameters**
* **evt**: MeetingCoreEvents.Room.BREAKOUT_GROUPS_STOP
* **cb**: function
  * (): void  
    **Parameters**
    * None

    **Returns**: void

**Returns**: this

### BREAKOUT_CALL_HOST
```
on(MeetingCoreEvents.Room.BREAKOUT_CALL_HOST, cb: Function)
```
分组时，提示有分组正在呼叫主持人

**Parameters**
* **evt**: MeetingCoreEvents.Room.BREAKOUT_CALL_HOST
* **cb**: function
  * (senderId: Number, groupId: Number): void  
    **Parameters**
    * senderId: Number  
      发送者ID
    * groupId: Number  
      目标分组ID

    **Returns**: void

**Returns**: this

### BREAKOUT_BROADCAST_MESSAGE
```
on(MeetingCoreEvents.Room.BREAKOUT_BROADCAST_MESSAGE, cb: Function)
```
分组时，提示收到分组广播消息

**Parameters**
* **evt**: MeetingCoreEvents.Room.BREAKOUT_BROADCAST_MESSAGE
* **cb**: function
  * (roomId: Number, senderId: Number, message: String, groupId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **senderId**: Number  
      发送者ID
    * **message**: String  
      消息字符串
    * **groupId**: Number  
      目标分组ID

    **Returns**: void

**Returns**: this

### BREAKOUT_MOVE_USER_TO_GROUP_REQ
```
on(MeetingCoreEvents.Room.BREAKOUT_MOVE_USER_TO_GROUP_REQ, cb: Function)
```
分组时，提示请求移动用户到其他分组

**Parameters**
* **evt**: MeetingCoreEvents.Room.BREAKOUT_MOVE_USER_TO_GROUP_REQ
* **cb**: function
  * (toGroupId: Number, userIds: Array(Number)): void  
    **Parameters**
    * **toGroupId**: Number  
      目标分组ID
    * **userIds**: Array(Number)  
      用户ID列表

    **Returns**: void

**Returns**: this

### AUDIO_MUTE_ALL
```
on(MeetingCoreEvents.Room.AUDIO_MUTE_ALL, cb: Function)
```
提示房间被静音

**Parameters**
* **evt**: MeetingCoreEvents.Room.AUDIO_MUTE_ALL
* **cb**: function
  * (roomId: Number, enableChange: Boolean, senderId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **enableChange**: Boolean  
      是否允许其他用户改变自己音频状态
    * **senderId**: Number  
      发送者ID

    **Returns**: void

**Returns**: this

### AUDIO_UNMUTE_ALL
```
on(MeetingCoreEvents.Room.AUDIO_UNMUTE_ALL, cb: Function)
```
提示房间静音解除

**Parameters**
* **evt**: MeetingCoreEvents.Room.AUDIO_UNMUTE_ALL
* **cb**: function
  * (roomId: Number, senderId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **senderId**: Number  
      发送者ID

    **Returns**: void

**Returns**: this

### ROOM_ATTR_UPDATE
```
on(MeetingCoreEvents.Room.ROOM_ATTR_UPDATE, cb: Function)
```
提示房间属性更新

**Parameters**
* **evt**: MeetingCoreEvents.Room.ROOM_ATTR_UPDATE
* **cb**: function
  * (roomId: Number, key: String, value: Any, senderId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **key**: String  
      属性名 
    * **value**: Any   
      属性值
    * **senderId**: Number  
      发送者ID

    **Returns**: void

**Returns**: this

### NAME_CHANGE
```
on(MeetingCoreEvents.Room.NAME_CHANGE, cb: Function)
```
提示用户显示名改变

**Parameters**
* **evt**: MeetingCoreEvents.Room.NAME_CHANGE
* **cb**: function
  * (roomId: Number, targetUserId: Number, name: String): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **targetUserId**: Number  
      被更改用户ID
    * **name**: String  
      显示名字符串

    **Returns**: void

**Returns**: this

### ROLE_CHANGE
```
on(MeetingCoreEvents.Room.ROLE_CHANGE, cb: Function)
```
提示用户角色改变

**Parameters**
* **evt**: MeetingCoreEvents.Room.ROLE_CHANGE
* **cb**: function
  * (roomId: Number, targetUserId: Number, role: String): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **targetUserId**: Number  
      被更改用户ID
    * **role**: String  
      用户角色

    **Returns**: void

**Returns**: this

### AVATAR_CHANGE
```
on(MeetingCoreEvents.Room.AVATAR_CHANGE, cb: Function)
```
提示用户头像改变

**Parameters**
* **evt**: MeetingCoreEvents.Room.AVATAR_CHANGE
* **cb**: function
  * (roomId: Number, targetUserId: Number, avatar: String): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **targetUserId**: Number  
      被更改用户ID
    * **avatar**: String  
      头像URL

    **Returns**: void

**Returns**: this

### VIDEO_CHANGE
```
on(MeetingCoreEvents.Room.VIDEO_CHANGE, cb: Function)
```
提示用户视频状态改变

**Parameters**
* **evt**: MeetingCoreEvents.Room.VIDEO_CHANGE
* **cb**: function
  * (roomId: Number, targetUserId: Number, state: Boolean): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **targetUserId**: Number  
      被更改用户ID
    * **state**: Boolean  
      视频状态

    **Returns**: void

**Returns**: this

### AUDIO_CHANGE
```
on(MeetingCoreEvents.Room.AUDIO_CHANGE, cb: Function)
```
提示用户音频状态改变

**Parameters**
* **evt**: MeetingCoreEvents.Room.AUDIO_CHANGE
* **cb**: function
  * (roomId: Number, targetUserId: Number, state: Boolean): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **targetUserId**: Number  
      被更改用户ID
    * **state**: Boolean  
      音频状态

    **Returns**: void

**Returns**: this

### HAND_CHANGE
```
on(MeetingCoreEvents.Room.HAND_CHANGE, cb: Function)
```
提示用户举手状态改变

**Parameters**
* **evt**: MeetingCoreEvents.Room.HAND_CHANGE
* **cb**: function
  * (roomId: Number, targetUserId: Number, state: Boolean): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **targetUserId**: Number  
      被更改用户ID
    * **state**: Boolean  
      举手状态

    **Returns**: void

**Returns**: this

### SHARE_CHANGE
```
on(MeetingCoreEvents.Room.SHARE_CHANGE, cb: Function)
```
提示用户共享状态改变

**Parameters**
* **evt**: MeetingCoreEvents.Room.SHARE_CHANGE
* **cb**: function
  * (roomId: Number, targetUserId: Number, share: String): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **targetUserId**: Number  
      被更改用户ID
    * **share**: String  
      共享状态

    **Returns**: void

**Returns**: this

### GROUP_ID_CHANGE
```
on(MeetingCoreEvents.Room.GROUP_ID_CHANGE, cb: Function)
```
提示用户分组状态改变

**Parameters**
* **evt**: MeetingCoreEvents.Room.GROUP_ID_CHANGE
* **cb**: function
  * (roomId: Number, targetUserId: Number, groupId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **targetUserId**: Number  
      被更改用户ID
    * **groupId**: Number  
      分组ID

    **Returns**: void

**Returns**: this

### USER_KICK_OUT
```
on(MeetingCoreEvents.Room.USER_KICK_OUT, cb: Function)
```
提示用户被踢出房间

**Parameters**
* **evt**: MeetingCoreEvents.Room.USER_KICK_OUT
* **cb**: function
  * (roomId: Number, senderId: Number, targetUserId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **senderId**: Number  
      发送者ID
    * **targetUserId**: Number  
      被更改用户ID

    **Returns**: void

**Returns**: this

### REMOTE_LOGIN
```
on(MeetingCoreEvents.Room.REMOTE_LOGIN, cb: Function)
```
提示用户账号被远程登录

**Parameters**
* **evt**: MeetingCoreEvents.Room.REMOTE_LOGIN
* **cb**: function
  * (system: String): void  
    **Parameters**
    * **system**: String  
      远程登录的系统信息

    **Returns**: void

**Returns**: this

### SERVER_CONNECT_FAIL
```
on(MeetingCoreEvents.Room.SERVER_CONNECT_FAIL, cb: Function)
```
提示链接服务器失败

**Parameters**
* **evt**: MeetingCoreEvents.Room.SERVER_CONNECT_FAIL
* **cb**: function
  * (): void  
    **Parameters**
    * None 

    **Returns**: void

**Returns**: this

### SERVER_CONNECTED
```
on(MeetingCoreEvents.Room.SERVER_CONNECTED, cb: Function)
```
提示服务器已连接

**Parameters**
* **evt**: MeetingCoreEvents.Room.SERVER_CONNECTED
* **cb**: function
  * (): void  
    **Parameters**
    * None

    **Returns**: void

**Returns**: this

### CHAT_ROOM_MESSAGE
```
on(MeetingCoreEvents.Room.CHAT_ROOM_MESSAGE, cb: Function)
```
提示接收到聊天广播消息 

**Parameters**
* **evt**: MeetingCoreEvents.Room.CHAT_ROOM_MESSAGE
* **cb**: function
  * (senderId: Number, receiverId: Number, content: String): void  
    **Parameters**
      * **senderId**: Number  
        发送者ID
      * **receiverId**: Number
        接收者ID
      * **content**: String  
        聊天消息内容

    **Returns**: void

**Returns**: this

### CHAT_PEER_MESSAGE
```
on(MeetingCoreEvents.Room.CHAT_PEER_MESSAGE, cb: Function)
```
提示接收到聊天点对点消息

**Parameters**
* **evt**: MeetingCoreEvents.Room.CHAT_PEER_MESSAGE
* **cb**: function
  * (senderId: Number, receiverId: Number, content: String): void  
    **Parameters**
    * **senderId**: Number  
      发送者ID
    * **receiverId**: Number
      接收者ID
    * **content**: String  
      聊天消息内容

    **Returns**: void

**Returns**: this

### CHAT_SYSTEM_ROOM_MESSAGE
```
on(MeetingCoreEvents.Room.CHAT_SYSTEM_ROOM_MESSAGE, cb: Function)
```
提示接收到系统广播消息

**Parameters**
* **evt**: MeetingCoreEvents.Room.CHAT_SYSTEM_ROOM_MESSAGE
* **cb**: function
  * (senderId: Number, receiverId: Number, content: String): void  
    **Parameters**
    * **senderId**: Number  
      发送者ID
    * **receiverId**: Number
      接收者ID
    * **content**: String  
      聊天消息内容

    **Returns**: void

**Returns**: this

### CHAT_SYSTEM_PEER_MESSAGE
```
on(MeetingCoreEvents.Room.CHAT_SYSTEM_PEER_MESSAGE, cb: Function)
```
提示接收到系统点对点消息

**Parameters**
* **evt**: MeetingCoreEvents.Room.CHAT_SYSTEM_PEER_MESSAGE
* **cb**: function
  * (senderId: Number, receiverId: Number, content: String): void  
    **Parameters**
    * **senderId**: Number  
      发送者ID
    * **receiverId**: Number
      接收者ID
    * **content**: String  
      聊天消息内容

    **Returns**: void

**Returns**: this
