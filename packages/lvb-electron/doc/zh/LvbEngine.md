# LvbEngine

## Index
### Constructors
* [Constructors](#constructor)

### Class Properties
* [RTMEvents](#rtmevents)
* [RTCEvents](#rtcevents)
* [RTCTestEvents](#rtctestevents)

### Object Properties
* [userId](#userid)
* [roomId](#roomid)
* [screenShareId](#screenshareid)
* [screenShareOpts](#screenshareopts)

### Methods
* [init](#init)
* [join](#join)
* [createRTC](#creatertc)
* [createRTCForTest](#creatertcfortest)
* [createRTM](#creatertm)

## Constructors

### constructor
```
new LvbEngine:LvbEngine
    return LvbEngine
```

## Class Properties
### RTMEvents
请查看RTM Web SDK文档

### RTCEvents
RTC系统内触发的消息

### RTCTestEvents
RTC测试系统内触发的消息

## Object Properties

### userId
```javascript
userId: Number
```

### roomId
```javascript
roomId: Number
```

### screenShareId
```javascript
screenShareId: Number
```

### screenShareOpts
```javascript
screenShareOpts: Object
```
## Methods

### init
```
init(opts: Object): Void
```
初始化Lvb Engine

**Parameters**
* opts: Object  
  * token: 认证token
  * appKey: app key
  * roomId: 房间ID
  * userId: 用户ID
  * share: 共享所需要的信息
    * id: 共享所使用的ID
    * token: 共享所使用的token

**Return**  
异步函数，返回Promise对象

### join
```
join(): Promise
```
渐入Lvb Engine

**Parameters**
None

**Return**  
返回Promise对象指示加入操作是否成功

### createRTC
```
createRTC(opts: Object): RTCEngine
```
创建RTCEngine对象

**Parameters**
* opts: Object
  * videoQuality: 视频质量
  * rendererMode: 视频本地渲染模式
  * rtcProfile: RTC系统Profile
  * isHost: 是否是主播
  * autoSubscribe: 是否需要自动订阅远端流

**Return**  
返回RTCEngine实例

### createRTCForTest
```
createRTCForTest(appId: String): RTCEngineTest
```
创建RTCEngine测试实例

**Parameters**
* appId: String  
  app id

**Return**  
返回RTCEngine测试实例

### createRTM
```
createRTM(opts: Object): RTMEngine
```
创建RTMEngine实例

**Parameters**
* opts: Object
  * system: 登录RTM的系统名

**Return**  
返回RTMEngine测试实例
