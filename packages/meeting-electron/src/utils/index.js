import moment from 'moment-timezone'
import { TIME_ZONE } from '../common'
import { remote } from 'electron'
import os from 'os'
import child_process from 'child_process'

export function formatMeetingID(meetingID) {
  let tmp = meetingID.toString().split('')
  let ret = []
  for (const i in tmp) {
    ret.push(tmp[i])
    const idx = Number(i) + 1
    if (idx % 3 === 0 && idx !== tmp.length) {
      ret.push(' ')
    }
  }
  ret = ret.join('')
  return ret
}

export function dateIsBeforeCurrent(time) {
  const current = moment.utc().tz(TIME_ZONE)
  // return current.isAfter(moment.utc(time).tz(TIME_ZONE))
  return moment.utc(time).tz(TIME_ZONE).isBefore(current)
}

export function formatDate(date, split, join) {
  if (!date) return null
  const [month, day, year] = date.split(split)
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join(join)
}

export function getTimes() {
  return [
    '00:00',
    '00:30',
    '01:00',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30'
  ]
}

export function getTimeStr(time, type) {
  let chflag = ['AM', 'PM']
  type ? (chflag = ['上午', '下午']) : ''
  let timeToStr = {
    '00:00': `00:00 ${chflag[0]}`,
    '00:30': `00:30 ${chflag[0]}`,
    '01:00': `1:00 ${chflag[0]}`,
    '01:30': `1:30 ${chflag[0]}`,
    '02:00': `2:00 ${chflag[0]}`,
    '02:30': `2:30 ${chflag[0]}`,
    '03:00': `3:00 ${chflag[0]}`,
    '03:30': `3:30 ${chflag[0]}`,
    '04:00': `4:00 ${chflag[0]}`,
    '04:30': `4:30 ${chflag[0]}`,
    '05:00': `5:00 ${chflag[0]}`,
    '05:30': `5:30 ${chflag[0]}`,
    '06:00': `6:00 ${chflag[0]}`,
    '06:30': `6:30 ${chflag[0]}`,
    '07:00': `7:00 ${chflag[0]}`,
    '07:30': `7:30 ${chflag[0]}`,
    '08:00': `8:00 ${chflag[0]}`,
    '08:30': `8:30 ${chflag[0]}`,
    '09:00': `9:00 ${chflag[0]}`,
    '09:30': `9:30 ${chflag[0]}`,
    '10:00': `10:00 ${chflag[0]}`,
    '10:30': `10:30 ${chflag[0]}`,
    '11:00': `11:00 ${chflag[0]}`,
    '11:30': `11:30 ${chflag[0]}`,
    '12:00': `12:00 ${chflag[1]}`,
    '12:30': `12:30 ${chflag[1]}`,
    '13:00': `1:00 ${chflag[1]}`,
    '13:30': `1:30 ${chflag[1]}`,
    '14:00': `2:00 ${chflag[1]}`,
    '14:30': `2:30 ${chflag[1]}`,
    '15:00': `3:00 ${chflag[1]}`,
    '15:30': `3:30 ${chflag[1]}`,
    '16:00': `4:00 ${chflag[1]}`,
    '16:30': `4:30 ${chflag[1]}`,
    '17:00': `5:00 ${chflag[1]}`,
    '17:30': `5:30 ${chflag[1]}`,
    '18:00': `6:00 ${chflag[1]}`,
    '18:30': `6:30 ${chflag[1]}`,
    '19:00': `7:00 ${chflag[1]}`,
    '19:30': `7:30 ${chflag[1]}`,
    '20:00': `8:00 ${chflag[1]}`,
    '20:30': `8:30 ${chflag[1]}`,
    '21:00': `9:00 ${chflag[1]}`,
    '21:30': `9:30 ${chflag[1]}`,
    '22:00': `10:00 ${chflag[1]}`,
    '22:30': `10:30 ${chflag[1]}`,
    '23:00': `11:00 ${chflag[1]}`,
    '23:30': `11:30 ${chflag[1]}`
  }
  return timeToStr[time]
}

export async function checkCameraDevice() {
  return new Promise((resolve, reject) => {
    if (!remote.systemPreferences.getMediaAccessStatus) {
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(resolve)
        .catch(reject)
    } else {
      const status = remote.systemPreferences.getMediaAccessStatus('camera')
      status === 'granted' ? resolve() : reject(`camera access is ${status}`)
    }
  })
}

export async function checkMicrophoneDevice() {
  return new Promise((resolve, reject) => {
    if (remote.systemPreferences.getMediaAccessStatus) {
      const status = remote.systemPreferences.getMediaAccessStatus('microphone')
      status === 'granted' ? resolve() : reject(`microphone access ${status}`)
    } else {
      resolve()
    }
  })
}

export async function checkScreenDevice() {
  return new Promise((resolve, reject) => {
    if (remote.systemPreferences.getMediaAccessStatus) {
      const status = remote.systemPreferences.getMediaAccessStatus('screen')
      status === 'granted' ? resolve() : reject(`microphone access ${status}`)
    } else {
      resolve()
    }
  })
}

export function pySort(info) {
  let rankArr = []
  // 数字0开头
  let zeroArr = info.filter((ele, index) => {
    if (Number(ele.name.substr(0, 1)) === 0) {
      return !isNaN(Number(ele.name.substr(0, 1)))
    }
  })
  // 数字0开头排序
  zeroArr = zeroArr.sort((a, b) => {
    // return parseInt(a.name) - parseInt(b.name)
    return a.name.replace(/[^0-9]/gi, '') - b.name.replace(/[^0-9]/gi, '')
  })
  rankArr = zeroArr
  // 数字非0开头
  let numArr = info.filter((ele, index) => {
    if (Number(ele.name.substr(0, 1)) !== 0) {
      return !isNaN(Number(ele.name.substr(0, 1)))
    }
  })
  // 数字非0开头排序
  numArr = numArr.sort((a, b) => {
    return a.name.replace(/[^0-9]/gi, '') - b.name.replace(/[^0-9]/gi, '')
  })
  // 汉字开头
  let reg = new RegExp('^[\u4e00-\u9fa5]')
  let wordArr = info.filter((ele, index) => {
    return reg.test(ele.name.substr(0, 1))
  })
  // 汉字开头排序
  wordArr = wordArr.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  // 大写字母开头
  let regUpper = /^[A-Z]+$/
  let upperArr = info.filter((ele, index) => {
    return regUpper.test(ele.name.substr(0, 1))
  })
  // 大写字母开头排序
  upperArr = upperArr.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  // 剩余其他的开头
  let otherArr = info.filter((ele, index) => {
    return (
      isNaN(Number(ele.name.substr(0, 1))) &&
      !reg.test(ele.name.substr(0, 1)) &&
      !regUpper.test(ele.name.substr(0, 1))
    )
  })
  // 剩余其他的开头排序
  otherArr = otherArr.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  info = rankArr
  info = info.concat(numArr, wordArr, upperArr, otherArr)
  return info
}

export function checkMeetingAlive() {
  return window.ipc.sendSync('check-meeting-alive')
}

export function readImage(target) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = (e) => {
      resolve(e.currentTarget.result)
    }
    reader.onerror = (e) => {
      reject(e)
    }
    reader.readAsDataURL(
      new Blob([target.buffer], {
        type: 'image/png'
      })
    )
  })
}

export function createInvitationMessage(meetingInfo, inviteOwnerName, i18n) {
  const innerFormatDate = (date) => {
    if (!date) return ''
    let locale = i18n.lang.current === 'zhHans'
    const dateZone = moment.utc(date).tz(TIME_ZONE)
    let timeStr = null
    const zone = 'GMT' + moment(dateZone).tz(TIME_ZONE).format('Z')
    if (locale) {
      timeStr = dateZone.format('YYYY年MM月DD日 h:mm A ')

      timeStr = timeStr.replace('AM', '上午')
      timeStr = timeStr.replace('PM', '下午')
    } else {
      // Jun 2, 2021 03:00 PM
      timeStr = dateZone.format('MMM D, YYYY h:mm A')
    }
    return timeStr + zone
  }

  const inviteOwner = inviteOwnerName || ''
  let copyInvitationContent = `${inviteOwner} ${i18n.lang.t(
    '$vuetify.meeting.invitesMeeting'
  )} \n\n ${i18n.lang.t('$vuetify.meeting.topic')}${meetingInfo.name} \n ${i18n.lang.t(
    '$vuetify.meeting.time'
  )}${innerFormatDate(meetingInfo.beginAt)} \n\n ${i18n.lang.t(
    '$vuetify.meeting.inviteAddMeeting'
  )} \n\n ${i18n.lang.t('$vuetify.meeting.inviteMeetingId')}${formatMeetingID(
    meetingInfo.number
  )}`
  if (meetingInfo.password) {
    copyInvitationContent += `\n ${i18n.lang.t('$vuetify.meeting.invitePasscode')}${
      meetingInfo.password
    }`
  }
  return copyInvitationContent
}

export function getSystemLocaleForMac() {
  return new Promise((resolve, reject) => {
    if (process.platform !== 'darwin') return reject()
    runExec('defaults read -g AppleLocale')
      .then((locale) => {
        let ret = null
        switch (locale.trim()) {
          case 'zh':
          case 'zh_CN':
            ret = 'zhHans'
            break
          case 'en':
          case 'en_CN':
          case 'en_AU':
          case 'en_CA':
          case 'en_US':
          case 'en_GB':
          case 'en_NZ':
          case 'en_ZA':
          default:
            ret = 'en'
            break
        }
        resolve(ret)
      })
      .catch(reject)
  })
}

export function getSystemLocale(locale = null) {
  let ret
  !locale && (locale = remote.app.getLocale())
  switch (locale) {
    case 'zh':
    case 'zh-CN':
      ret = 'zhHans'
      break
    case 'en':
    case 'en-AU':
    case 'en-CA':
    case 'en-US':
    case 'en-GB':
    case 'en-NZ':
    case 'en-ZA':
    default:
      ret = 'en'
      break
  }
  return ret
}

export function getSystemInfo() {
  return new Promise((resolve) => {
    const locale = getSystemLocale()
    const platform = os.platform()
    if (platform === 'darwin') {
      const getOsName = () => {
        return new Promise((resolve, reject) => {
          const process = child_process.exec('sw_vers -productName')
          process.stdout.on('data', (data) => {
            resolve(data)
          })
          process.stderr.on('error', (err) => {
            reject(err)
          })
        })
      }
      const getOsVersion = () => {
        return new Promise((resolve, reject) => {
          const process = child_process.exec('sw_vers -productVersion')
          process.stdout.on('data', (data) => {
            resolve(data)
          })
          process.stderr.on('error', (err) => {
            reject(err)
          })
        })
      }
      Promise.all([getOsName(), getOsVersion()])
        .then((resp) => {
          resolve({
            device: 'pc',
            os: resp[0].Trim(),
            language: locale,
            osVersion: resp[1].Trim(),
            cpu: os.cpus()[0].model
          })
        })
        .catch(() => {
          resolve({
            device: 'pc',
            os: os.platform(),
            language: locale,
            osVersion: os.release(),
            cpu: os.cpus()[0].model
          })
        })
    } else {
      resolve({
        device: 'pc',
        os: os.platform(),
        language: this.locale,
        osVersion: os.release(),
        cpu: os.cpus()[0].model
      })
    }
  })
}
