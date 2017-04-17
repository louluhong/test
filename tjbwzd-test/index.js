/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {

//    var XTemplate = require('tms/xtemplate');
//    var XCtrl = require('market/xctrl');
  var Node = require('node');
  XTemplate = require('tms/xtemplate'),
  XCtrl = require('market/xctrl');
  var itemTmpl = require("./items-xtpl");
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
			self._node = Node.one(container); //代表当前这个模块的父级
			conf = conf || self._node.one(".J_conf").val();
			self.conf = conf;
			//self.error可用于记录模块的异常 并且在jstracker平台查看 self.error('api错误')


			//存在数据描述，异步渲染
			if (conf) {
				self.loadData(conf);
			} else {
				//为空 绑定事件
				self.bindEvent();
			}
		},
		//加载数据
		loadData: function (conf) {
			var self = this;
//            //XCtrl逻辑，参考文档：http://gitlab.alibaba-inc.com/tbc/market/blob/master/xctrl.md
           XCtrl.dynamic(conf, "items", function (data) {
           		var $box=self._node.one('.tabcon_ul');
           		itemTmpl=new xtemplate(tmplModule),
           		tabconHtml=itemTmpl.render(data);
           		$box.html(tabconHtml);
           })
		},
		//事件绑定
		bindEvent: function () {

		}
	};

	return Mod;

});
