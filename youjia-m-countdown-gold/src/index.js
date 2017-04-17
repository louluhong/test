/**
 * @author 文郑
 * @version 0.0.1
 */
define(function(require) { // eslint-disable-line no-unused-vars

  var mtop = require('mtb/lib-mtop');
  var middleware = require('mtb/lib-mtop/middleware');
  var login = require('mtb/lib-login');
  var Toast = require('kg/km-toast');

  var countdownTpl = require('./countdown.jst.html');

  // var XCtrl = require('kg/xctrl');
  function Mod() {
    this.init.apply(this, arguments);
  }

  Mod.prototype = {
    /**
    * 入口
    * @param dom 模块根节点
    * @param conf 数据描述，为空说明已渲染
    */
    init: function(container, conf) {
      var self = this;
      self.$container = $(container);
      self.$wrap = self.$container.find('.module-wrap');
      // self.error可用于记录模块的异常 并且在jstracker平台查看 self.error('api错误')
      // 存在数据描述，异步渲染
      //if (conf) {
      //  self.loadData(conf);
      //} else {
      //  // 为空 绑定事件
      //  self.bindEvent();
      //}

      self.pageUrl = '//' + window.location.hostname + window.location.pathname;

      // test
      //self.pageUrl += '2';



      if (window.location.search.indexOf('lingjinbi=1') !== -1 || window.location.host.indexOf('127.0.0.1') !== -1) {

        self.request({
          ecode: 0,
          api: 'mtop.taobao.youjia.wireless.service.getTaskAward',
          data: {
            urls: self.pageUrl
          },
          successCallback: function(response) {

            if (response.code == 0 && response.status[0].value == 'true' || window.location.search.indexOf('debug=1') !== -1) {
              self.$wrap.html(countdownTpl());
              self.bindEvent();
            }
          },
          errorCallback: function(err) {
            console.log(err);
          }
        });

      }

    },
    // 加载数据
    loadData: function(conf) { // eslint-disable-line no-unused-vars
      // var self = this;
      // XCtrl逻辑，参考文档：http://yongyi.alidemo.cn/xctrl-doc/_book/use/how.html
      // XCtrl.dynamic({
      //   data: conf,
      //   key: "products",
      //   callback: function(data){
      //    //数据处理，模板渲染
      //    S.log(data);
      //    //模板完绑定事件
      //    self.bindEvent();
      //   }
      // });
    },
    // 事件绑定
    bindEvent: function() {
      var self = this;

      var breakFlag = false;

      $(window).on('click', function() {
        if (!breakFlag && !self.getGoldIng) {
          breakFlag = true;
          new Toast('淘金币领取任务中断~', 5000);
          self.$container.remove();
        }
      });

      setTimeout(function() {
        if (!breakFlag) {
          self.getGold();
        }
      }, 5000);
    },
    getGold: function() {

      var self = this;

      self.getGoldIng = true;

      self.$wrap.addClass('loading');
      this.request({
        ecode: 0,
        api: 'mtop.taobao.youjia.wireless.service.doRewardGold',
        data: {
          url: self.pageUrl,
          sceneIndex: 2
        },
        successCallback: function(response) {
          self.$wrap.removeClass('loading');
          if (response.code == 0) {
            self.$wrap.addClass('done');
          } else {
            self.$wrap.addClass('fail');
            if (response.code == -1) {
              new Toast('很抱歉!淘金币领取失败,刷新一下试试吧~', 5000);
            } else {
              response.msg && new Toast(response.msg, 5000);
            }
          }
          setTimeout(function() {
            self.$container.remove();
          }, 3000);

        },
        errorCallback: function(err) {
          new Toast('很抱歉!淘金币领取失败,刷新一下试试吧~', 5000);
          self.$container.remove();
        }
      });
    },
    request : function(cfg) {

      if (!cfg || !lib || !lib.mtop || !lib.mtop) return;
      if (typeof cfg.successCallback != 'function') return;

      //cfg.debug = 1;

      function error(response, retType) {
        retType = retType || response.retType;

        var msg = cfg.ERROR_TIPS || '亲，网络似乎有问题，请重试';
        var duration = 3000;

        if (response.data && response.data.code === '-808' && lib && lib.login && lib.login.goLogin) {
          lib.login.goLogin(function(status) {
            window.location.reload();
          });
        }

        if (retType === 2 && lib && lib.login && lib.login.goLogin) {
          lib.login.goLogin(function(status) {
            window.location.reload();
          });
        }

        //if (cfg.debug && response && response.ret && response.ret[0]){
        if (response && response.ret && response.ret[0]) {
          msg = response.ret[0].replace(/.+::/, '');
        }

        if (response.data && response.data.msg) {
          msg = response.data.msg;
        }

        new Toast(msg, duration);

        setTimeout(function() {

          if (typeof cfg.errorCallback == 'function')
            cfg.errorCallback();

        }, duration);

      }

      function success(response, retType) {

        //console.log(response, retType);
        retType = retType || response.retType;

        if (retType === 0) {

          if (response && response.data) {
            cfg.successCallback(response.data);
          }

        } else {

          error(response, retType);

        }

      }

      var request = cfg.requestMethod || lib.mtop.loginRequest;
      var api = cfg.api;
      var v = cfg.v || '1.0';
      var data = cfg.data || {};
      var type = cfg.type || 'get';
      var timeout = cfg.timeout || 20000;
      var dataType = cfg.dataType || 'jsonp';
      var maxRetryTimes = cfg.maxRetryTimes || 5;
      var ecode = 1; //对于mtopajax无影响，对于手淘直接调用nativeapi的话，必须与设置相匹配
      var isSec = 0;

      if (typeof cfg.ecode !== 'undefined') ecode = cfg.ecode;
      if (typeof cfg.isSec !== 'undefined') isSec = cfg.isSec;

      request({
        api: api,
        v: v,
        data : data,
        type : type,
        timeout : timeout,
        dataType : dataType,
        maxRetryTimes : maxRetryTimes,
        isSec : isSec,
        ecode : ecode
      }, success, error);

    }
  };

  return Mod;

});
