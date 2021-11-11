# Lvb Electron SDK API Reference

Lvb Electron SDK是为 Electron 平台用户音视频及消息服务的开源 SDK。通过大学长开放平台自研RTC，RTM系统,为客户提供质量可靠的视频会议服务。
* [LvbEngine](#lvbengine)
* [RTCEngine](#rtcengine)
* [RTMEngine](#rtmengine)

## LvbEngine

| 方法              | 描述                |
| ---------------- | ------------------- |
| init             | 初始化LvbEngine      |
| join             | 加入LvbEngine        |
| createRTC        | 创建RTCEngine实例    |
| createRTCForTest | 创建RTCEngine测试实例 |
| createRTM        | 创建RTMEngine实例    |

## RTCEngine

### RTC管理
| 方法     | 描述             |
| ------- | ---------------- |
| init    | 初始化RTCEngine   |
| join    | 加入RTCEngine    |
| leave   | 离开RTCEngine    |
| destroy | 销毁RTCEngine实例 |

### 音视频流管理
| 方法                              | 描述                       |
| -------------------------------- | ------------------------- |
| publish2                         | 发布本地音视频流             |
| unpublish                        | 取消发布本地音视频流          |
| play                             | 播放本地或者远端视频流        |
| stopLocalPlay                    | 停止本地音视频流的播放        |
| subscribe                        | 订阅指定音视频流             |
| unsubscribe                      | 取消订阅指定视频流           |
| unsubscribeAll                   | 取消全部已经订阅的视频流      |
| startPreview                     | 开始本地视频流预览           |
| stopPreview                      | 停止本地视频流预览           |
| setAudio                         | 设置本地音频                |
| setVideo                         | 设置本地视频                |
| changeAllRemoteStreamsMuteState  | 设置全部远端用户的音视频流状态 |
| changeRemoteVideoStreamMuteState | 设置指定远端用户视频流的状态   |
| changeRemoteAudioStreamMuteState | 设置指定远端用户音频流的状态   |
| enableVirtualBackground          | 开启虚拟背景                | 
| setVideoMirrorMode               | 设置视频镜像模式             |

### 音视频设备管理
| 方法                       | 描述               |
| ------------------------- | ------------------ |
| getSpeakerDevices         | 获取全部扬声器设备    |
| getActiveSpeakerDevice    | 获取当前扬声器设备    |
| setActiveSpeakerDevice    | 设置当前扬声器设备    |
| setSpeakerVolume          | 设置当前扬声器音量    |
| getSpeakerVolume          | 获取当前扬声器音量    |
| startSpeakerTest          | 开始扬声器设备测试    |
| stopSpeakerTest           | 停止当前扬声器设备    |
| getMicrophoneDevices      | 获取全部麦克风设备    |
| getActiveMicrophoneDevice | 获取当前麦克风设备    |
| setActiveMicrophoneDevice | 设置当前麦克风设备    |
| getMicrophoneVolume       | 获取当前麦克风设备音量 |
| setMicrophoneVolume       | 设置当前麦克风设备音量 |
| startMicrophoneTest       | 开始麦克风设备测试    |
| stopMicrophoneTest        | 停止麦克风设备测试    |
| getCameraDevices          | 获取全部摄像头设备    |
| getActiveCameraDevice     | 获取当前摄像头设备    |
| setCameraDevice           | 设置当前摄像头设备    |
| startCameraTest           | 开始摄像头设备测试    |
| stopCameraTest            | 停止摄像头设备测试    |

### 共享管理
| 方法                     | 描述                      |
| ----------------------- | ------------------------- |
| createScreenShare       | 创建共享实例                |
| getScreenDisplaysInfo   | 获取当前可以共享的全部屏幕信息 |
| startShareScreen        | 开始共享屏幕                |
| getScreenWindowsInfo    | 获取当前可以共享的全部窗口信息 |
| startShareWindow        | 开始共享窗口                |
| stopScreenShare         | 停止共享                   |
| startScreenSharePreview | 开始播放共享预览             |
| stopScreenSharePreview  | 停止播放共享预览             |
| destroyScreenShare      | 销毁共享实例                |

## RTMEngine

### RTM管理

| 方法    | 描述             |
| ------ | --------------- |
| init   | RTM Engine初始化 |
| login  | RTM Engine登录   |
| logout | RTM Engine登出   |

### 房间管理

| 方法                          | 描述                           |
| ---------------------------- | ------------------------------ |
| join                         | 加入指定房间                     |
| leave                        | 离开指定房间                     |
| kickOut                      | 将用户踢出房间                   |
| stopRoom                     | 关闭房间                        |
| setRoomAttr                  | 设置房间属性                     |
| setRoomAttrs                 | 设置房间的多个属性                |
| setUserInitAttrs             | 当用户第一次登录设置用户属性        |
| setUserAttrs                 | 设置用户属性                     |
| requestSyncRoomAttrs         | 获取房间全部属性                  |
| requestSyncUsersAttrs        | 获取房间内所有用户的属性           |
| requestSyncUsersAttrsByRoles | 按照指定规则获取房间内所有用户的属性 |
| registerRTMCategory          | 注册房间通道分类                  |
| unregisterRTMCategory        | 注销房间通道分类                  |
| getCustomEventByCategory     | 获取指定分类的监听消息名称          |

### 消息发送
| 方法                     | 描述                         |
| ----------------------- | --------------------------- |
| sendMessageToRoomFromWS | 通过Websocket通道发送广播消息   |
| sendMessageToPeerFromWS | 通过Websocket通道发送点对点消息 |
| sendMessageToRoom       | 通过Rest api方式发送广播消息    |
| sendMessageToPeer       | 通过Rest api方式发送点对点消息  |
| sendMonitorData         | 向服务端发送监控数据            |
| on                      | 监听房间内的指定消息            |
