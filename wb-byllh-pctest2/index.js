/**
 * @author {李通}({WB080843})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {

//    var XTemplate = require('tms/xtemplate');
//    var XCtrl = require('market/xctrl');
  var Node = require('node'),
   		XTemplate = require('tms/xtemplate'),
	    XCtrl = require('market/xctrl');
		var itemTmpl = require("./item-xtpl");

		var item1Tmpl = require("./item1-xtpl");
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
			DataLazyload = require('kg/datalazyload/2.0.2/'),
			self._node = Node.one(container);//代表当前这个模块的父级
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
//            XCtrl.dynamic(conf, "items", function (data) {
//                //数据处理，模板渲染
//                S.log(data);
//                //模板完绑定事件
//                self.bindEvent();
//            })
			XCtrl.dynamic(conf, "item", function (data) {
				//数据处理，模板渲染
				S.log(data);
				var $box = self._node.one('.by_con_ul');
				self.renderData(itemTmpl,data,$box);
				//模板完绑定事件
				self.bindEvent();
			})
			XCtrl.dynamic(conf, "item1", function (data) {
				//数据处理，模板渲染
				S.log(data);
				var $box1 = self._node.one('.sp_ul');
				self.renderData(item1Tmpl,data, $box1);
				//模板完绑定事件
				self.bindEvent();
			})
		},
		renderData: function (tmplModule,data,box) {
			var self=this;
			var itemTpl = new XTemplate(tmplModule),
				itemHtml = itemTpl.render(data);
			box.html(itemHtml);

			
			//懒加载
			new DataLazyload({
				container: self._node
			}).refresh();
		},
		//事件绑定
		bindEvent: function () {

		}
	};

	return Mod;

});
