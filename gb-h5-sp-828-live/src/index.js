/**
 * @author 化辰
 * @version 0.0.1
 */
define(function(require) { // eslint-disable-line no-unused-vars

  require('kg/km-lazyload');
  var kmModBasic = require('kg/km-mod-basic');

  // feed模板
  var feedTpl = require('./feed.jst.html');

  function Mod() {
    this.init.apply(this, arguments);
  }

  Mod.prototype = {

    init: function(container, conf) {
      this.loadData();
      this.bindEvent($(container));
    },
    loadData: function() {
      if (!kmModBasic.cache.get('isFeedDataRequest')) {
        kmModBasic.cache.set('isFeedDataRequest', 1);
        // 聚合请求
        var $modFeed = $('.module-wrap', '.gb-h5-sp-828-live');
        var feedPageNum = kmModBasic.cache.get('feedPageNum') || 1;

        kmModBasic
          .mtop('mtop.taobao.globalbuys.video.live.list:35640', {
            pageNum: feedPageNum,
            timeZone: $modFeed.data('time-zone')
          })
          .then(function(rs) {
            $modFeed.trigger('mod:feedDataReceive', rs);

            // 当前页数
            kmModBasic.cache.set('feedPageNum', ++feedPageNum);

            // 是否有更多，如果没有更多，则接触滚动加载绑定
            if (!rs.data.hasMore) {
              $(window).off('scroll.feed');
            }
          });
          // .catch(function(e) {
          //   alert(JSON.stringify(e));
          // });
      }
    },
    // 事件绑定
    bindEvent: function($el) {
      var self = this;
      var $wrapper = $el.children('.module-wrap');

      $wrapper.on('mod:feedDataReceive', function(e, rs) {
        var $feed = $(this);

        // 初始化ID
        var id = $feed.data('id');
        if (!id) {
          id = kmModBasic.uniqueId('feed');
          $feed.data('id', id);
        }

        // 没有值或0则无限制
        var size = $feed.data('size') || 0;

        var feedCount = kmModBasic.cache.get('feedCount_' + id) || 0;

        // 如果没有限制或者当前feed数量小于设置值
        if (size == 0 || feedCount < size) {
          var videoList = rs.data.videoList;
          var dataCount = videoList.length;

          // 需要的feed数量
          var needCount = size == 0 ? dataCount : size - feedCount;

          if (dataCount > 0 && needCount > 0) {
            var feedHTML = feedTpl({
              videoList: videoList.splice(0, needCount)
            });
            $feed.children('.feed-list').append(feedHTML);

            /*------------------------------------------------------------*/
            // 现有feed数量加上最终渲染的feed数量
            kmModBasic.cache.set('feedCount_' + id, feedCount + Math.min(
              needCount, dataCount));

            // 请求状态回置
            kmModBasic.cache.set('isFeedDataRequest', 0);

            // 绑定lazyload
            $('.J_lazyload', $feed).lazyload({
              maxNum: 120,
              autoWebp: true,
              autoAnim: false
            });

            // 导航滚动过的节目数量监测
            if (!kmModBasic.cache.get('isSetNavScrollFeedPage') && rs.data.totalSize) {
              // 触发导航总数事件，每页10条定死了
              $(document).trigger('mod:navScrollFeedPage', [rs.data.totalSize]);
              kmModBasic.cache.set('isSetNavScrollFeedPage', 1);
            }
            $(document).trigger('mod:navScrollPin');
          }

        }

      });

      /*------------------------------------------------------------*/

      (function() {
        var $win = $(window);
        var wh = $(window).height();
        var $body = $('body');

        $(window).on('scroll.feed',
          kmModBasic.throttle(function() {
            if (window.scrollY + wh >= $body.height() - wh / 2) {

              // 载入新的数据
              self.loadData();

            }
          }, 'after', 60)
        );

      }());

      /*------------------------------------------------------------*/
    }
  };

  return Mod;

});
