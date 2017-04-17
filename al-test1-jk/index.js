/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {
  	var Node = require('node');
  	var Event=require('event'),
  		DataLazyload = require('kg/datalazyload/6.0.5/index'),
		XTemplate = require('tms/xtemplate'),
		XCtrl = require('market/xctrl'),
		_JSON=require("json"),
		IO=require("io");
	var $ = S.all;
	var itemTmpl = require("./item-xtpl"),
		itemTmpl1 = require("./item1-xtpl")

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
			self._node = Node.one(container);
			//self.error可用于记录模块的异常 并且在jstracker平台查看 self.error('api错误')


			//存在数据描述，异步渲染
			if (conf) {
				self.loadData(conf);
			} else {
				//为空 绑定事件
				self.bindEvent();
			}

			self.getData();
			self.hhgetData(self._node.find('.group_li').item(0).attr('data-id'));
			// self.hhgetData(137204);
			console.log(self._node.find('.group_li').item(0).attr('data-id'))
			var i=1;
			self._node.find('.by_group').on('click',function(){
				i++;
				if(i==1){
					self.renderdata(self.newdatas1.items);
				}else if(i==2){
					self.renderdata(self.newdatas2.items);
				}else if(i==3){
					self.renderdata(self.newdatas3.items);
					i=0;
				}
				
			})

			// 好货TAB
			self._node.find('.group_li').on('click',function(){
				if($(this).hasClass("by_more")){

				}else{
					self.hhgetData($(this).attr('data-id'));
				}
				
			})
			
		},
		//加载数据
		loadData: function (conf) {
			var self = this;
			console.log(self.arr);
			var arr1=[];
			var arr2=[];
			var arr3=[];
			S.each(self.arr,function(v,k){
				if(k<6){
					arr1.push(v)
					newdata1={'items':arr1}
				}else if(k<12){
					arr2.push(v)
					newdata2={'items':arr2}
				}else{
					arr3.push(v)
					newdata3={'items':arr3}
				}
			})
			if(self.arr!==undefined){
				self.newdatas1=newdata1;
				self.newdatas2=newdata2;
				self.newdatas3=newdata3;
			}
			
			console.log(self.newdatas3)
			
		},
		renderdata:function(data){
			var self=this;
			var $box = self._node.one('.con_ul'),
				itemTpl = new XTemplate(itemTmpl),
				itemHtml = itemTpl.render({data:data});
			$box.html(itemHtml);
		},
		getData: function (i) {
			var self = this;
			var arr=[];
			var newdata={'items':[]};
			new IO({
				url: "https://tui.taobao.com/recommend",
				dataType: "jsonp",
				data: {
					count: 18,
					appid: '2153'
				},
				success: function (d) {
					// console.log(d.result);
					self.arr=d.result;
					S.each(d.result,function(v,k){
						v.dkj=(v.promotionPrice*(v.coinRate/10000)).toFixed(2);
					})
					self.loadData();
					self.renderdata(self.newdatas1.items);
				}
			})
		},
		hhgetData:function(dataid){
			var self = this;
			self._node.find('.group_li').attr('data-id')
			new IO({
				url: "https://ajax-taojinbi.taobao.com/subject/GetSubjectItemsById.do",
				dataType: "jsonp",
				data: {
					subjectId: dataid,
					pageSize: '11'
				},
				success: function (d) {
					console.log(d);
					S.each(d.result,function(v,k){
						v.dkj=(v.promotionPrice*(v.coinRate/10000)).toFixed(2);
					})
					var $box = self._node.one('.con_ul1'),
						itemTpl = new XTemplate(itemTmpl1),
						itemHtml = itemTpl.render({data:d.items});
					$box.html(itemHtml);
					console.log(d)
				}
			})
		},
		//事件绑定
		bindEvent: function () {

		}
	};

	return Mod;

});
