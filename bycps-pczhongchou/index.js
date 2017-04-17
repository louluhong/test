/**
 * @author {李通}({WB080843})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {
	
	var Node = require('node');
	var $ = S.all,
		IO = require("io"),
		DataLazyload = require('kg/datalazyload/6.0.5/'),
		itemTmpl = require("./item-xtpl"),
		_JSON=require("json"),
		XTemplate = require('tms/xtemplate');

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
			conf = conf || self._node.one(".J_conf").val();
			self._conf = _JSON.parse(conf);
			//初始化众筹
			self.initZhongchou();
		},
		getJson: function () {
			var self = this;
			self.jsondata = {};
			self.ids = [];
			S.each(self._conf.idslist, function (v, k) {
				self.ids.push(v.pid);
			});
		},
		getData: function () {
			var self = this;
			new IO({
				url: "//izhongchou.taobao.com/dream/ajax/getProjectList.htm",
				dataType: "jsonp",
				data: {
					type: 4,
					ids: self.ids.join(),
					pageSize:20,
					page:1
				},
				success: function (d) {
					//console.log(d);
					if (d.status == 1) {
						var html = self.renderData(d.data);
						$(self.wrapper).html(html);
					} else {
						if ($(".mask-alert").length > 1) {
							return;
						}
						$("body").append('<div class="mask-alert" style="width:200px;height:50px;line-height:50px;text-align:center;\
										 color:#fff;font-size:16px;z-index:99;position:fixed;left:50%;top:50%;border-radius:5px;\
										 margin-left:-100px;margin-top:-25px;background:rgba(0,0,0,0.3)">众筹接口请求失败</div>');
						setTimeout(function () {
							$(".mask-alert").remove();
						}, 2000)
					}

				}
			})
		},
		renderData: function (data) {
			var self = this;
			// var mergedata=self.jsondata.data; 
			S.each(data, function (v, k) {
				console.log(v,'a')
				v.stags = [];
				//重组tag
				if (v.tag) {
					for (var i in v.tag) {
						v.stags.push({
							"tag": v.tag[i]
						});
					}
				}
				// for(var i in mergedata)
				// {
				// 	if(mergedata[i].pid==v.id)
				// 	{
						// 自定义字段
						v.pers = parseInt(v.curr_money / v.target_money * 100) + "%";
						v.linkurl = "//hi.taobao.com/market/hi/detail2014.php?id=" + v.id;
				// 	}
				// }
			});
			console.log(data);
			var $box = self._node.one('.zc_displayM'),
				itemTpl = new XTemplate(itemTmpl),
				itemHtml = itemTpl.render({data:data});
			$box.html(itemHtml);
			self._lazyload = new DataLazyload({
				container: self._node
			});
		},
		initZhongchou: function () {
			var self = this;
			self.getJson();
			self.getData();
		}
	};

	return Mod;

});