var page = new Vue({
  el: 'body',
  data: {
    _DEBUG_: true,
    _HOST_: 'eshop.jerei.com',
    id: null,
    page: 0,
    pageSize: 10
  },
  created: function () {
    //vue初始化完成后执行的函数
    this.getUrl();
  },
  methods: {
    //自定义的方法
    getUrl: function () {
      this.url = urlParas(window.location.href.split('#')[0]);
      this._DEBUG_ = 'string' == typeof this.url.get('_debug') && (this.url.get('_debug') == 'true');
      if(this._DEBUG_){
          openDebug();
          var _console = mui.extend({},console);
          console.info = function(e){
              debug.log(e);
              _console.info(e);
          };
          console.warn = function(e){
              debug.warn(e);
              _console.warn(e);
          };
          console.error = function(e){
              debug.error(e);
              _console.error(e);
          };
      }
    }
  }
});
var tmpWidth = 750,
  windowWidth = window.screen.width;
var scale = tmpWidth / windowWidth;

/**
 * 异步json获取
 * @desc 封装mui.ajax,预留app验证接口
 * @param {String} url 接口地址
 * @param {Object} param 发送数据
 *
 * @param {Function} [success] 成功回调
 * @param {Function} [error] 错误回调
 */
function getJson(url, param, success, error) {
  loading.change(1);
  JSONP.get({
    url: 'http://' + page._data._HOST_ + vars.root + url,
    key: '_jsonp',
    value: 'jsonp' + Math.floor(Math.random() * 10000),
    data: {
      goodsId: 5,
      type: 'all',
      page: 1,
      pageSize: 10
    },
    success: function (res) {
      loading.change(-1);
      if ('function' == typeof success) {
        success(res);
      }
      if (!page._data._DEBUG_) {
        return;
      }
      /* eslint-disable no-alert, no-console */
      console.group('----接口数据----');
      console.info('send:' + JSON.stringify(param) + '\nto:' + url + '\nreturn:\n');
      console.groupCollapsed('jsonStr');
      console.log(JSON.stringify(res, null, 2));
      console.groupEnd();
      console.info(res);
      console.groupEnd();
      /* eslint-enable no-alert, no-console */
    },
    error: function (res) {
      loading.change(-1);
      if ('function' == typeof error) {
        error(res);
      }
      if (!page._data._DEBUG_) {
        return;
      }
      /* eslint-disable no-alert, no-console */
      console.group('----接口数据----');
      console.warn('send:' + JSON.stringify(param) + '\nto:' + url + '\nreturn:\n');
      console.groupCollapsed('jsonStr');
      console.log(JSON.stringify(res, null, 2));
      console.groupEnd();
      console.warn(res);
      console.groupEnd();
      /* eslint-enable no-alert, no-console */

    }
  });
}


/**
 * 错误图片/替换图片样式模板
 * @desc 自定义皮肤
 * @param {String} mall 自定义皮肤名称
 * @param {String} bg 背景颜色
 * @param {String} fg 字体颜色
 * @param {Number} size 字号
 * @param {String} fontweight 字体加粗程度
 * @param {String} align 对齐（查阅资料说是并不是很好用，也不建议用，不配置默认居中就好）
 */
Holder.addTheme('mall', {
  bg: '#f0f0f0',
  fg: '#f0f0f0',
  size: 12,
  //font: 'Arial',
  fontweight: 'normal',
  align: 'center'
});

/**
 * 错误图片替换
 * @param size 图片宽高
 */
function errorImg(size) {
  var img = event.srcElement;
  img.setAttribute('data-oldSrc', img.getAttribute('src'));
  img.setAttribute('data-src', 'holder.js/' + size + '?theme=mall');
  img.onerror = null;
  Holder.run();
}

// 瀑布流的错误图片替换
function _errorImg(size) {
  var arr = size.split('x');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(arr[i] / scale);
  }
  var halfSize = arr.join('x');
  errorImg(halfSize);
}


function imgFormat(url, format, isZip, notForTpl) {
  format = format ? format : '.640x640.png';
  if (format.indexOf('.') != 0) {
    format = '.' + format;
  }
  if ('boolean' == typeof isZip && !isZip) {
    url = vars.root + '/upload/' + url;
  } else {
    url = vars.root + '/upload/' + url + format;
  }
  // 直接返回url
  if (!!notForTpl && notForTpl) {
    return url;
  }

  // TODO:更好的外部方案不在这拼字符串
  // 拼接错误图片替换


  var size = format.split('.')[1];
  var arr = size.split('x');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(arr[i] / scale);
  }
  var halfSize = arr.join('x');
  var str = url + '';
  ' + ';
  onerror = 'errorImg(\'' + halfSize + '\')';
  //if(isLazy){
  //    //str = vars.theme.root + '/images/placeholder.png' data-lazyload='' + str;
  //    str = '' data-lazyload='' + str;
  //}
  return str;
}


/**
 * 通用初始化代码
 */

function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + '=' + escape(value) +
    ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + ';path=/';
}
//取回cookie
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + '=');
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(';', c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
}

/**
 * 处理页面跳转
 * @desc muiApp新建webview（需配置host），微信或浏览器location.href
 * @param {String} href
 * @param {Boolean} [cantBack] true 禁止页面返回，替换url
 * @example toNewPage('http://www.baidu.com')
 */
function toNewPage(href, cantBack) {
  if (!href || href.indexOf('#') == 0 || href.indexOf('javascript') == 0) {
    return;
  }
  // if (href.indexOf('http') != 0) {
    //for APP
    // href = 'http://192.168.191.1:8080' + href;
  // }
  var bottom = 0;
  cantBack = cantBack ? cantBack : false;
  if (cantBack) {
    location.replace(href);
  } else {
    //ios增加返回强制刷新标志
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      var hisStateArr = href.split('/');
      var hisState = hisStateArr[hisStateArr.length - 1];
      var url = page.url.set({
        reload: 'true'
      });
      history.replaceState(hisState, '', url);
    }
    mui.openWindow({
      id: window.location.href,
      url: href,
      styles: {
        top: 0, //新页面顶部位置
        bottom: bottom //新页面底部位置
      },
      show: {
        autoShow: true, //页面loaded事件发生后自动显示，默认为true
        aniShow: 'pop-in' //页面显示动画，默认为”slide-in-right“；
      },
      waiting: {
        autoShow: true, //自动显示等待框，默认为true
        title: '正在加载...' //等待对话框上显示的提示内容
      }
    });
  }
}

/**
 * 价格转换浮点型
 * @param {String} s 格式化价格文本
 * @return {Number}
 */
function rmoney(s) {
  return parseFloat(s.replace(/[^\d\.-]/g, ''));
}
/**
 * 根据组件名称返回数据
 * @param widgetName 组件中文名
 * @param {Function} [success] 成功回调函数（返回data）
 * @param {Function} [error] 出错回调
 */
function getWidgetData(widgetName, success, error) {
  getJson('/comm/widget/doSearchWidgetData.do', { widgetName: widgetName }, success, error);
}

/**
 * 内容超出自动扩展（textarea）
 * @param {String} selector jsDOM
 */
function autoGrow(selector) {
  if (oField.scrollHeight > oField.clientHeight) {
    oField.style.height = oField.scrollHeight + 'px';
  }
}


/**
 * 清空重置上拉加载
 * @param {String} selector
 */
function reloadPull(selector) {
  var el = '#pullrefresh';
  if (selector) {
    el = selector;
  }
  mui(el).pullRefresh().refresh(true);
  mui(el).pullRefresh().scrollTo(0, 0);
  mui(el).pullRefresh().pullupLoading();
}
/**
 * 页面顶部进度条展示方法
 * @type {{_num: null, change: Function, check: Function, done: Function, ing: Function}}
 * @desc {Object} _num 判断进度条显示状态  change 改变进度条状态  check 检查进度条状态  done 进度条隐藏  ing 进度条显示
 */
var loading = {
  _num: null,
  change: function (num) {
    if ('number' == typeof num) {
      if (0 < num) {
        this.ing();
      }
      if (this._num == null) {
        this._num = 0;
      }
      this._num = this._num + num;
      this.check();
    } else {
      if ($.isNumeric(num)) {
        this.change(parseInt(num));
      }
    }
  },
  check: function () {
    if (this._num == null) {
      return;
    }
    this._num = 0 < this._num ? this._num : 0;
    if (0 == this._num) {
      this.done();
    }
  },
  done: function () {
    mui('body').progressbar().hide();
    mui('body').off('touchstart.loading');
  },
  ing: function () {
    mui('body').progressbar().show();
    mui('body').on('touchstart.loading', function () {
      mui.toast('数据载入中，客官等下嘛~');
    });
  }

};

mui.ready(function () {
  if ('object' == typeof includeFooterPage) {
    // 购物车数量
    checkLogin(function () {
      if (page.logined) {
        getJson('/mbr/doSelCartSize.do', {}, function (data) {
          // console.log(data);
          if (data.data.cartSize) {
            $('.footer .mui-badge').text(data.data.cartSize).show();
          }
        });
      }
    });


    (function setCurSelect(mui) {
      var urlStr = location.href;
      urlStr = urlStr.split('?')[0];
      var urlArr = urlStr.split('/');
      urlStr = urlArr[urlArr.length - 1].split('.')[0];
      var curPage = '';
      $.each(includeFooterPage, function (i, o) {
        var id = o.id;
        var page = o.page;
        if ($.inArray(urlStr, page) > -1) {
          curPage = id;
          return false;
        }
      });
      mui('#footer a[data-id=' + curPage + ']').addClass('mui-active');
    })(mui);
    mui('#footer').on('touchstart', 'a', function () {
      toNewPage(this.href);
    });
  }


});
//
if (window.localStorage) {
  var local = {
    _dur: 0,
    /**
     * 存储数据
     * @param key 关键字
     * @param [val] 值，为空则删除
     * @param [dur] 缓存周期，单位：小时，默认不限制
     */
    set: function (key, val, dur) {
      if (!val) {
        localStorage.removeItem(key);
      }
      dur = 'number' == typeof dur ? dur * 60 * 60 * 1000 : this._dur * 60 * 60 * 1000;
      val = $.extend({ data: val }, { _t: Date.parse(new Date()), _d: dur });
      localStorage[key] = JSON.stringify(val);
    },
    get: function (key) {
      var value = localStorage[key] ? JSON.parse(localStorage[key]) : {};
      if (!value.data) {
        return value;
      }
      var endTime = value._t + value._d;
      if (0 == value._d || Date.parse(new Date()) <= endTime) {
        return value.data;
      } else {
        return {};
      }
    }
  };
}


/**
 * 格式化时间
 * @param date
 * @param format
 * @returns {XML|string|void}
 */
function dateFormat(date, format) {
  if (date.indexOf('-') != -1) {
    date.replace('-', '/').replace('-', '/');
  }
  //兼容ios
  var arr = date.split(/[- : \/]/);
  // console.log(arr);
  date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
  var map = {
    'M': date.getMonth() + 1, //月份
    'd': date.getDate(), //日
    'h': date.getHours(), //小时
    'm': date.getMinutes(), //分
    's': date.getSeconds(), //秒
    'q': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  };
  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });
  return format;
}
/**
 * 格式化金额
 * @param num
 * @param [format]
 * @returns {*}
 */
function moneyFormat(num, format) {
  format = format ? format : 0;
  if (format == 0) {
    return num;
  }
  format = format > 0 && format <= 20 ? format : 2;
  num = parseFloat((num + '').replace(/[^\d\.-]/g, '')).toFixed(format) + '';
  var l = num.split('.')[0].split('').reverse(),
    r = num.split('.')[1];
  var t = '';
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
  }
  return t.split('').reverse().join('') + '.' + r;
}

function toUri(str) {
  str = str.toString() == str ? str.toString() : '';
  if (Base64.extendString) {
    Base64.extendString();
    return str.toBase64URI();
  }
}

function fromUri(str) {
  if (Base64.extendString) {
    Base64.extendString();
    return str.fromBase64();
  }
}
/**
 * 判断登录
 * @param toLogin    如果未登录，是否进入登录页面
 * @param callback   登录后的回调函数
 */
function checkLogin(toLogin, callback) {
  var argLen = arguments.length;
  //判断第一个参数类型
  if (arguments.length == 1 && 'function' == typeof toLogin) {
    callback = toLogin;
    toLogin = 0;
  }
  //判断是否有callback
  if ('function' != typeof callback) {
    callback = mui.noop;
  }
  var curUrl = location.href;
  //未登录过
  if ('boolean' != typeof page.logined || page.logined == false) {
    getJson('/comm/login/doCheck.do', {
      curUrl: curUrl
    }, function (data) {
      page.logined = data.data.login;
      if (!data.data.url) {
        //因登录状态未在前台保存，从后台返回数据判断当前登录状态
        callback();
        return;
      }
      if (toLogin || !argLen) {
        //不传参数或者需要跳登录页
        toNewPage(data.data.url);
      } else {
        callback();
      }

    });
  } else if (page.logined) {
    // 登录过
    callback();
  }
}



//初始化图片lazyload
var lazyLoad = mui(window).imageLazyload({
  placeholder: vars.theme.root + '/resources/images/placeholder.png',
  destroy: false
});