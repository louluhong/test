/* eslint no-unused-vars:0 */
/* eslint indent:0 */
/* global lib:true */

/**
 * @author 文郑
 * @version 0.0.1
 */
define(function(require) { // eslint-disable-line no-unused-vars

  var VERSION = '3.11.5';

  var mtop = require('mtb/lib-mtop');
  var middleware = require('mtb/lib-mtop/middleware');
  var lazyload = require('kg/km-lazyload');
  var login = require('mtb/lib-login');
  var Toast = require('kg/km-toast');
  var ASSETS_URL = '//g.alicdn.com/tb/m-youjia/' + VERSION + '/p/card-tpl/index.js';
  if (window.location.host.indexOf('m.taobao.com') === -1) {
    ASSETS_URL = '//g-assets.daily.taobao.net/tb/m-youjia/' + VERSION + '/p/card-tpl/index.js';
  }

  var DATA_COUNT = 0;
  var MAX_TOTAL_COUNT = Infinity; // 数据展现上限条数

  function Mod(container, conf) {
    var self = this;
    var args = arguments;
    this.$container = $('.module-wrap', container);
    this.$box = this.$container;
    this.conf = this.$container.find('.J_dynamic_data').val();
    if (this.conf) {
      this.conf = JSON.parse(this.conf);
    }

    if (+this.conf.moduleinfo.totalCount) {
      MAX_TOTAL_COUNT = +this.conf.moduleinfo.totalCount;
    }

    $.getScript(ASSETS_URL, function() {
      self.init.apply(self, args);
    });
  }
  Mod.prototype = {
    /**
     * 入口
     * @param dom 模块根节点
     * @param conf 数据描述，为空说明已渲染
     */
    init: function(container, conf) {
      var self = this;
      this.pagination = {};
      this.cardTpl = new window.M_YOUJIA.CARD_TPL();
      // this.request = this.cardTpl.request;
      // this.openWindow = this.cardTpl.openWindow;
      if (this.conf.moduleinfo.disableAutoLoad !== true && this.conf.moduleinfo.disableAutoLoad !== 'true') {
        this.getData({}, function(data) {
          self.render(data);
          self.bindEvent();
        });
      } else {
        self.bindEvent();
        $(window).trigger('citySelect:moduleReady');
      }
    },
    // 加载数据
    getData: function(option, successCallback, errorCallback) { // eslint-disable-line no-unused-vars
      // XCtrl逻辑，参考文档：http://gitlab.alibaba-inc.com/tbc/market/blob/master/xctrl.md
      // XCtrl.dynamic(conf, "items", function (data) {
      //    // 数据处理，模板渲染
      //    S.log(data);
      //    // 模板完绑定事件
      //    self.bindEvent();
      // });
      var self = this;
      if (!option) return;
      option.currentPage = option.currentPage || 1;
      if (option.currentPage > +self.pagination.totalPage || DATA_COUNT >= MAX_TOTAL_COUNT) {
        return;
      }
      self.ISLOADDINGDATA = true;
      self.$box.append('<div class="m-loading"><em class="m-icon-logo-g"></em><span>奋力为您挑选中...</span></div>');
      var param;
      try {
        param = JSON.parse(this.conf.moduleinfo.param);
      } catch (err) {
        param = {};
      }
      if (this.conf.moduleinfo.biztypeSeq) {
        param.biztypeSeq = this.conf.moduleinfo.biztypeSeq;
      }
      if (this.conf.moduleinfo.catIds) {
        param.catIds = this.conf.moduleinfo.catIds;
      }
      if (this.conf.moduleinfo.syoujiaBizType) {
        param.syoujiaBizType = this.conf.moduleinfo.syoujiaBizType;
      }
      if (this.cityCode) {
        param.queryJsonProps = {
          '区域编码': '' + this.cityCode
        };
      }
      param = $.merge({
        fmt: 'data',
        // pageSize: PAGESIZE,
        _input_charset: 'utf-8',
        _input_charset: 'utf-8',
        currentPage: option.currentPage
      }, param);
      if (this.isMobile()) {
        this.request({
          ecode: 0,
          api: this.conf.moduleinfo.api,
          data: {
            callType: this.conf.moduleinfo.url,
            jsonData: JSON.stringify(param)
          },
          successCallback: function(response) {
            // alert(JSON.stringify(response));
            succFn(response);
          },
          errorCallback: function(err) {
            errFn(err);
          }
        });
      } else {
        $.ajax({
          url: '//youjia.taobao.com' + this.conf.moduleinfo.url,
          data: param,
          dataType: 'jsonp',
          success: function(response) {
            succFn(response);
          },
          error: function(err) {
            errFn(err);
          }
        });
      }

      function succFn(data) {
        self.ISLOADDINGDATA = false;
        self.$box.find('.m-loading').remove();
        self.pagination = data.pagination || {};
        data.contentList = data.contentList;
        if (typeof successCallback === 'function') {
          successCallback(data);
        }
      }

      function errFn(err) {
        self.ISLOADDINGDATA = false;
        self.$box.find('.m-loading').remove();
        console.error('接口和服务器私奔了~', err);
      }
    },
    // 事件绑定
    bindEvent: function() {
      var self = this;
      var $win = $(window);
      var winH = $win.height();
      self.$container.on('tap click', 'a', function(evt) {
        evt.preventDefault();
        if (evt.type === 'click') {
          return;
        }
        var $target = $(evt.currentTarget);
        var $parent = $target.parents('.tpl');
        if (window.goldlog) {
          var pageUrl = window.location.origin + window.location.pathname;
          var biztype = $parent.attr('data-biztype');
          var id = $parent.attr('data-id');
          var hash = $parent.attr('data-hash');
          if (biztype) {
            window.goldlog.record('/youjia.9.' + biztype, '', 'biztype=' + biztype + '&id=' + id, hash);
          }
        }
        setTimeout(function() {
          self.openWindow($target.attr('href'), $target);
        }, 200);
      });
      $win.on('touchstart scroll', function() {
        if (self.ISLOADDINGDATA) {
          return;
        }
        var t = $win.scrollTop();
        var $items = self.$box.find('.tpl');
        var length = $items.length;
        var page;
        if (length && $items.eq(length - 1).offset().top < t + winH * 1.5) {
          page = +self.pagination.current + 1;
          self.getData({
            currentPage: page
          }, function(data) {
            if (self.pagination.current == self.pagination.totalPage) {
              self.cityCode = null;
              self.pagination.current = 0;
            }
            self.render(data, true);
          });
        }
      });
      $win.on('citySelect:setCity', function(ev) {
        var cityObj = ev._args;
        
        if (cityObj.cityCode) {
          self.cityCode = cityObj.cityCode;
          self.getData({}, function(data) {
            if (data.contentList.length === 0) {
              self.cityCode = null;
              self.getData({}, function(data) {
                self.render(data);
              });
            } else {
              if (self.pagination.current == self.pagination.totalPage) {
                self.cityCode = null;
                self.pagination.current = 0;
              }
              self.render(data);
            }
          });
        }
      });
    },
    render: function(data, isAppend) {
      var list;
      if (data.labelsList && data.labelsList.length) {
        list = data.contentList.concat({
          item_biztype: '0',
          labels: data.labelsList
        });
      } else {
        list = data.contentList;
      }
      this.$container.find('.m-loading').remove();

      if (DATA_COUNT + list.length > MAX_TOTAL_COUNT) {
        list.splice(list.length - (DATA_COUNT + list.length - MAX_TOTAL_COUNT));
      }

      var dom = this.cardTpl.render(list);

      DATA_COUNT += list.length;

      if (isAppend) {
        this.$container.append(dom);
      } else {
        this.$container.html(dom); 
      }
      this.$container.find('.J_Lazyload').lazyload({     
        autoAnim: false
      });
    },
    isMobile: function() {
      var host = window.location.host;
      var regx = /(waptest|wapa|m)\.taobao\.com/;
      return regx.test(host);
    },
    request: function(cfg) {
      if (!cfg || !window.lib || !window.lib.mtop || !window.lib.mtop) return;
      if (typeof cfg.successCallback != 'function') return;
      // cfg.debug = 1;
      function error(response, retType) {
        retType = retType || response.retType;
        var msg = cfg.ERROR_TIPS || '亲，网络似乎有问题，请重试';
        var duration = 3000;
        if (retType === 2 && window.lib && window.lib.login && window.lib.login.goLogin) {
          window.lib.login.goLogin(function(status) {
            console.log(status);
          });
        }
        // if (cfg.debug && response && response.ret && response.ret[0]){
        if (response && response.ret && response.ret[0]) {
          msg = response.ret[0].replace(/.+::/, '');
        }
        if (response.data && response.data.msg) {
          msg = response.data.msg;
        }
        new Toast(msg, duration);
        setTimeout(function() {
          if (typeof cfg.errorCallback == 'function') cfg.errorCallback();
        }, duration);
      }

      function success(response, retType) {
        retType = retType || response.retType;
        if (retType === 0) {
          if (response && response.data) {
            cfg.successCallback(response.data);
          }
        } else {
          error(response, retType);
        }
      }
      var request = cfg.requestMethod || window.lib.mtop.loginRequest;
      var api = cfg.api;
      var v = cfg.v || '1.0';
      var data = cfg.data || {};
      var type = cfg.type || 'get';
      var timeout = cfg.timeout || 20000;
      var dataType = cfg.dataType || 'jsonp';
      var maxRetryTimes = cfg.maxRetryTimes || 5;
      var ecode = 1; // 对于mtopajax无影响，对于手淘直接调用nativeapi的话，必须与设置相匹配
      var isSec = 0;
      if (typeof cfg.ecode !== 'undefined') ecode = cfg.ecode;
      if (typeof cfg.isSec !== 'undefined') isSec = cfg.isSec;
      request({
        api: api,
        v: v,
        data: data,
        type: type,
        timeout: timeout,
        dataType: dataType,
        maxRetryTimes: maxRetryTimes,
        isSec: isSec,
        ecode: ecode
      }, success, error);
    },
    openWindow: function(url, $target, popBeforeOpen) {
      var spmParam;
      var spm;
      if (window.g_SPM && $target && $target.length) {
        if (window.g_SPM.spm) {
          spm = window.g_SPM.spm($target[0]);
        } else {
          spmParam = window.g_SPM.getParam($target[0]);
          spm = [];
          $.each(spmParam, function(v) {
            spm.push(v);
          });
          spm = spm.join('.');
        }
        if (url.indexOf('?') !== -1) {
          url += '&spm=' + spm;
        } else {
          url += '?spm=' + spm;
        }
      };

      if (url.indexOf('http') == -1) {
        url = window.location.protocol + url;
      };

      var params = {
        url: url,
        popBeforeOpen: popBeforeOpen || false
      };
      if (!window.navigator.userAgent.match(/WindVane/i)) {
        window.location.href = url;
        return;
      }
      window.lib.windvane.call('Base', 'openWindow', params, function() {}, function() {
        window.location.href = url;
      });
    }
  };
  return Mod;
});
