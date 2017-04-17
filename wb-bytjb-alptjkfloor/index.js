/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {

//    var XTemplate = require('tms/xtemplate');
//    var XCtrl = require('market/xctrl');
    var Node = require('node'),
		DataLazyload = require('kg/datalazyload/6.0.5/index'),
		XTemplate = require('tms/xtemplate'),
		XCtrl = require('market/xctrl'),
	    IO = require('io');
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
			self._node = Node.one(container);
			//self.error可用于记录模块的异常 并且在jstracker平台查看 self.error('api错误')

            conf=conf || self._node.one(".J_conf").val();
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
			var conf=JSON.parse(conf);
			var PreItemUl =  self._node.one(".prolist");
			var data_render = (function(box, tpl){
                console.log(box)
                var preItemUl = box;
                var template = new XTemplate(tpl);
                function render(data){
                    var html = template.render(data);
                    box.html(html);
                }
                return {
                    render: render
                }
            })(PreItemUl, itemTmpl);

            function data_fixed(data){
                var newData = {data:[]};
                var d = data.items;
				var isPostFree="";
                for(var i= 0;i<d.length;i++){
                    if(d[i].isPostFree)
                    { 
                        isPostFree="[包邮]"
                    }
                   
                    newData.data[i] = {
                        itemid:d[i].item_id ,
                        isPostFree:isPostFree,
                        img: d[i].item_pic,
                        howNum: d[i].item_trade_num,
                        title: d[i].item_title,
                        prc: parseInt(d[i].item_current_price),
                        sprc: '.'+(d[i].item_current_price.toString().split('.')[1]||0),
                        prced: d[i].item_price,
                        dijia:d[i].item_dijia,
                        di: parseInt(d[i].item_dijia),
                        dispc:  '.'+(d[i].item_dijia.toString().split('.')[1]||0),
                        shopLogo: d[i].item_shopLogo,
                        point1: d[i].item_point1,
                        point2: d[i].item_point2,
                        point3: d[i].item_point3 ? d[i].item_point3.replace('|', '<br>') : d[i].item_point3,
                        isAndPay: d[i].item_isAndPay,
                        itemPhoto: d[i].item_photo,
                        ysqq:d[i].quantity
                    }
                }
                return newData;
            }
            var sIdList = conf.moduleinfo.sIdList,//主题id
                cIdList = conf.moduleinfo.cIdList,
                iList = conf.moduleinfo.iList,
                pf = conf.moduleinfo.pf,
                coinPrFl = conf.moduleinfo.coinPrFl,
                coinPrCe = conf.moduleinfo.coinPrCe,
                salesFl = conf.moduleinfo.salesFl,
                saleCe = conf.moduleinfo.saleCe,
                disFl = conf.moduleinfo.disFl,
                disCe = conf.moduleinfo.disCe,
                disPrFl = conf.moduleinfo.disPrFl,
                disPrCe = conf.moduleinfo.disPrCe,
                sizeNum = conf.moduleinfo.sizeNum,//数量
                sort = conf.moduleinfo.sort,
                st = conf.moduleinfo.st,
                modSize = conf.moduleinfo.modSize;


            var preurl = '//ajax-taojinbi.taobao.com/';
            function get_data(callback){
                var api = preurl+'item/get_subject_item_list.do';
                new IO({
                    url:api,
                    dataType:'jsonp',
                    data:{
                        sIdList:sIdList, //主题id
                        cIdList:cIdList,
                        iList:iList,
                        pf:pf,
                        coinPrFl:coinPrFl,
                        coinPrCe:coinPrCe,
                        salesFl:salesFl,
                        saleCe:saleCe,
                        disFl:disFl,
                        disCe:disCe,
                        disPrFl:disPrFl,
                        disPrCe:disPrCe,
                        size:sizeNum,
                        sort:sort,
                        st:st,
                        modSize:modSize,
                        startTimeFl:"",
                        startTimeCe:""
                    },
                    success:function(d){
                    	console.log(d)
                        if(d.items){
                            callback(d);
                        }else{
                            PreItemUl.html('该活动已下线！');
                            return false;
                        }
                    },
                    error:function(){
                        PreItemUl.html('该活动已下线！');
                    }
                });
            }

            function preheatItem(){
                get_data(function(data){
                    var newData = data_fixed(data);
                    data_render.render(newData);

					//懒加载
					new DataLazyload({
						container: self._node
					}).refresh();

				})
            }

            preheatItem();

		},
		//事件绑定
		bindEvent: function () {

		}
	};

	return Mod;

});
