# RTMEngine.RTMEvents

通过RTMEngine实例上的on方法去监听RTM room里的所有事件

## Events
* [LOCAL_USER_JOIN_SUCCESS](#local_user_join_success)
* [LOCAL_USER_JOIN_FAIL](#local_user_join_fail)
* [ROOM_START](#room_start)
* [ROOM_STOP](#room_stop)
* [MEMBER_ONLINE](#member_online)
* [MEMBER_OFFLINE](#member_offline)
* [SYNC_ROOM_ATTR](#sync_room_attr)
* [SYNC_USER_ATTR](#sync_user_attr)
* [CHAT_MESSAGE](#chat_message)
* [CONTROL_MESSAGE](#control_message)
* [WHITEBOARD_MESSAGE](#whiteboard_message)
* [CUSTOM_MESSAGE](#custom_message)
* [USER_ATTR_INIT](#user_attr_init)
* [USER_ATTR_UPDATE](#user_attr_update)
* [ROOM_ATTR_UPDATE](#room_attr_update)
* [CONNECTED](#connected)
* [RECONNECTED](#reconnected)
* [RECONNECTING](#reconnecting)
* [RECONNECT_MAX_TIME](#reconnect_max_time)
* [KICK_OUT](#kick_out)
* [REMOTE_LOGIN](#remote_login)

## Listeners

### LOCAL_USER_JOIN_SUCCESS
```
on(RTMEvents.LOCAL_USER_JOIN_SUCCESS, cb: Function)
```
提示本地用户加入成功

**Parameters**
* **evt**: RTMEvents.LOCAL_USER_JOIN_SUCCESS
* **cb**: function
  * (roomId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID

    **Returns**: void

**Returns**: this

### LOCAL_USER_JOIN_FAIL
```
on(RTMEvents.LOCAL_USER_JOIN_FAIL, cb: Function)
```
提示本地用户加入失败

**Parameters**
* **evt**: RTMEvents.LOCAL_USER_JOIN_FAIL
* **cb**: function
  * (roomId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID

    **Returns**: void

**Returns**: this

### ROOM_START
```
on(RTMEvents.ROOM_START, cb: Function)
```
提示房间开始

**Parameters**
* **evt**: RTMEvents.ROOM_START
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
on(RTMEvents.ROOM_STOP, cb: Function)
```
提示房间关闭

**Parameters**
* **evt**: RTMEvents.ROOM_STOP
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
on(RTMEvents.MEMBER_ONLINE, cb: Function)
```
提示用户上线

**Parameters**
* **evt**: RTMEvents.MEMBER_ONLINE
* **cb**: function
  * (roomId: Number, userId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **userId**: Number  
      上线用户ID

    **Returns**: void

**Returns**: this

### MEMBER_OFFLINE
```
on(RTMEvents.MEMBER_OFFLINE, cb: Function)
```
提示用户下线

**Parameters**
* **evt**: RTMEvents.MEMBER_ONLINE
* **cb**: function
  * (roomId: Number, userId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **userId**: Number  
      下线用户ID

    **Returns**: void

**Returns**: this

### SYNC_ROOM_ATTR
```
on(RTMEvents.SYNC_ROOM_ATTR, cb: Function)
```
提示获取房间属性成功并返回全部房间属性

**Parameters**
* **evt**: RTMEvents.SYNC_ROOM_ATTR
* **cb**: function
  * (roomId: Number, roomInfo: Object): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **roomInfo**: Object  
      房间属性

    **Returns**: void

**Returns**: this

### SYNC_USER_ATTR
```
on(RTMEvents.SYNC_USER_ATTR, cb: Function)
```
提示获取房间用户信息成功并返回全部用户信息 

**Parameters**
* **evt**: RTMEvents.SYNC_USER_ATTR
* **cb**: function
  * (roomId: Number, userAttrs: Array, hasMore: Boolean): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **userAttrs**: Array  
      用户信息
    * **hasMore**: Boolean  
      是否还有后续数据包

    **Returns**: void

**Returns**: this

### CHAT_MESSAGE
```
on(RTMEvents.CHAT_MESSAGE, cb: Function)
```
提示有新的聊天消息

**Parameters**
* **evt**: RTMEvents.CHAT_MESSAGE
* **cb**: function
  * (senderId: Number, roomId: Number, content: String:Object, msgType: String): void  
    **Parameters**
    * **senderId**: Number  
      发送者ID
    * **roomId**: Number  
      房间ID
    * **content**: String|Object  
      聊天内容
    * **msgType**: String  
      消息类型：room ｜ peer

    **Returns**: void

**Returns**: this

### CONTROL_MESSAGE
```
on(RTMEvents.CONTROL_MESSAGE, cb: Function)
```
提示有新的控制消息

**Parameters**
* **evt**: RTMEvents.CONTROL_MESSAGE
* **cb**: function
  * (senderId: Number, roomId: Number, content: String:Object, msgType: String): void  
    **Parameters**
    * **senderId**: Number  
      发送者ID
    * **roomId**: Number  
      房间ID
    * **content**: String|Object  
      聊天内容
    * **msgType**: String  
      消息类型：room ｜ peer

    **Returns**: void

**Returns**: this

### WHITEBOARD_MESSAGE
```
on(RTMEvents.WHITEBOARD_MESSAGE, cb: Function)
```
提示有新的白板消息

**Parameters**
* **evt**: RTMEvents.WHITEBOARD_MESSAGE
* **cb**: function
  * (senderId: Number, roomId: Number, content: String:Object, msgType: String): void  
    **Parameters**
    * **senderId**: Number  
      发送者ID
    * **roomId**: Number  
      房间ID
    * **content**: String|Object  
      聊天内容
    * **msgType**: String  
      消息类型：room ｜ peer

    **Returns**: void

**Returns**: this

### CUSTOM_MESSAGE
```
on(RTMEvents.CUSTOM_MESSAGE, cb: Function)
```
提示有新的自定义消息

**Parameters**
* **evt**: RTMEvents.CUSTOM_MESSAGE
* **cb**: function
  * (category: String, senderId: Number, roomId: Number, content: String:Object, msgType: String): void  
    **Parameters**
    * **category**: String  
      消息发送的通道名称
    * **senderId**: Number  
      发送者ID
    * **roomId**: Number  
      房间ID
    * **content**: String|Object  
      聊天内容
    * **msgType**: String  
      消息类型：room ｜ peer

    **Returns**: void

**Returns**: this

### USER_ATTR_INIT
```
on(RTMEvents.USER_ATTR_INIT, cb: Function)
```
提示用户初始化信息成功

**Parameters**
* **evt**: RTMEvents.USER_ATTR_INIT
* **cb**: function
  * (roomId: Number, userId: Number, attrs: Object, senderId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **userId**: Number  
      用户ID
    * **attrs**: Object  
      用户属性
    * **senderId**: Number  
      发送者ID

    **Returns**: void

**Returns**: this

### USER_ATTR_UPDATE
```
on(RTMEvents.USER_ATTR_UPDATE, cb: Function)
```
提示用户设置或更新了属性

**Parameters**
* **evt**: RTMEvents.USER_ATTR_UPDATE
* **cb**: function
  * (roomId: Number, userId: Number, attrs: Object, senderId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **userId**: Number  
      用户ID
    * **attrs**: Object  
      用户属性
    * **senderId**: Number  
      发送者ID

    **Returns**: void

**Returns**: this

### ROOM_ATTR_UPDATE
```
on(RTMEvents.ROOM_ATTR_UPDATE, cb: Function)
```
提示房间属性设置或更新

**Parameters**
* **evt**: RTMEvents.ROOM_ATTR_UPDATE
* **cb**: function
  * (roomId: Number, attrs: Object, senderId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **attrs**: Object  
      用户属性
    * **senderId**: Number  
      发送者ID

    **Returns**: void

**Returns**: this

### CONNECTED
```
on(RTMEvents.CONNECTED, cb: Function)
```
提示连接服务器成功

**Parameters**
* **evt**: RTMEvents.CONNECTED
* **cb**: function
  * (): void  
    **Parameters**: None

    **Returns**: void

**Returns**: this

### RECONNECTED
```
on(RTMEvents.RECONNECTED, cb: Function)
```
提示重新连接服务器成功

**Parameters**
* **evt**: RTMEvents.RECONNECTED
* **cb**: function
  * (): void  
    **Parameters**: None

    **Returns**: void

**Returns**: this

### RECONNECTING
```
on(RTMEvents.RECONNECTING, cb: Function)
```
提示正在重新连接服务器

**Parameters**
* **evt**: RTMEvents.RECONNECTING
* **cb**: function
  * (): void  
    **Parameters**: None

    **Returns**: void

**Returns**: this

### RECONNECT_MAX_TIME
```
on(RTMEvents.RECONNECT_MAX_TIME, cb: Function)
```
提示重新连接服务器次数到达最大值，重连失败

**Parameters**
* **evt**: RTMEvents.RECONNECT_MAX_TIME
* **cb**: function
  * (): void  
    **Parameters**: None

    **Returns**: void

**Returns**: this

### KICK_OUT
```
on(RTMEvents.KICK_OUT, cb: Function)
```
提示用户被踢出房间

**Parameters**
* **evt**: RTMEvents.KICK_OUT
* **cb**: function
  * (roomId: Number, senderId: Number, userId: Number): void  
    **Parameters**
    * **roomId**: Number  
      房间ID
    * **senderId**: Number  
      发送者ID
    * **userId**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_LOGIN
```
on(RTMEvents.REMOTE_LOGIN, cb: Function)
```
当前用户被远端登录

**Parameters**
* **evt**: RTMEvents.REMOTE_LOGIN
* **cb**: function
  * (system: String): void  
    **Parameters**
    * **system**: String  
      远端登录账号的系统

    **Returns**: void

**Returns**: this
