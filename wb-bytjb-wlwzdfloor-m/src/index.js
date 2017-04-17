/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */
define(function (require) {
	var itemTpl = require('./item.jst.html');
    var lazy=require('tbc/km-lazyload');
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
			var sIdList = conf.moduleinfo.sIdList,//主题id
                cIdList = conf.moduleinfo.cIdList,
                iList = conf.moduleinfo.iList,
                sort=conf.moduleinfo.sort,
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
                st = conf.moduleinfo.st,
                modSize = conf.moduleinfo.modSize,
                by_zb=conf.moduleinfo.by_zb;
            self.byzb=by_zb;   
            var api = '//ajax-taojinbi.taobao.com/item/get_subject_item_list.do';
            var now  = new Date();
            var config = {
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
            };
            $.ajax({
                url:api,
                dataType:"jsonp", 
                data:config, 
                success:function(data) {
                	// console.log(data)
                	data.byzb=by_zb;
                	// console.log(data)
                  if(data.items){
                        self._node.find('.itemlist-box').html(itemTpl({data:data}));

                          //懒加载
                    setTimeout(function(){
                      self._node.find('.j_lazy').lazyload({
                        offsetY: 100,
                        // 同时最多加载的图片数量
                        maxNum: 10,
                        //是否开启webp
                        autoWebp: true
                        //是否自动开启懒加载动画
                            });
                      },100)
                      }else{
                          PreItemUl.html('该活动已下线！');
                          return false;
                      }
                  },
                  error:function(){
                      PreItemUl.html('该活动已下线！');
                  }
            });
            
		},
		//事件绑定
		bindEvent: function () {

		}
	};

	return Mod;

});