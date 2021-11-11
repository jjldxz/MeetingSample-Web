# meetingClient

## Index
### Constructors
* [Constructors](#constructor)

### Properties
* [userId](#userid)
* [token](#token)
* [refreshToken](#refreshtoken)

### Methods
* [signUp](#signup)
* [login](#login)
* [changePassword](#changepassword)
* [getUserInfo](#getuserinfo)
* [updateUserInfo](#updateuserinfo)
* [createMeeting](#createmeeting)
* [deleteMeeting](#deletemeeting)
* [deleteMeetings](#deletemeetings)
* [getMeetingInfo](#getmeetinginfo)
* [getMeetingsList](#getmeetingslist)

## Constructors

### constructor
```
new meetingClient:meetingClient
    return meetingClient
```

## Properties

### userId
```javascript
userId: Number
```

### token
```javascript
token: String
```

### refreshToken
```javascript
refreshToken: String
```

## Methods

### signUp
```
signUp(userName: String, password: String): Promise
```
注册会议用户  

**Parameters**
* userName: String  
  用户名
* password: String  
  密码 

**Return**  
异步函数，返回Promise对象

### login
```
login(userName: String, password: String): Promise
```
登录会议  

**Parameters**
* userName: String  
  用户名
* password: String  
  密码 

**Return**  
异步函数，返回Promise对象

### changePassword
```
changePassword(oldPwd: String, newPwd: String): Promise
```
更改密码

**Parameters**
* oldPwd: String  
  旧密码 
* newPwd: String  
  新密码

**Return**  
异步函数，返回Promise对象

### getUserInfo
```
getUserInfo(): Promise
```
获取用户详细信息  

**Parameters** None

**Return**  
异步函数，返回Promise对象

### updateUserInfo
```
updateUserInfo(opts: Object): Promise
```
更新用户信息

**Parameters**

* opts: Object
  * email: String 邮箱地址  

**Return**  
异步函数，返回Promise对象

### createMeeting
```
createMeeting(name: String, begin: String, end: String, opts: Object): Promise
```
创建会议

**Parameters**
* name: String  
  会议名
* begin: String  
  会议开始时间，该时间格式为UTC格式
* end: String  
  会议结束时间，该时间格式为UTC格式
* opts: Object
  * muteType: Number  
    0 | 1  
  * password: String

**Return**  
异步函数，返回Promise对象

### deleteMeeting
```
deleteMeeting(meetingId: Number)
```
删除会议

**Parameters**
* meetingId: String  
  会议ID

**Return**  
异步函数，返回Promise对象

### deleteMeetings
```
deleteMeetings(meetings: Array<Number>): Promise
```
删除多个会议

**Parameters**
* meetings: Array<Number>  
  会议ID列表

**Return**  
异步函数，返回Promise对象

### getMeetingInfo
```
getMeetingInfo(meetingId: Number): Promise
```
获取会议详情

**Parameters**
* meetingId: Number  
  会议ID

**Return**  
异步函数，返回Promise对象

### getMeetingsList
```
getMeetingsList(opts: Object): Promise
```
获取会议列表

**Parameters**
* opts: Object
  * begin: String  
    (可选参数)会议开始时间，时间格式为UTC
  * end: String  
    (可选参数)会议结束时间，时间格式为UTC

**Return**  
异步函数，返回Promise对象
