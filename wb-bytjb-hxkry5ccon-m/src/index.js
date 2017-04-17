/**
 * @author {张雯莉}({WB085724})
 * @version 0.0.1
 */
define(function (require) {
	var itemTpl = require('./item.jst.html');
    var lazy=require('kg/km-lazyload');
    var XCtrl = require('kg/m-xctrl');
	function Mod() {
		this.init.apply(this, arguments);
	}

	Mod.prototype = {
		/**
		 * 入口
		 * @param dom 模块根节点
		 * @param conf 数据描述，为空说明已渲染
		 */
		init: function (container, conf) {
			var self = this;
			self._node = $(container);
            conf = $.parseJSON(self._node.find('.J_ModuleData').html());
            self._conf = conf;
            self.loadData(conf);
		},
		//加载数据
		loadData: function (conf) {
			var self = this;
			XCtrl.dynamic(conf, "items", function (data) {
               //数据处理，模板渲染
               self._node.find('.con_ul').html(itemTpl(data));
                //模板完绑定事件
				
                self._node.find('.J_LazyLoad').lazyload({
                    offsetY: 100
                });
           })
		},
		//事件绑定
		bindEvent: function () {

		}
	};

	return Mod;

});
