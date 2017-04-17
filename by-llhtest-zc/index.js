/**
 * @author {李通}({WB080843})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {

//    var XTemplate = require('tms/xtemplate');
//    var XCtrl = require('market/xctrl');
 var Node = require('node'),
		DataLazyload = require('kg/datalazyload/2.0.2/'),
		XTemplate = require('tms/xtemplate');
		IO=require('io');
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
			self.initZhongchou();
		},
		getJson:function(){
			var self=this;
			self.jsondata={};
			// self.jsondata.data=self._conf.idslist;
			self.ids=[];
			S.each(self.jsondata.data,function(v,k){
				console.log(v.pid)
				// self.ids.push(v.pid);
			});
		},
		getData:function(){
			var self=this;
			IO({
                    url:'//izhongchou.taobao.com/dream/ajax/getProjectList.htm?page=1&pageSize=20',
                    dataType: "jsonp",
                    data: {
                        type: 4,
                        ids: ids
                    },
                    success: function (result) {
                        if (result.status == 1) {
                            self.renderData(d.data);
                        }
                        else {
                            alert(result.message);
                        }
                    }
                });
		},
		renderData:function(data){
			var self=this;
			var mergedata=self.jsondata.data;
			S.each(data,function(v,k){
				v.stags = [];
				//重组tag
				if (v.tag) {
					for(var i in v.tag)
					{
						v.stags.push({"tag":v.tag[i]});
					}
				}
				for(var i in mergedata)
				{
					if(mergedata[i].pid==v.id)
					{
						//重组数据入口,自增字段在此，megerdata为tms自定义字段
						/*v.zcj=mergedata[i].zcj;
						v.zc_title=mergedata[i].z_title;
						v.mm_scj=mergedata[i].mm_scj;*/
						v.linkurl="//hi.taobao.com/market/hi/detail2014.php?spm=a215p.7180453.0.0.GFAGGu&id="+v.id;
						v.pers=parseInt(v.curr_money/v.target_money*100)+"%";
						var cmoney = item.curr_money;
                        var tmoney = item.target_money;
                        var endtime = new Date(item.end_date).getTime();
                        var now = new Date();
                        now = now.getTime();
                        var days = parseInt((endtime - now) / 1000 / 3600 / 24);
                        if (days <= 0) {
                            days = 0;
                        }
                        if (isNaN(days)) {
                            days = 0;
                        }
                        v.day=days;
					}
				}
			});
			self._node.find('.ys_displayM').html(itemTpl({data:data}));
		},
		initZhongchou:function(){
			var self=this;
			self.getJson();
			self.getData();
		}
	};

	return Mod;

});
