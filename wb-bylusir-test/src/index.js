/**
 * @author {张雯莉}({WB085724})
 * @version 0.0.1
 */
define(function(require) { // eslint-disable-line no-unused-vars
  var itemTpl = require('./item.jst.html');
  var LL = require('tbc/km-lazyload');
  var Xctrl = require('tbc/m-xctrl/1.1.2/index');

  function Mod() {
    this.init.apply(this, arguments);
  }

  $.extend(Mod.prototype, {
    /**
    * 入口
    * @param dom 模块根节点
    * @param conf 数据描述，为空说明已渲染
    */
    init: function(dom, conf) {
      var self = this;
      self._node = $(dom);
      // self.error可用于记录模块的异常 并且在jstracker平台查看 self.error('api错误')
      // 存在数据描述，异步渲染
      if (conf) {
        self.loadData(conf);
        //conf = $.parseJSON(self._node.find('.J_ModuleData').html());
       } 
       
       //self.loadData(conf);
       else {
         self.initLazyload();
      //   // 为空 绑定事件
      //   self.bindEvent();
       }
    },
    // 加载数据
    loadData: function(conf) { // eslint-disable-line no-unused-vars
      // XCtrl逻辑，参考文档：http://gitlab.alibaba-inc.com/tbc/market/blob/master/xctrl.md
      var self = this;
      var moduleinfo = conf.moduleinfo;
      var columns = 4;
      XCtrl.dynamic(conf, 'items', function (data) {
          console.log(data);
          self._node && self._node.find('.J_clothlist_details').html(itemTpl(data));
          self.initLazyload();
      //    // 数据处理，模板渲染
      //    S.log(data);
      //    // 模板完绑定事件
      //    self.bindEvent();
       });
    },
    initLazyload:function(){
        var self = this;
        self._node && self._node.find('.J_tb_lazyload').lazyload({offsetY: 100});
    },
    // 事件绑定
    bindEvent: function() {

    }
  });

  return Mod;

});
