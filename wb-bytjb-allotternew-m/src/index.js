/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */
define(function(require) { // eslint-disable-line no-unused-vars

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
      // self.error可用于记录模块的异常 并且在jstracker平台查看 self.error('api错误')
      // 存在数据描述，异步渲染
      if (conf) {
        self.loadData(conf);
      } else {
        // 为空 绑定事件
        self.bindEvent();
      }
    },
    // 加载数据
    loadData: function(conf) { // eslint-disable-line no-unused-vars
      // XCtrl逻辑，参考文档：http://gitlab.alibaba-inc.com/tbc/market/blob/master/xctrl.md
      // XCtrl.dynamic(conf, "items", function (data) {
      //    // 数据处理，模板渲染
      //    S.log(data);
      //    // 模板完绑定事件
      //    self.bindEvent();
      // });
    },
    // 事件绑定
    bindEvent: function() {

    }
  };

  return Mod;

});
