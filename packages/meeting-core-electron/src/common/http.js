import axios from 'axios'

export default class Http {
  constructor() {
    this._authToken = null
    this._refreshToken = null
    this._isRefreshing = false
    this._requests = []
    this._axios = axios.create({
      baseURL: `${process.env.HTTP_BACKEND_URL}/${
        process.env.API_PREFIX ? process.env.API_PREFIX : ''
      }`,
      timeout: 5000
    })
    this._setup()
  }

  _setup() {
    this._axios.defaults.validateStatus = function validateStatus(status) {
      //=>自定义成功失败规则：RESOLVE / REJECT（默认规则：状态码以2开头算作成功）
      return /^(2|3)\d{2}$/.test(status)
    }
    this._axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
    this._axios.defaults.responseType = 'json'
    this._axios.interceptors.response.use(
      (res) => {
        console.debug(`${res.config.url}:${res.config.method}`, res.data)
        return res.data
      },
      (error) => {
        if (!error.response) return Promise.reject(error)
        if (error.response.status === 401) {
          return this._onRefreshToken(error.config)
        } else {
          const rejectData = error.response.data ? error.response.data : error.response
          return Promise.reject(rejectData)
        }
      }
    )
  }

  _onRefreshToken(requestConfig) {
    if (!this._isRefreshing) {
      this._isRefreshing = true
      this.post('/common/refresh_token/', { refreshToken: this._refreshToken }, false)
        .then((resp) => {
          console.warn('_onRefreshToken:', resp)
          this.setAuthToken(resp.token)
          requestConfig.headers['Authorization'] = this._authToken
          this._requests.map((cb) => cb())
          this._requests = []
          this._isRefreshing = false
          return this._axios(requestConfig)
        })
        .catch((e) => {
          console.error('_onRefreshToken:', e)
          this._requests = []
          this._isRefreshing = false
          return Promise.reject(e)
        })
    } else {
      return new Promise((resolve) => {
        this._requests.push(() => {
          requestConfig.headers['Authorization'] = this._authToken
          resolve(this._axios(requestConfig))
        })
      })
    }
  }

  setApiBaseURL(url) {
    if (!url) return
    this._axios.defaults.baseURL = `${url}/${
      process.env.API_PREFIX ? process.env.API_PREFIX : ''
    }`
  }

  setAuthToken(token) {
    if (!token) return
    this._authToken = `Bearer ${token}`
  }

  setRefreshToken(token) {
    if (!token) return
    this._refreshToken = token
  }

  post(url, data = {}, needToken = true) {
    return needToken
      ? this._axios.post(url, data, {
          headers: {
            Authorization: this._authToken
          }
        })
      : this._axios.post(url, data)
  }

  get(url, needToken = true) {
    return needToken
      ? this._axios.get(url, {
          headers: {
            Authorization: this._authToken
          }
        })
      : this._axios.get(url)
  }
}
