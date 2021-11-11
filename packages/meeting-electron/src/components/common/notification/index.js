export default function (
  opts = { title: '', body: '', silent: false, timeoutType: 'default', onClick: null }
) {
  const title = opts.hasOwnProperty('title') ? opts.title : ''
  const body = opts.hasOwnProperty('body') ? opts.body : ''
  const silent = opts.hasOwnProperty('silent') ? opts.silent : false
  const timeoutType = opts.hasOwnProperty('timeoutType') ? opts.timeoutType : 'default'
  let notification = new Notification(title, {
    body,
    // false有声音，true没声音
    silent,
    // 通知的超时持续时间 'default' or 'never'
    timeoutType
  })

  notification.onclick = (e) => {
    if (opts.hasOwnProperty('onClick') && typeof opts.onClick === 'function') {
      opts.onClick(e)
    }
  }

  return notification
}
