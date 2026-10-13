'v4.1.5 Geetest Inc.'
;(function (window) {
  'use strict'
  if (typeof window === 'undefined') {
    throw new TypeError('Geetest requires browser environment')
  }

  const document = window.document
  const Math = window.Math
  const head = document.getElementsByTagName('head')[0]
  const TIMEOUT = 10000

  function _Object(obj) {
    this._obj = obj
  }

  _Object.prototype = {
    _each(process) {
      const _obj = this._obj
      for (const k in _obj) {
        if (_obj.hasOwnProperty(k)) {
          process(k, _obj[k])
        }
      }
      return this
    },
    _extend(obj) {
      const self = this
      new _Object(obj)._each(function (key, value) {
        self._obj[key] = value
      })
    },
  }

  const uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  function Config(config) {
    const self = this
    new _Object(config)._each(function (key, value) {
      self[key] = value
    })
  }

  Config.prototype = {
    apiServers: ['gcaptcha4.geetest.com', 'gcaptcha4.geevisit.com', 'gcaptcha4.gsensebot.com'],
    staticServers: ['static.geetest.com', 'static.geevisit.com', 'dn-staticdown.qbox.me'],
    protocol: 'http://',
    typePath: '/load',
    fallback_config: {
      bypass: {
        staticServers: ['static.geetest.com', 'static.geevisit.com', 'dn-staticdown.qbox.me'],
        type: 'bypass',
        bypass: '/v4/bypass.js',
      },
    },
    _get_fallback_config() {
      const self = this
      if (isString(self.type)) {
        return self.fallback_config[self.type]
      } else {
        return self.fallback_config.bypass
      }
    },
    _extend(obj) {
      const self = this
      new _Object(obj)._each(function (key, value) {
        self[key] = value
      })
    },
  }
  const isNumber = function (value) {
    return typeof value === 'number'
  }
  var isString = function (value) {
    return typeof value === 'string'
  }
  const isBoolean = function (value) {
    return typeof value === 'boolean'
  }
  const isObject = function (value) {
    return typeof value === 'object' && value !== null
  }
  const isFunction = function (value) {
    return typeof value === 'function'
  }
  const MOBILE = /Mobi/i.test(navigator.userAgent)

  const callbacks = {}
  const status = {}

  const random = function () {
    return parseInt(Math.random() * 10000) + new Date().valueOf()
  }

  // bind ๅฝๆ•ฐpolify, ไธๅธฆnewๅ่ฝ็bind

  const bind = function (target, context) {
    if (typeof target !== 'function') {
      return
    }
    const args = Array.prototype.slice.call(arguments, 2)

    if (Function.prototype.bind) {
      return target.bind(context, args)
    } else {
      return function () {
        const _args = Array.prototype.slice.call(arguments)
        return target.apply(context, args.concat(_args))
      }
    }
  }

  const toString = Object.prototype.toString

  const _isFunction = function (obj) {
    return typeof obj === 'function'
  }
  const _isObject = function (obj) {
    return obj === Object(obj)
  }
  const _isArray = function (obj) {
    return toString.call(obj) === '[object Array]'
  }
  const _isDate = function (obj) {
    return toString.call(obj) === '[object Date]'
  }
  const _isRegExp = function (obj) {
    return toString.call(obj) === '[object RegExp]'
  }
  const _isBoolean = function (obj) {
    return toString.call(obj) === '[object Boolean]'
  }

  function resolveKey(input) {
    return input.replace(/(\S)(_([a-zA-Z]))/g, function (match, $1, $2, $3) {
      return $1 + $3.toUpperCase() || ''
    })
  }

  function camelizeKeys(input, convert) {
    if (!_isObject(input) || _isDate(input) || _isRegExp(input) || _isBoolean(input) || _isFunction(input)) {
      return convert ? resolveKey(input) : input
    }

    if (_isArray(input)) {
      var temp = []
      for (let i = 0; i < input.length; i++) {
        temp.push(camelizeKeys(input[i]))
      }
    } else {
      var temp = {}
      for (const prop in input) {
        if (input.hasOwnProperty(prop)) {
          temp[camelizeKeys(prop, true)] = camelizeKeys(input[prop])
        }
      }
    }
    return temp
  }

  const loadScript = function (url, cb, timeout) {
    const script = document.createElement('script')
    script.charset = 'UTF-8'
    script.async = true

    // ๅฏนgeetest็้ๆ€่ตๆบๆทปๅ  crossOrigin
    if (/static\.geetest\.com/g.test(url)) {
      script.crossOrigin = 'anonymous'
    }

    script.onerror = function () {
      cb(true)
      // ้”่ฏฏ่งฆๅ‘ไบ๏ผ่ถ…ๆ—ถ้€ป่พ‘ๅฐฑไธ็”จไบ
      loaded = true
    }
    var loaded = false
    script.onload = script.onreadystatechange = function () {
      if (!loaded && (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete')) {
        loaded = true
        setTimeout(function () {
          cb(false)
        }, 0)
      }
    }
    script.src = url
    head.appendChild(script)

    setTimeout(function () {
      if (!loaded) {
        script.onerror = script.onload = null
        script.remove && script.remove()
        cb(true)
      }
    }, timeout || TIMEOUT)
  }

  const normalizeDomain = function (domain) {
    // special domain: uems.sysu.edu.cn/jwxt/geetest/
    // return domain.replace(/^https?:\/\/|\/.*$/g, ''); uems.sysu.edu.cn
    return domain.replace(/^https?:\/\/|\/$/g, '') // uems.sysu.edu.cn/jwxt/geetest
  }
  const normalizePath = function (path) {
    path = path.replace(/\/+/g, '/')
    if (path.indexOf('/') !== 0) {
      path = '/' + path
    }
    return path
  }
  const normalizeQuery = function (query) {
    if (!query) {
      return ''
    }
    let q = '?'
    new _Object(query)._each(function (key, value) {
      if (isString(value) || isNumber(value) || isBoolean(value)) {
        q = q + encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&'
      }
    })
    if (q === '?') {
      q = ''
    }
    return q.replace(/&$/, '')
  }
  const makeURL = function (protocol, domain, path, query) {
    domain = normalizeDomain(domain)

    let url = normalizePath(path) + normalizeQuery(query)
    if (domain) {
      url = protocol + domain + url
    }

    return url
  }

  const load = function (config, protocol, domains, path, query, cb, handleCb) {
    var tryRequest = function (at) {
      if (handleCb) {
        var cbName = 'geetest_' + random()
        // ้€่ฆไธ้ขๅ…ๅฎไนๅฅฝcbnameๅๆ•ฐ๏ผๅ ้คๅฏน่ฑก
        window[cbName] = bind(handleCb, null, cbName)
        query.callback = cbName
      }
      const url = makeURL(protocol, domains[at], path, query)
      loadScript(
        url,
        function (err) {
          if (err) {
            if (cbName) {
              try {
                window[cbName] = function () {
                  window[cbName] = null
                }
              } catch (e) {}
            }

            if (at >= domains.length - 1) {
              cb(true)
              // report gettype error
            } else {
              tryRequest(at + 1)
            }
          } else {
            cb(false)
          }
        },
        config.timeout
      )
    }
    tryRequest(0)
  }

  const jsonp = function (domains, path, config, callback) {
    const handleCb = function (cbName, data) {
      // ไฟ่ฏๅชๆง่กไธ€ๆฌก๏ผๅ…จ้จ่ถ…ๆ—ถ็ๆ…ๅตไธไธไผๅ่งฆๅ‘;

      if (data.status == 'success') {
        callback(data.data)
      } else if (!data.status) {
        callback(data)
      } else {
        // ๆฅๅฃๆ่ฟ”ๅ๏ผไฝๆฏ่ฟ”ๅไบ้”่ฏฏ็ถๆ€๏ผ่ฟๅ…ฅๆฅ้”้€ป่พ‘
        callback(data)
      }
      window[cbName] = undefined
      try {
        delete window[cbName]
      } catch (e) {}
    }
    load(
      config,
      config.protocol,
      domains,
      path,
      {
        captcha_id: config.captchaId,
        challenge: config.challenge || uuid(),
        client_type: MOBILE ? 'h5' : 'web',
        risk_type: config.riskType,
        user_info: config.userInfo,
        call_type: config.callType,
        lang: config.language
          ? config.language
          : navigator.appName === 'Netscape'
          ? navigator.language.toLowerCase()
          : navigator.userLanguage.toLowerCase(),
      },
      function (err) {
        // ็ฝ‘็ป้—ฎ้ขๆฅๅฃๆฒกๆ่ฟ”ๅ๏ผ็ดๆฅไฝฟ็”จๆฌๅฐ้ช่ฏ็ ๏ผ่ตฐๅฎ•ๆบๆจกๅผ
        // ่ฟ้ๅฏไปฅๆทปๅ ็”จๆท็้€ป่พ‘
        if (err && typeof config.offlineCb === 'function') {
          // ๆง่ก่ชๅทฑ็ๅฎ•ๆบ
          config.offlineCb()
          return
        }

        if (err) {
          callback(config._get_fallback_config())
        }
      },
      handleCb
    )
  }

  var reportError = function (config, url) {
    load(
      config,
      config.protocol,
      ['monitor.geetest.com'],
      '/monitor/send',
      {
        time: Date.now().getTime(),
        captcha_id: config.gt,
        challenge: config.challenge,
        exception_url: url,
        error_code: config.error_code,
      },
      function (err) {}
    )
  }

  const throwError = function (errorType, config, errObj) {
    const errors = {
      networkError: '网络错误',
      gtTypeError: 'gt字段不是字符串类型',
    }
    if (typeof config.onError === 'function') {
      config.onError({
        desc: errObj.desc,
        msg: errObj.msg,
        code: errObj.code,
      })
    } else {
      throw new TypeError(errors[errorType])
    }
  }

  const detect = function () {
    return window.Geetest || document.getElementById('gt_lib')
  }

  if (detect()) {
    status.slide = 'loaded'
  }
  const GeetestIsLoad = function (fname) {
    let GeetestIsLoad = false
    const tags = { js: 'script', css: 'link' }
    const tagname = tags[fname.split('.').pop()]
    if (tagname !== undefined) {
      const elts = document.getElementsByTagName(tagname)
      for (const i in elts) {
        if (
          (elts[i].href && elts[i].href.toString().indexOf(fname) > 0) ||
          (elts[i].src && elts[i].src.toString().indexOf(fname) > 0)
        ) {
          GeetestIsLoad = true
        }
      }
    }
    return GeetestIsLoad
  }
  window.initGeetest4 = function (userConfig, callback) {
    const config = new Config(userConfig)
    if (userConfig.https) {
      config.protocol = 'https://'
    } else if (!userConfig.protocol) {
      config.protocol = window.location.protocol + '//'
    }

    if (isObject(userConfig.getType)) {
      config._extend(userConfig.getType)
    }

    jsonp(config.apiServers, config.typePath, config, function (newConfig) {
      // ้”่ฏฏๆ•่ท๏ผ็ฌฌไธ€ไธชload่ฏทๆฑๅฏ่ฝ็ดๆฅๆฅ้”
      var newConfig = camelizeKeys(newConfig)

      if (newConfig.status === 'error') {
        return throwError('networkError', config, newConfig)
      }

      const type = newConfig.type

      if (config.debug) {
        new _Object(newConfig)._extend(config.debug)
      }
      const init = function () {
        config._extend(newConfig)
        callback(new window.Geetest4(config))
      }

      callbacks[type] = callbacks[type] || []

      const s = status[type] || 'init'
      if (s === 'init') {
        status[type] = 'loading'

        callbacks[type].push(init)

        if (newConfig.gctPath) {
          load(
            config,
            config.protocol,
            Object.hasOwnProperty.call(config, 'staticServers')
              ? config.staticServers
              : newConfig.staticServers || config.staticServers,
            newConfig.gctPath,
            null,
            function (err) {
              if (err) {
                throwError('networkError', config, {
                  code: '60205',
                  msg: 'Network failure',
                  desc: {
                    detail: 'gct resource load timeout',
                  },
                })
              }
            }
          )
        }

        load(
          config,
          config.protocol,
          Object.hasOwnProperty.call(config, 'staticServers')
            ? config.staticServers
            : newConfig.staticServers || config.staticServers,
          newConfig.bypass || newConfig.staticPath + newConfig.js,
          null,
          function (err) {
            if (err) {
              status[type] = 'fail'
              throwError('networkError', config, {
                code: '60204',
                msg: 'Network failure',
                desc: {
                  detail: 'js resource load timeout',
                },
              })
            } else {
              status[type] = 'loaded'
              const cbs = callbacks[type]
              for (let i = 0, len = cbs.length; i < len; i = i + 1) {
                const cb = cbs[i]
                if (isFunction(cb)) {
                  cb()
                }
              }
              callbacks[type] = []
            }
          }
        )
      } else if (s === 'loaded') {
        // ๅคๆ–ญgctๆฏๅฆ้€่ฆ้ๆ–ฐๅ ่ฝฝ
        if (!GeetestIsLoad(newConfig.gctPath)) {
          load(
            config,
            config.protocol,
            Object.hasOwnProperty.call(config, 'staticServers')
              ? config.staticServers
              : newConfig.staticServers || config.staticServers,
            newConfig.gctPath,
            null,
            function (err) {
              if (err) {
                throwError('networkError', config, {
                  code: '60205',
                  msg: 'Network failure',
                  desc: {
                    detail: 'gct resource load timeout',
                  },
                })
              }
            }
          )
        }
        return init()
      } else if (s === 'fail') {
        throwError('networkError', config, {
          code: '60204',
          msg: 'Network failure',
          desc: {
            detail: 'js resource load timeout',
          },
        })
      } else if (s === 'loading') {
        callbacks[type].push(init)
      }
    })
  }
})(window)
