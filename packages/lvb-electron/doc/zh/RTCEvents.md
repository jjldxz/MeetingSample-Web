# LvbEngine.RTCEvents

通过 LvbEngine 实例上的on方法去监听RTCEvents里的所有事件

## Events
* [ERROR](#error)
* [LOCAL_JOIN](#local_join)
* [LOCAL_LEAVE](#local_leave)
* [REMOTE_USER_JOIN](#remote_user_join)
* [REMOTE_USER_LEAVE](#remote_user_leave)
* [AUDIO_LEVEL_CHANGE](#audio_level_change)
* [AUDIO_DEVICE_STATE_CHANGE](#audio_device_state_change)
* [VIDEO_DEVICE_STATE_CHANGE](#video_device_state_change)
* [AUDIO_MIXING_STATE](#audio_mixing_state)
* [LOCAL_NETWORK_QUALITY](#local_network_quality)
* [REMOTE_NETWORK_QUALITY](#remote_network_quality)
* [VIDEO_SIZE_CHANGE](#video_size_change)
* [CONNECTION_LOST](#connection_lost)
* [ACTIVE_USER](#active_user)
* [SCREEN_SHARE_JOIN](#screen_share_join)
* [SCREEN_SHARE_LEAVE](#screen_share_leave)
* [REMOTE_VIDEO_FIRST_FRAME](#remote_video_first_frame)
* [REMOTE_VIDEO_ON](#remote_video_on)
* [REMOTE_VIDEO_OFF](#remote_video_off)
* [REMOTE_AUDIO_ON](#remote_audio_on)
* [REMOTE_AUDIO_OFF](#remote_audio_off)
* [LOCAL_USER_BANNED](#local_user_banned)
* [LOCAL_USER_VIDEO_PUBLISHED](#local_user_video_published)
* [LOCAL_USER_VIDEO_UNPUBLISHED](#local_user_video_unpublished)
* [LOCAL_USER_AUDIO_PUBLISHED](#local_user_audio_published)
* [LOCAL_USER_AUDIO_UNPUBLISHED](#local_user_audio_unpublished)
* [REMOTE_STREAM_SUBSCRIBED](#remote_stream_subscribed)
* [REMOTE_STREAM_UNSUBSCRIBED](#remote_stream_unsubscribed)

## Listeners

### ERROR
```
on(RTCEvents.ERROR, cb: Function)
```
提示RTC Engine出错

**Parameters**
* **evt**: RTCEvents.ERROR
* **cb**: function
  * ({ err: Number, msg: String }): void  
    **Parameters**
    * **err**: Number  
      错误ID
    * **msg**: String  
      错误信息

    **Returns**: void

**Returns**: this

### LOCAL_JOIN
```
on(RTCEvents.LOCAL_JOIN, cb: Function)
```
本地用户加入RTC房间

**Parameters**
* **evt**: RTCEvents.LOCAL_JOIN
* **cb**: function
  * (channel: String, uid: Number): void  
    **Parameters**
    * **channel**: String  
      房间ID
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### LOCAL_LEAVE
```
on(RTCEvents.LOCAL_LEAVE, cb: Function)
```
本地用户离开RTC房间

**Parameters**
* **evt**: RTCEvents.LOCAL_LEAVE
* **cb**: function
  * (uid: Number): void  
    **Parameters**
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_USER_JOIN
```
on(RTCEvents.REMOTE_USER_JOIN, cb: Function)
```
远端用户加入RTC房间

**Parameters**
* **evt**: RTCEvents.REMOTE_USER_JOIN
* **cb**: function
  * (uid: Number): void  
    **Parameters**
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_USER_LEAVE
```
on(RTCEvents.REMOTE_USER_LEAVE, cb: Function)
```
远端用户离开RTC房间

**Parameters**
* **evt**: RTCEvents.REMOTE_USER_LEAVE
* **cb**: function
  * (uid: Number): void  
    **Parameters**
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### AUDIO_LEVEL_CHANGE
```
on(RTCEvents.AUDIO_LEVEL_CHANGE, cb: Function)
```
用户音量指示

**Parameters**
* **evt**: RTCEvents.AUDIO_LEVEL_CHANGE
* **cb**: function
  * (uid: Number, volume: Number): void  
    **Parameters**
    * **uid**: Number  
      用户ID
    * **volume**: Number  
      音量百分比

    **Returns**: void

**Returns**: this

### AUDIO_DEVICE_STATE_CHANGE
```
on(RTCEvents.AUDIO_DEVICE_STATE_CHANGE, cb: Function)
```
用户音量指示

**Parameters**
* **evt**: RTCEvents.AUDIO_DEVICE_STATE_CHANGE
* **cb**: function
  * (deviceId, deviceType, deviceState): void  
    **Parameters**
    * **deviceId**: String   
      用户ID
    * **deviceType**: Number  
      设备类型
      * -1：未知的设备类型
      * 0：音频播放设备
      * 1：音频录制设备
      * 2：视频渲染设备
      * 3：视频采集设备
      * 4：应用的音频播放设备
    * **deviceState**: Number  
      设备状态
      * macOS：  
        * 0: 设备就绪
        * 8: 设备被拔出
      * Windows：  
        * 0：设备就绪
        * 1：设备正在使用
        * 2：设备被禁用
        * 4：没有此设备
        * 8：设备被拔出
        * 16：不推荐使用该设备

    **Returns**: void

**Returns**: this

### VIDEO_DEVICE_STATE_CHANGE
```
on(RTCEvents.VIDEO_DEVICE_STATE_CHANGE, cb: Function)
```
用户音量指示

**Parameters**
* **evt**: RTCEvents.VIDEO_DEVICE_STATE_CHANGE
* **cb**: function
  * (deviceId: String, deviceType: Number, deviceState: Number): void  
    **Parameters**
    * **deviceId**: String   
      用户ID
    * **deviceType**: Number  
      设备类型
      * -1：未知的设备类型
      * 0：音频播放设备
      * 1：音频录制设备
      * 2：视频渲染设备
      * 3：视频采集设备
      * 4：应用的音频播放设备
    * **deviceState**: Number  
      设备状态
      * macOS：
        * 0: 设备就绪
        * 8: 设备被拔出
      * Windows：
        * 0：设备就绪
        * 1：设备正在使用
        * 2：设备被禁用
        * 4：没有此设备
        * 8：设备被拔出
        * 16：不推荐使用该设备

    **Returns**: void

**Returns**: this

### AUDIO_MIXING_STATE
```
on(RTCEvents.AUDIO_MIXING_STATE, cb: Function)
```
本地用户的音乐文件播放状态改变

**Parameters**
* **evt**: RTCEvents.AUDIO_MIXING_STATE
* **cb**: function
  * (err: String): void  
    **Parameters**
    * **err**: String  
      错误消息

    **Returns**: void

**Returns**: this

### LOCAL_NETWORK_QUALITY
```
on(RTCEvents.LOCAL_NETWORK_QUALITY, cb: Function)
```
本地用户网络质量

**Parameters**
* **evt**: RTCEvents.LOCAL_NETWORK_QUALITY
* **cb**: function
  * (txQuality: Number, rxQuality: Number): void  
    **Parameters**
    * **txQuality**: Number  
      上行网络质量
    * **rxQuality**: Number  
      下行网络质量

    **Returns**: void

**Returns**: this

### REMOTE_NETWORK_QUALITY
```
on(RTCEvents.REMOTE_NETWORK_QUALITY, cb: Function)
```
远端用户网络质量

**Parameters**
* **evt**: RTCEvents.REMOTE_NETWORK_QUALITY
* **cb**: function
  * (txQuality: Number, rxQuality: Number): void  
    **Parameters**
    * **txQuality**: Number  
      上行网络质量
    * **rxQuality**: Number  
      下行网络质量

    **Returns**: void

**Returns**: this

### VIDEO_SIZE_CHANGE
```
on(RTCEvents.VIDEO_SIZE_CHANGE, cb: Function)
```
本地或远端视频大小和旋转信息发生改变回调

**Parameters**
* **evt**: RTCEvents.VIDEO_SIZE_CHANGE
* **cb**: function
  * (uid: Number, width: Number, height: Number, rotation: Number): void  
    **Parameters**
    * **uid**: Number  
      用户ID
    * **width**: Number  
      视频宽度
    * **height**: Number  
      视频高度
    * **rotation**: Number  
      视频旋转角

    **Returns**: void

**Returns**: this

### CONNECTION_LOST
```
on(RTCEvents.CONNECTION_LOST, cb: Function)
```
网络连接中断，且 SDK 无法在 10 秒内连接服务器回调

**Parameters**
* **evt**: RTCEvents.CONNECTION_LOST
* **cb**: function
  * (): void  
    **Parameters**: None

    **Returns**: void

**Returns**: this

### ACTIVE_USER
```
on(RTCEvents.ACTIVE_USER, cb: Function)
```
检测到活跃用户回调

**Parameters**
* **evt**: RTCEvents.ACTIVE_USER
* **cb**: function
  * (uid: Number): void  
    **Parameters**: 
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### SCREEN_SHARE_JOIN
```
on(RTCEvents.SCREEN_SHARE_JOIN, cb: Function)
```
屏幕共享对象成功加入频道回调

**Parameters**
* **evt**: RTCEvents.SCREEN_SHARE_JOIN
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### SCREEN_SHARE_LEAVE
```
on(RTCEvents.SCREEN_SHARE_LEAVE, cb: Function)
```
屏幕共享对象离开频道回调

**Parameters**
* **evt**: RTCEvents.SCREEN_SHARE_LEAVE
* **cb**: function
  * (screenShareId: Number): void  
    **Parameters**:
    * **screenShareId**: Number  
      共享流ID

    **Returns**: void

**Returns**: this

### REMOTE_VIDEO_FIRST_FRAME
```
on(RTCEvents.REMOTE_VIDEO_FIRST_FRAME, cb: Function)
```
远端视频流播放第一帧数据

**Parameters**
* **evt**: RTCEvents.REMOTE_VIDEO_FIRST_FRAME
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_VIDEO_ON
```
on(RTCEvents.REMOTE_VIDEO_ON, cb: Function)
```
远端视频流打开

**Parameters**
* **evt**: RTCEvents.REMOTE_VIDEO_ON
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_VIDEO_OFF
```
on(RTCEvents.REMOTE_VIDEO_OFF, cb: Function)
```
远端视频流关闭

**Parameters**
* **evt**: RTCEvents.REMOTE_VIDEO_OFF
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_AUDIO_ON
```
on(RTCEvents.REMOTE_AUDIO_ON, cb: Function)
```
远端音频流打开

**Parameters**
* **evt**: RTCEvents.REMOTE_AUDIO_ON
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_AUDIO_OFF
```
on(RTCEvents.REMOTE_AUDIO_OFF, cb: Function)
```
远端音频流关闭

**Parameters**
* **evt**: RTCEvents.REMOTE_AUDIO_OFF
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### LOCAL_USER_BANNED
```
on(RTCEvents.LOCAL_USER_BANNED, cb: Function)
```
网络连接状态已改变回调

**Parameters**
* **evt**: RTCEvents.LOCAL_USER_BANNED
* **cb**: function
  * (): void  
    **Parameters**: Bone

    **Returns**: void

**Returns**: this

### LOCAL_USER_VIDEO_PUBLISHED
```
on(RTCEvents.LOCAL_USER_VIDEO_PUBLISHED, cb: Function)
```
本地用户视频流发布

**Parameters**
* **evt**: RTCEvents.LOCAL_USER_VIDEO_PUBLISHED
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### LOCAL_USER_VIDEO_UNPUBLISHED
```
on(RTCEvents.LOCAL_USER_VIDEO_UNPUBLISHED, cb: Function)
```
本地用户取消视频流发布

**Parameters**
* **evt**: RTCEvents.LOCAL_USER_VIDEO_UNPUBLISHED
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### LOCAL_USER_AUDIO_PUBLISHED
```
on(RTCEvents.LOCAL_USER_AUDIO_PUBLISHED, cb: Function)
```
本地用户音频流发布

**Parameters**
* **evt**: RTCEvents.LOCAL_USER_AUDIO_PUBLISHED
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### LOCAL_USER_AUDIO_UNPUBLISHED
```
on(RTCEvents.LOCAL_USER_AUDIO_UNPUBLISHED, cb: Function)
```
本地用户取消音频流发布

**Parameters**
* **evt**: RTCEvents.LOCAL_USER_AUDIO_UNPUBLISHED
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_STREAM_SUBSCRIBED
```
on(RTCEvents.REMOTE_STREAM_SUBSCRIBED, cb: Function)
```
订阅远端用户流

**Parameters**
* **evt**: RTCEvents.REMOTE_STREAM_SUBSCRIBED
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this

### REMOTE_STREAM_UNSUBSCRIBED
```
on(RTCEvents.REMOTE_STREAM_UNSUBSCRIBED, cb: Function)
```
取消订阅远端用户流

**Parameters**
* **evt**: RTCEvents.REMOTE_STREAM_UNSUBSCRIBED
* **cb**: function
  * (uid: Number): void  
    **Parameters**:
    * **uid**: Number  
      用户ID

    **Returns**: void

**Returns**: this
