# 快速开始

## 实现视频直播

本文介绍如何使用 Lvb Electron SDK 实现基础的音视频直播功能。

## 前提条件

正式开始之前，请确保具备以下条件：

* 有效的【大学长开放平台】开发者账号。
* 可以获取 App ID 和临时 Token 的【大学长开放平台】项目。
* 可以连网的 Windows 或 macOS 电脑。如果你的网络环境部署了防火墙，请参考应用企业防火墙限制打开相关端口。
* Node.js 6.9.1 或更高版本。

## 创建 Electron 项目

在本地文件夹中为 Electron 项目新建一个目录，并在项目根目录下创建以下文件：

* package.json: 用于安装和管理项目依赖项。
* index.html：用于设计 app 的用户界面。
* main.js：主进程文件。
* renderer.js：渲染进程文件，用于实现与 Lvb Electron SDK 的交互。

## 实现音视频直播

本节将分步介绍如何在你的 Electron 项目中使用 Lvb Electron SDK 实现音视频直播。

### 1. 集成 SDK

参考如下步骤，使用 npm 或者 yarn 将 Lvb Electron SDK 集成到你的 Electron 项目：
```shell
npm install @jjldxz/lvb-electron
```
或者
```shell
yarn add @jjldxz/lvb-electron
```

### 2. 创建用户界面

将以下代码复制到 index.html 文件，创建一个只包含本地视频窗口和远端视频窗口的用户界面：
```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset="UTF-8">
  <title>Electron Quickstart</title>
</head>
<body>
  <h1>Electron Quickstart</h1>
  <!--在界面中添加本地视频窗口 -->
  <div id="join-channel-local-video"></div>
  <!--在界面中添加远端视频窗口 -->
  <div id="join-channel-remote-video"></div>
</body>
</html>
```

### 3. 设计主进程
将以下代码复制到 main.js 文件，实现基本的 Electron 项目主进程：
```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

// 如果使用 Electron 9.x 及以上版本，需要将 allowRendererProcessReuse 设为 false
app.allowRendererProcessReuse = false

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true
    }
  })

  // 加载 index.html 文件的内容
  mainWindow.loadFile('./index.html')
  // 开启开发者工具
  mainWindow.webContents.openDevTools()
}

// 管理 Electron 应用的浏览器窗口
app.whenReady().then(() => {
  createWindow()
  // 如果当前没有窗口打开，则新建一个窗口（适用于 macOS）
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 如果所有窗口都已关闭，则退出 Electron 应用（适用于 Windows）
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

### 4. 实现视频直播逻辑

在你的 Electron 项目里实现基础的视频直播功能，至少需要进行以下步骤：
1. 使用 new LvbEngine 创建 Lvb Electron SDK 实例
2. 使用 init 函数初始化 Lvb Electron SDK 实例
3. 使用 join 函数加入 Lvb Electron SDK 的音视频房间
5. 调用 createRTC 创建 RTC 实例用于实现音视频功能

你可以将如下代码复制到 renderer.js 文件，实现以上 API 的调用逻辑。复制时需要将 "Your App Key"、"Your token"、“Your channel” 分别替换为你的 App Key、临时 Token 和频道名，
```javascript
window.addEventListener('DOMContentLoaded',() => {
  const AgoraRtcEngine = require('agora-electron-sdk').default

  const LvbEngine = require('@jjldxz/lvb-electron')
  const os = require('os')
  const path = require('path')

  // 填入你的 App Key 
  const appKey = "Your App Key"
  // 填入你的 Token
  const token = "Your token"
  // 填入你要加入的 Room ID
  const roomId = 123
  // 填入你的 User ID
  const userId = 123  

  let lvbEngine = new LvbEngine()
  // 初始化 AgoraRtcEngine 实例
  lvbEngine.init({
    token,
    appKey,
    roomId,
    userId
  })
  
  lvbEngine.on(LvbEngine.RTCEvents.LOCAL_JOIN, (channel, userId) => {
    rtcClient.publish2(true /* enable video */, true /* enable audio */)
  })
  lvbEngine.on(LvbEngine.RTCEvents.REMOTE_USER_JOIN, (userId) => {
    rtcClient.subscribe(userId)
  })
  lvbEngine.on(LvbEngine.RTCEvents.REMOTE_STREAM_SUBSCRIBED, (userId) => {
    rtcClient.play('join-channel-remote-video', userId)
  })
  const rtcClient = null
  lvbEngine.join().then(_ => {
    rtcClient = lvbEngine.createRTC()
    return rtcClient.join()
  }).then(_ => {
    rtcClient.startPreview('join-channel-local-video')
  }).catch(console.error)
})
```

### 5. 运行项目
执行如下命令运行你的 Electron 项目：
```shell
npm start
```
或者
```shell
yarn start
```
项目成功运行后，你会看到一个自动弹出的窗口。如果设置了用户角色为主播，你可以在窗口中看到本地的视频画面。   
你还可以使用移动端端示例应用，加入同一频道与 Electron 端互通。成功互通后，主播可以看到自己和其他主播的视频，观众可以看到主播的视频。

## 后续步骤
为保障通信安全，在正式生产环境中，你需要在自己的 app 服务端生成 Token。详见使用 Token 鉴权。

