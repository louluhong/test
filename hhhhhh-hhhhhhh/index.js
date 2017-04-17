/**
 * @author {李通}({WB080843})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {

	//    var XTemplate = require('tms/xtemplate');
	//    var XCtrl = require('market/xctrl');
	var Node = require('node'),
		DataLazyload = require('kg/datalazyload/6.0.2/'),
		XTemplate = require('tms/xtemplate'),
		XCtrl = require('market/xctrl');
	var itemTmpl = require("./items1-xtpl");

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
			
			// var newData1 = {datas:[]};
			//XCtrl逻辑，参考文档：http://gitlab.alibaba-inc.com/tbc/market/blob/master/xctrl.md
			XCtrl.dynamic(conf, "items", function (data) {
				//数据处理，模板渲染
				var $box = self._node.one('.shoplay'),
				$box1=self._node.one('.shoplay1');
				// S.log(data);
				// var newData = {data:[]};
				// var newData1 = {data:[]};
				// var newdata={data[]};
				console.log(data.items.length)
				// S.each(data.items,function(item,index){
					console.log(data)
				for(var i=0;i<data.items.length;i++){
					if((i+1)%2===0){
						newdata={"items":data[i]};
						console.log(newdata)
						self.renderData(itemTmpl,newdata,$box1);
					}else{
						self.renderData(itemTmpl,data,$box);
					}
				}
				// 	if((index+1)%2===0){
				// 		// newData = {data:[]};
				// 		console.log(index)
				// 		newData.data[index]=item;
				// 		// self.renderData(itemTmpl,newData,$box1);
				// 		console.log(newData,'偶')
				// 	}else{
				// 		// newData = {data:[]};
				// 		newData1.data[index]=item;
				// 		// console.log('奇',newData1)
				// 		// self.renderData(itemTmpl,newData1,$box);
				// 	}
	   //      	});
				// // console.log(newData)
				// self.renderData(itemTmpl,newData,$box1);
				// self.renderData(itemTmpl,newData1,$box);
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