/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */

KISSY.add(function(S, require) {

    var Node = require('node'),
        $=Node.all,
        XTemplate = require('tms/xtemplate'),
        XCtrl = require('market/xctrl'),
        itemTmpl = require("./item1-xtpl"),
        JSON = require('json'),
        DataLazyload = require('kg/datalazyload/6.0.5/index');

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
        self._node = Node.one(container); //代表当前这个模块的父级
        conf = conf || JSON.parse(self._node.one(".J_conf").val());
        self.conf = conf;
        self.loadData(conf);
    },
    // 加载数据
    loadData: function(conf) { // eslint-disable-line no-unused-vars
        var self = this;
        XCtrl.dynamic(conf, "items", function (data0) {
            self.renderData(itemTmpl,data0);
        });
    },
    renderData: function (tmplModule,data) {
        var self=this;
        var $box = self._node.one('.item_ul'),
            itemTpl = new XTemplate(tmplModule),
            itemHtml = itemTpl.render(data);
        $box.html(itemHtml);
        //懒加载
        new DataLazyload({
            container: self._node
        }).refresh();
    },
    // 事件绑定
    bindEvent: function() {

    }
  };

  return Mod;

});
