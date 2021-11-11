# RTM Engine

## Index
### Constructors

* [Constructors](#constructor)

### Class Properties

* MessageCategory
  * Control
  * Chat
  * Whiteboard
  * Custom

* MessageType
  * Room
  * Peer

### Methods
* [init](#init)
* [login](#login)
* [logout](#logout)
* [join](#join)
* [leave](#leave)
* [kickOut](#kickout)
* [stopRoom](#stoproom)
* [setRoomAttr](#setroomattr)
* [setRoomAttrs](#setroomattrs)
* [setUserInitAttrs](#setuserinitattrs)
* [setUserAttrs](#setuserattrs)
* [requestSyncRoomAttrs](#requestsyncroomattrs)
* [requestSyncUsersAttrs](#requestsyncusersattrs)
* [requestSyncUsersAttrsByRoles](#requestsyncusersattrsbyroles)
* [registerRTMCategory](#registerrtmcategory)
* [unregisterRTMCategory](#unregisterrtmcategory)
* [getCustomEventByCategory](#getcustomeventbycategory)
* [sendMessageToRoomFromWS](#sendmessagetoroomfromws)
* [sendMessageToPeerFromWS](#sendmessagetopeerfromws)
* [sendMessageToRoom](#sendmessagetoroom)
* [sendMessageToPeer](#sendmessagetopeer)
* [sendMonitorData](#sendmonitordata)
* [on](#on)

## Constructors

### constructor
```
new RTMEngine:RTMEngine
    return RTMEngine
```

## Methods

### init
```
init(opts: Object): Void
```
初始化RTM Engine

**Parameters**
* opts: Object  
  初始化参数
  * roomId: Number  
    房间ID
  * userId: Number  
    用户ID
  * innerUserId: Number  
    用户内部ID
  * websocketURI: String  
    WebSocket server地址
  * apiBaseURL: String  
    Rest api server地址
  * token: String  
    认证token
  * appKey: String  
    app Key
  * system: String  
    用户设备系统信息（PC） 
  * eventTrigger: Object  
    消息触发的对象

**Return**  
None

### login
```
login(): Void
```
登录RTM Engine

**Parameters**
None

**Return**  
None

### logout
```
logout(): Void
```
登出RTM Engine

**Parameters**
None

**Return**  
None

### join
```
join(roomId: Number): Void
```
加入指定房间

**Parameters**
* roomId: Number  
  房间ID

**Return**  
None

### leave
```
leave(roomId: Number): Void
```
离开指定房间

**Parameters**
* roomId: Number  
  房间ID

**Return**  
None

### kickOut
```
kickOut(roomId: Number, userId: Number): Promise
```
将用户踢出房间

**Parameters**
* roomId: Number  
  房间ID
* userId: Number  
  用户ID

**Return**  
返回Promise对象说明踢人操作是否成功

### stopRoom
```
stopRoom(roomId: Number): Promise
```
关闭房间

**Parameters**
* roomId: Number  
  房间ID

**Return**  
返回Promise对象说明房间关闭操作是否成功

### setRoomAttr
```
setRoomAttr(roomId: Number, attrName: String, attrs: Any): Promise
```
设置房间属性

**Parameters**
* roomId: Number  
  房间ID
* attrName: String  
  属性名称
* attrs: Any  
  属性

**Return**  
返回Promise对象说明设置房间属性操作是否成功

### setRoomAttrs
```
setRoomAttrs(roomId: Number, attrs: Object): Promise
```
设置房间的多个属性

**Parameters**
* roomId: Number  
  房间ID
* attrs: Object  
  属性

**Return**  
返回Promise对象说明设置房间属性操作是否成功

### setUserInitAttrs
```
setUserInitAttrs(roomId: Number, userId: Nuber, attrs: Object): Promise
```
当用户第一次登录后设置用户属性

**Parameters**
* roomId: Number  
  房间ID
* userId: Number  
  用户ID
* attrs: Object  
  用户属性

**Return**  
返回Promise对象说明设置用户属性操作是否成功

### setUserAttrs
```
setUserAttrs(roomId: Number, userId: Nuber, attrs: Object): Promise
```
设置用户属性

**Parameters**
* roomId: Number  
  房间ID
* userId: Number  
  用户ID
* attrs: Object  
  用户属性

**Return**  
返回Promise对象说明设置用户属性操作是否成功

### requestSyncRoomAttrs
```
requestSyncRoomAttrs(roomId: Number): Promise
```
获取房间全部属性

**Parameters**
* roomId: Number  
  房间ID

**Return**  
返回Promise对象说明获取房间属性操作是否成功

### requestSyncUsersAttrs
```
requestSyncUsersAttrs(roomId: Number): Promise
```
获取房间内所有用户的属性

**Parameters**
* roomId: Number  
  房间ID

**Return**  
返回Promise对象说明获取用户属性操作是否成功

### requestSyncUsersAttrsByRoles
```
requestSyncUsersAttrsByRoles(roomId: Number, rules: Array): Promise
```
按照指定规则获取房间内所有用户的属性

**Parameters**
* roomId: Number  
  房间ID
* rules: Array  
  规则列表

**Return**  
返回Promise对象说明获取用户属性操作是否成功

### registerRTMCategory
```
registerRTMCategory(category: String): String
```
注册房间通道分类

**Parameters**
* category: String  
  通道分类名称

**Return**  
返回监听该分类的消息名称

### unregisterRTMCategory
```
unregisterRTMCategory(category: String): Void
```
注销房间通道分类

**Parameters**
* category: String  
  通道分类名称

**Return**  
None

### getCustomEventByCategory
```
getCustomEventByCategory(category: String): String
```
获取指定分类的监听消息名称

**Parameters**
* category: String  
  通道分类名称

**Return**  
返回监听该分类的消息名称

### sendMessageToRoomFromWS
```
sendMessageToRoomFromWS(roomId: Number, category: String, content: String|Object)
```
通过Websocket通道发送广播消息

**Parameters**
* roomId: Number   
  房间ID
* category: String  
  通道分类名称
* content: String:Object  
  消息内容

**Return**  
None

### sendMessageToPeerFromWS
```
sendMessageToPeerFromWS(roomId: Number, content: String|Object)
```
通过Websocket通道发送广播消息

**Parameters**
* roomId: Number   
  房间ID
* content: String:Object  
  消息内容

**Return**  
None

### sendMessageToRoom
```
sendMessageToRoom(roomId: Number, category: String, content: String|Object): Promise
```
通过Rest api方式发送广播消息

**Parameters**
* roomId: Number   
  房间ID
* category: String  
  通道分类名称
* content: String:Object  
  消息内容

**Return**  
返回Promise说明消息发送是否成功

### sendMessageToPeer
```
sendMessageToPeer(roomId: Number, content: String|Object): Promise
```
通过Rest api方式发送点对点消息

**Parameters**
* roomId: Number   
  房间ID
* content: String:Object  
  消息内容

**Return**  
返回Promise说明消息发送是否成功

### sendMonitorData
```
sendMonitorData(data: String|Object): Void
```
向服务端发送监控数据

**Parameters**
* data: String:Object  
  监控数据

**Return**  
None

### on
```
on(event: String, callback: Function): Void
```
监听房间内的指定消息

**Parameters**
* event: String  
  监听消息
* callback: Function  
  监听消息的处理回调

**Return**  
None
