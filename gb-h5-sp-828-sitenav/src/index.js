/**
 * @author 化辰
 * @version 0.0.1
 */
define(function(require) { // eslint-disable-line no-unused-vars

  var kmModBasic = require('kg/km-mod-basic');
  var XCtrl = require('kg/xctrl');
  var siteNavWrap = require('./index.jst.html');

  var curPlace = window.location.href;

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
      this.getCurPlace();

      $('.module-wrap', container).prepend(siteNavWrap({
        curPlace: curPlace
      }));

      this.loadData(container, conf);

      this.bindEvent($('.sitenav-wrapper', container));
    },
    getCurPlace: function() {
      var curUrl = window.location.href;
      if (/\/24hr-global-livestreaming-+/.test(curUrl)) {
        curPlace = '分会场';
      } else if (/timetable/.test(curUrl)) {
        curPlace = '节目单';
      } else {
        curPlace = '主会场';
      }
    },
    loadData: function(container, conf) {
      conf = conf || $(container).find('.data').html();

      var self = this;

      if (conf) {
        XCtrl.dynamic(conf, 'notices', function(data) {
          var notices = data && data.notices;

          if (notices && notices.length > 0) {
            self.renderNotice(container, notices);
          } else {
            self.$container.find('.panel-notice').hide();
          }

        });
      }

    },
    renderNotice: function(container, notices) {

      var $panelNotice = $('.panel-notice', container);
      var $noticeUrl = $('.notice-url', container);
      var $noticeContent = $('.notice-content', $panelNotice);

      var rollNotice = function() {

        var randomIndex = Math.floor(Math.random() * notices.length);

        $noticeContent.text(notices[randomIndex].content);
        $noticeUrl.attr('href', notices[randomIndex].url);

        $panelNotice.addClass('slideShow');

        setTimeout(function() {
          $panelNotice.removeClass('slideShow');
        }, 20 * 1e3);

      };

      // 初始化文案信息，5秒后自动展示
      setTimeout(rollNotice, 5 * 1e3);

      // 60秒随机切换一下文案
      setTimeout(rollNotice, 60 * 1e3);

    },
    // 事件绑定
    bindEvent: function($wrapper) {
      // 10为750基线css中设定的边距
      var topSpace = 10 / 750 * window.screen.availWidth;
      var isTopFlag;
      if (curPlace !== '节目单') {
        var scrollFixed = kmModBasic.throttle(function() {
          if (window.scrollY >= topSpace) {
            if (isTopFlag !== false) {
              $wrapper.addClass('scroll-fixed');
              isTopFlag = false;
            }
          } else {
            if (isTopFlag !== true) {
              $wrapper.removeClass('scroll-fixed');
              isTopFlag = true;
            }
          }
        }, 'after', 150);
        $(document).on('scroll.sitenav', scrollFixed);
        // 初始化
        scrollFixed();
      }

      $('.btn-share').on('click', function() {

        // 监听渠道点击回调事件
        // 构造分享入参
        var params = {
          // 要分享的内容
          text: document.title,
          // 要分享的 URL
          url: window.location.href
        };
        // 调用分享接口，执行分享逻辑，注意回调函数有可能不会被执行！
        window.WindVane && window.WindVane.call('TBSharedModule', 'showSharedMenu', params);

      });

      // 返回按钮返回手淘首页
      $('.back-home').on('click', function() {
        window.WindVane.call('WVNative', 'nativeBack', {});
      });

      // 返回上一层
      $('.back-last').on('click', function() {
        window.WindVane.call('WebAppInterface', 'pop');
      });
    }
  };

  return Mod;

});
