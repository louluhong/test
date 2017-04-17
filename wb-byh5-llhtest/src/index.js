/**
 * @author {李通}({WB080843})
 * @version 0.0.1
 */
define(function (require) {
	var itemTpl = require('./item.jst.html');
    var XCtrl = require('tbc/m-xctrl');
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
			if (!conf) {
                conf = $.parseJSON(self._node.find('.J_ModuleData').html());
            }
            self._conf = conf;
            self.loadData(conf);
		},

		//加载数据
		loadData: function (conf) {
			var self = this;
	        //XCtrl逻辑，参考文档：http://gitlab.alibaba-inc.com/tbc/market/blob/master/xctrl.md
			XCtrl.dynamic(conf, "items", function (data) {
                //数据处理，模板渲染
				self._node.find('.by_w700').html(itemTpl(data));
                //模板完绑定事件
				
                
            });
		}
	};

	return Mod;

});
