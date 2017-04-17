/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {

	var Node = require('node'),
		DataLazyload = require('kg/datalazyload/6.0.2/'),
		XTemplate = require('tms/xtemplate'),
		Slide = require('kg/slide/6.1.0/index');

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
			self.slide();

			//存在数据描述，异步渲染
			if (conf) {
				self.loadData(conf);
			} else {
				//为空 绑定事件
				self.bindEvent();
			}
		},
		slide:function(){
            var self = this;

        	var slide1=new Slide(self._node.one('.J_tab'),{
                eventType:'click',
                contentClass:'tab-content',
                pannelClass:'tab-pannel',
                selectedClass:'current',
                effect:'hSlide',
                carousel:true,
                colspan:4,
                touchmove:true,
                autoSlide:false,
                timeout:1000,
            }).on("afterSwitch",function(index){
                self._node.all('.slide_li').removeClass('active');
                self._node.all('.slide_li').item(index.index+1).addClass('active');
                console.log(self._node.all('.slide_li').item(index.index+1))
            })
        	self._node.all('.by_next').on('click',function(){
            	slide1.next();
            });
            self._node.all('.by_prev').on('click',function(){
                slide1.previous();
            });
            slide1.go(4);
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
		},
		//事件绑定
		bindEvent: function () {

		}
	};

	return Mod;

});
