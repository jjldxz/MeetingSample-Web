# RTCEngine

## Index
### Constructors
* [Constructors](#constructor)

### Object Properties
* [rtcState](#rtcstate)
* [networkQuality](#networkquality)
* [clientState](#clientstate)
* [localVideoState](#localvideostate)
* [localAudioState](#localaudiostate)
* [remoteVideoState](#remotevideostate)
* [remoteAudioState](#remoteaudiostate)
* [appState](#appstate)

### Methods
* [init](#init)
* [join](#join)
* [leave](#leave)
* [destroy](#destroy)
* [publish2](#publish2)
* [unpublish](#unpublish)
* [play](#play)
* [stopLocalPlay](#stoplocalplay)
* [subscribe](#subscribe)
* [unsubscribe](#unsubscribe)
* [unsubscribeAll](#unsubscribeall)
* [startPreview](#startpreview)
* [stopPreview](#stoppreview)
* [setAudio](#setaudio)
* [setVideo](#setvideo)
* [changeAllRemoteStreamsMuteState](#changeallremotestreamsmutestate)
* [changeRemoteVideoStreamMuteState](#changeremotevideostreammutestate)
* [changeRemoteAudioStreamMuteState](#changeremoteaudiostreammutestate)
* [enableVirtualBackground](#enablevirtualbackground)
* [setVideoMirrorMode](#setvideomirrormode)
* [getSpeakerDevices](#getspeakerdevices)
* [getActiveSpeakerDevice](#getactivespeakerdevice)
* [setActiveSpeakerDevice](#setactivespeakerdevice)
* [setSpeakerVolume](#setspeakervolume)
* [getSpeakerVolume](#getspeakervolume)
* [startSpeakerTest](#startspeakertest)
* [stopSpeakerTest](#stopspeakertest)
* [getMicrophoneDevices](#getmicrophonedevices)
* [getActiveMicrophoneDevice](#getactivemicrophonedevice)
* [setActiveMicrophoneDevice](#setactivemicrophonedevice)
* [getMicrophoneVolume](#getmicrophonevolume)
* [setMicrophoneVolume](#setmicrophonevolume)
* [startMicrophoneTest](#startmicrophonetest)
* [stopMicrophoneTest](#stopmicrophonetest)
* [getCameraDevices](#getcameradevices)
* [getActiveCameraDevice](#getactivecameradevice)
* [setCameraDevice](#setcameradevice)
* [startCameraTest](#startcameratest)
* [stopCameraTest](#stopcameratest)
* [createScreenShare](#createscreenshare)
* [getScreenDisplaysInfo](#getscreendisplaysinfo)
* [startShareScreen](#startsharescreen)
* [getScreenWindowsInfo](#getscreenwindowsinfo)
* [startShareWindow](#startsharewindow)
* [stopScreenShare](#stopscreenshare)
* [startScreenSharePreview](#startscreensharepreview)
* [stopScreenSharePreview](#stopscreensharepreview)
* [destroyScreenShare](#destroyscreenshare)


## Constructors
### constructor
```
new RTCEngine:RTCEngine
    return RTCEngine
```

## Object Properties

### rtcState
```javascript
/*
本地流是否发布
0：未发布
1：已发布
 */
rtcState: Number

```

### networkQuality
```javascript
/*
上下行网络质量
upLinkQuality: Number - 上行网络质量
downLinkQuality: Number - 下行网络质量
  1: 'good',
  2: 'good',
  3: 'normal',
  4: 'normal',
  5: 'poor',
  6: 'poor'
 */
networkQuality: Object
```

### clientState
```javascript
/*
客户端通话相关的统计信息
rtt: Number - 客户端到本地路由器的往返时延 (ms)
duration: Number - 通话时长，单位为秒，累计值
recvBitrate: Number - 接收码率（Kbps），瞬时值
recvBytes: Number - 接收字节数（bytes），累计值
sendBitrate: Number - 发送码率（Kbps），瞬时值
sendBytes: Number - 发送字节数（bytes），累计值
userCount: Number - 当前频道内的人数
lastmileDelay: Number - 客户端到边缘服务器的网络延迟（毫秒）
 */
clientState: Object
```

### localVideoState
```javascript
/*
本地视频流状态
uid: Number - 用户ID
sentBitrate: Number - 实际发送码率 (Kbps)。 （Note: 不包含丢包后重传视频等的发送码率）
sentFrameRate: Number - 实际发送帧率 (fps)。 （Note: 不包含丢包后重传视频等的发送帧率）
targetBitrate: Number - 当前编码器的目标编码码率，单位为 Kbps，该码率为 SDK 根据当前网络状况预估的一个值
targetFrameRate: Number - 当前编码器的目标编码帧率，单位为 fps
width: Number - 视频编码宽度（px）
height: Number - 视频编码高度（px）
codecType: VP8 或 H264
 */
localVideoState: Object
```

### localAudioState
```javascript
/*
本地音频流状态
uid: Number - 用户ID
sampleRate: Number - 采样率
sentBitrate: Number - 实际发送码率 (Kbps)
numChannels: Number - 声道数
 */
localAudioState: Object
```

### remoteVideoState
```javascript
/*
远端用户视频流状态
uid: Number - 用户ID
decoderOutputFrameRate: number - 远端用户在加入频道后发生视频卡顿的累计时长占视频总有效时长的百分比 (%)。
视频有效时长指远端用户加入频道后视频未被停止发送或禁用的时长。
width: number - 视频宽度 (像素)
height: number - 视频高度 (像素)
packetLossRate: number - 远端视频在使用抗丢包技术之前的丢包率(%)
publishDuration: number - 远端视频流的累计发布时长（毫秒）
receivedBitrate: number - 上次统计后）接收到的码率 (Kbps)
rendererOutputFrameRate: number - 远端视频渲染器的输出帧率 (fps)
totalActiveTime: number - 视频有效时长（毫秒），即远端用户/主播加入频道后，既没有停止发送视频流，也没有禁用视频模块的通话时长
totalFrozenTime: number - 远端用户在加入频道后发生视频卡顿的累计时长 (ms)。
通话过程中，视频帧率设置不低于 5 fps 时，连续渲染的两帧视频之间间隔超过 500 ms，则记为一次视频卡顿
 */
remoteVideoState: Object
```

### remoteAudioState
```javascript
/*
远端用户音频流状态
uid: Number - 用户ID
audioLossRate: number - 统计周期内的远端音频流的丢帧率(%)
frozenRate: number - 远端用户在加入频道后发生音频卡顿的累计时长占音频总有效时长的百分比 (%)。
音频有效时长是指远端用户加入频道后音频未被停止发送或禁用的时长
jitterBufferDelay: number - 接收端到网络抖动缓冲的网络延迟（毫秒）
mosValue: number
networkTransportDelay: number - 音频发送端到接收端的网络延迟（毫秒）
numChannels: number - 声道数
publishDuration: number - 远端音频流的累计发布时长（毫秒）
qoeQuality: number - 接收远端音频时，本地用户的主观体验质量：
 0: 主观体验质量较好。
 1: 主观体验质量较差。
quality: number - 远端用户发送的音频流质量
qualityChangedReason: number - 接收远端音频时，本地用户主观体验质量较差的原因：
 0: 无原因，说明主观体验质量较好。
 1: 远端用户的网络较差。
 2: 本地用户的网络较差。
 4: 本地用户的 Wi-Fi 或者移动数据网络信号弱。
 8: 本地用户同时开启 Wi-Fi 和蓝牙，二者信号互相干扰，导致音频传输质量下降。
receivedBitrate: number - 接收流在统计周期内的平均码率（Kbps）
receivedSampleRate: number - 统计周期内接收到的远端音频采样率（Hz）
totalActiveTime: number - 音频有效时长（毫秒），即远端用户/主播加入频道后，既没有停止发送音频流，也没有禁用音频模块的通话时长
totalFrozenTime: number - 远端用户在加入频道后发生音频卡顿的累计时长 (ms)。
一个统计周期（2 秒）内，音频丢帧率达到 4% 即记为一次音频卡顿。
Agora 使用 2 秒为时间切片统计音频卡顿时间，因此音频卡顿时长 = totalFrozenTime = 音频卡顿次数 x 2 x 1000 (ms)
 */
remoteAudioState: Object
```

### appState
```javascript
/*
客户端应用状态
cpuAppUsage: Number - 当前应用的 CPU 使用率 (%)
cpuTotalUsage: Number - 当前系统的 CPU 使用率 (%), 
memoryAppUsageRatio: Number - 当前 App 的内存占比 (%). 该值仅作参考。受系统限制可能无法获取
memoryTotalUsageRatio: Number - 当前系统的内存占比 (%). 值仅作参考。受系统限制可能无法获取
 */
appState: Object
```

## Methods

### init
```
init(opts: Object): Void
```
初始化RTC Engine

**Parameters**
* opts: Object
  * token: Number - 认证token
  * appId: Number - app id 
  * roomId: Number - 房间ID
  * userId: Number - 用户ID
  * screenShare: Object - 共享所需要的信息
    * id: 共享所使用的ID
    * token: 共享所使用的token
  * rtcProfile: Number - RTC场景  
    * 0：（默认）通信
    * 1：直播
    * 2：游戏
  * autoSubscribe: Boolean - 是否自动订阅远端流
  * videoQuality: VideoQuality - 视频质量  
    * High
    * Medium
    * Low

**Return**  
异步函数，返回Promise对象

### join
```
join(): Void
```
加入Lvb Engine

**Parameters**
None

**Return**  
None


### leave
```
leave(): Void
```
离开Lvb Engine

**Parameters**
None

**Return**  
None

### destroy
```
destroy(): Void
```
销毁Lvb Engine实例

**Parameters**
None

**Return**  
None

### publish2
```
publish2(video: Boolean, audio: Boolean): Void
```
发布本地音视频流

**Parameters**
* video: Boolean  
  是否发布视频
* audio: Boolean  
  是否发布音频

**Return**  
None

### unpublish
```
unpublish(): Void
```
取消发布本地音视频流

**Parameters**
None

**Return**  
None

### play
```
play(domId: String, uid: Number): Void
```
播放本地或者远端视频流

**Parameters**
* domId: String  
  播放视频所需要的容器的HTMLElement ID
* uid: Number  
  用户ID

**Return**  
None

### stopLocalPlay
```
stopLocalPlay(): Void
```
停止本地音视频流的播放

**Parameters**
None

**Return**  
None

### subscribe
```
subscribe(uid: Number): Void
```
订阅指定音视频流

**Parameters**
* uid: Number  
  用户ID

**Return**  
None

### unsubscribe
```
unsubscribe(uid: Number): Void
```
取消订阅指定视频流

**Parameters**
* uid: Number  
  用户ID

**Return**  
None

### unsubscribeAll
```
unsubscribeAll(): Void
```
取消全部已经订阅的视频流

**Parameters**
None

**Return**  
None

### startPreview
```
startPreview(domId: String|Null): Void
```
开始本地视频流预览

**Parameters**
* domId: String|Null  
  播放视频所需要的容器的HTMLElement ID 

**Return**  
None

### stopPreview
```
stopPreview(): Void
```
停止本地视频流预览

**Parameters**
None

**Return**  
None

### setAudio
```
setAudio(state: Boolean): Void
```
设置本地音频

**Parameters**
* state: Boolean  
  关闭/打开音频

**Return**  
None

### setVideo
```
setVideo(state: Boolean): Void
```
设置本地视频

**Parameters**
* state: Boolean  
  关闭/打开视频

**Return**  
None

### changeAllRemoteStreamsMuteState
```
changeAllRemoteStreamsMuteState(mute: Boolean, opts: Object): Void
```
设置全部远端用户的音视频流状态

**Parameters**
* mute: Boolean  
  关闭/打开全部远端流
* opts: Object  
  * audio: Boolean - 是否关闭/打开音频
  * video: Boolean - 是否关闭/打开视频

**Return**  
None

### changeRemoteVideoStreamMuteState
```
changeRemoteVideoStreamMuteState(uid: Number, mute: Boolean): Void
```
设置指定远端用户视频流的状态

**Parameters**
* uid: Number  
  用户ID
* mute: Boolean  
  关闭/打开远端视频流

**Return**  
None

### changeRemoteAudioStreamMuteState
```
changeRemoteAudioStreamMuteState(uid: Number, mute: Boolean): Void
```
设置指定远端用户视频流的状态

**Parameters**
* uid: Number  
  用户ID
* mute: Boolean  
  关闭/打开远端音频流

**Return**  
None

### enableVirtualBackground
```
enableVirtualBackground(enabled: Boolean, type: Number, opts: Object): Void
```
开启虚拟背景

**Parameters**
* enabled: Boolean  
  打开/关闭虚拟背景
* type: Number  
  背景类型  
  * 0 - 纯色
  * 1 - 图片
* opts: Object  
  背景参数 
  * color: 背景颜色的Hex值(type = 0 时生效)
  * source: 背景图片地址(type = 1 时生效)

**Return**  
None

### setVideoMirrorMode
```
setVideoMirrorMode(flag: Number): Void
```
设置视频镜像模式

**Parameters**
* flag: Number  
  * 0: SDK自动设置镜像模式
  * 1: 打开镜像模式
  * 2: 关闭镜像模式

**Return**  
None

### getSpeakerDevices
```
getSpeakerDevices(): Array
```
获取全部扬声器设备

**Parameters**
None

**Return**  
返回扬声器设备信息列表

### getActiveSpeakerDevice
```
getActiveSpeakerDevice(): Object
```
获取当前扬声器设备

**Parameters**
None

**Return**  
返回当前扬声器设备信息

### setActiveSpeakerDevice
```
setActiveSpeakerDevice(deviceId: String|Number): Void
```
设置当前扬声器设备

**Parameters**
* deviceId: String|Number  
  设备ID

**Return**  
None

### setSpeakerVolume
```
setSpeakerVolume(vol: Number): Void
```
设置当前扬声器音量

**Parameters**
* vol: Number  
  音量

**Return**  
None

### getSpeakerVolume
```
getSpeakerVolume(): Number
```
获取当前扬声器音量

**Parameters**
None

**Return**  
扬声器音量

### startSpeakerTest
```
startSpeakerTest(filePath: String): Void
```
开始扬声器设备测试

**Parameters**
* filePath: String  
  测试需要的音频文件地址

**Return**  
None

### stopSpeakerTest
```
stopSpeakerTest(): Void
```
停止当前扬声器设备

**Parameters**
None

**Return**  
None

### getMicrophoneDevices
```
getMicrophoneDevices(): Array
```
获取全部麦克风设备

**Parameters**
None

**Return**  
麦克风设备列表

### getActiveMicrophoneDevice
```
getActiveMicrophoneDevice(): Object
```
获取当前麦克风设备

**Parameters**
None

**Return**  
当前麦克风设备信息

### setActiveMicrophoneDevice
```
setActiveMicrophoneDevice(deviceId: String|Number): Void
```
设置当前麦克风设备

**Parameters**
* deviceId: String|Number  
  设备ID

**Return**  
None

### getMicrophoneVolume
```
getMicrophoneVolume(): Number
```
获取当前麦克风设备音量

**Parameters**
None

**Return**  
当前麦克风音量

### setMicrophoneVolume
```
setMicrophoneVolume(vol: Numbver): Void
```
设置当前麦克风设备音量

**Parameters**
* vol: Number  
  音量

**Return**  
None

### startMicrophoneTest
```
startMicrophoneTest(): Void
```
开始麦克风设备测试

**Parameters**
None

**Return**  
None

### stopMicrophoneTest
```
stopMicrophoneTest(): Void
```
停止麦克风设备测试

**Parameters**
None

**Return**  
None

### getCameraDevices
```
getCameraDevices(): Array
```
获取全部摄像头设备

**Parameters**
None

**Return**  
摄像头设备信息列表

### getActiveCameraDevice
```
getActiveCameraDevice(): Object
```
获取当前摄像头设备

**Parameters**
None

**Return**  
当前摄像头设备信息

### setCameraDevice
```
setCameraDevice(deviceId: String|Number): Void
```
设置当前摄像头设备

**Parameters**
* deviceId: String|Number  
  设备ID

**Return**  
None

### startCameraTest
```
startCameraTest(): Void
```
开始摄像头设备测试

**Parameters**
None

**Return**  
None

### stopCameraTest
```
stopCameraTest(): Void
```
停止摄像头设备测试

**Parameters**
None

**Return**  
None

### createScreenShare
```
createScreenShare(): Void
```
创建共享实例

**Parameters**
None

**Return**  
None

### getScreenDisplaysInfo
```
getScreenDisplaysInfo(): Array
```
获取当前可以共享的全部屏幕信息

**Parameters**
None

**Return**  
当前可用的屏幕信息列表

### startShareScreen
```
startShareScreen(screenId: String|Number): Void
```
开始共享屏幕

**Parameters**
* screenId: String|Number  
  屏幕ID

**Return**  
None

### getScreenWindowsInfo
```
getScreenWindowsInfo(): Array
```
获取当前可以共享的全部窗口信息

**Parameters**
None

**Return**  
当前可用的窗口信息列表

### startShareWindow
```
startShareWindow(windowId: String|Number): Void
```
开始共享窗口

**Parameters**
* windowId: String|Number  
  窗口ID

**Return**  
None

### stopScreenShare
```
stopScreenShare(): Void
```
停止共享

**Parameters**
None

**Return**  
None

### startScreenSharePreview
```
startScreenSharePreview(domId: String): Void
```
开始播放共享预览

**Parameters**
* domId: String  
  播放容器的HTML Element ID

**Return**  
None

### stopScreenSharePreview
```
stopScreenSharePreview(): Void
```
停止播放共享预览

**Parameters**
None

**Return**  
None

### destroyScreenShare
```
destroyScreenShare(): Void
```
销毁共享实例

**Parameters**
None

**Return**  
None
