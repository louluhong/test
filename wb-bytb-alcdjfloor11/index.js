/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */

KISSY.add(function (S, require) {

//    var XTemplate = require('tms/xtemplate');
//    var XCtrl = require('market/xctrl');
  var Node = require('node'),
		XTemplate = require('tms/xtemplate'),
		DataLazyload = require('kg/datalazyload/6.0.5/index'),
	  	$=Node.all,
	  	IO=require('io'),
	  	Countdown=require('kg/countdown/6.0.2/index'),
		XCtrl = require('market/xctrl');
	var itemTmpl = require("./item-xtpl");
	var itemTmpl1 = require("./item1-xtpl");
	var itemTmpl2 = require("./item2-xtpl");

	var data1={
		'items':[
			{
				"item_num":"1",
				"item_price":"188.00",
				"auction_status":"0",
				"item_title":"1手机单反镜头通用广角微距鱼眼三合一套装",
				"_tce_sys_":"16",
				"item_desc":"超值优惠",
				"item_content_end_time":"2016-05-27 23:59:59",
				"item_discount":"2.8",
				"item_content_start_time":"2016-04-1 23:00:00",
				"item_url":"//item.taobao.com/item.htm?id=521031578756",
				"item_current_price":"52.64",
				"auction_id":"521031578756",
				"item_pic":"//gw.alicdn.com/bao/uploaded/TB1aSf0LVXXXXX4XVXXSutbFXXX.jpg",
				"app_id":"5645460786980",
				"seller_id":"2212372190",
				"application_id":"5645460786980"
			},
		    {
		      "item_num":"0",
				"item_price":"188.00",
				"auction_status":"0",
				"item_title":"2手机单反镜头通用广角微距鱼眼三合一套装",
				"_tce_sys_":"16",
				"item_desc":"超值优惠",
				"item_content_end_time":"2016-04-27 23:59:59",
				"item_discount":"2.8",
				"item_content_start_time":"2016-04-26 10:00:00",
				"item_url":"//item.taobao.com/item.htm?id=521031578756",
				"item_current_price":"52.64",
				"auction_id":"521031578756",
				"item_pic":"//gw.alicdn.com/bao/uploaded/TB1aSf0LVXXXXX4XVXXSutbFXXX.jpg",
				"app_id":"5645460786980",
				"seller_id":"2212372190",
				"application_id":"5645460786980"
		    },
		    {
		      "item_num":"38662",
				"item_price":"188.00",
				"auction_status":"0",
				"item_title":"3手机单反镜头通用广角微距鱼眼三合一套装",
				"_tce_sys_":"16",
				"item_desc":"超值优惠",
				"item_content_end_time":"2016-04-27 23:59:59",
				"item_discount":"2.8",
				"item_content_start_time":"2016-04-26 10:00:00",
				"item_url":"//item.taobao.com/item.htm?id=521031578756",
				"item_current_price":"52.64",
				"auction_id":"521031578756",
				"item_pic":"//gw.alicdn.com/bao/uploaded/TB1aSf0LVXXXXX4XVXXSutbFXXX.jpg",
				"app_id":"5645460786980",
				"seller_id":"2212372190",
				"application_id":"5645460786980"
		    },
		    {
		      "item_num":"38662",
				"item_price":"188.00",
				"auction_status":"0",
				"item_title":"4手机单反镜头通用广角微距鱼眼三合一套装",
				"_tce_sys_":"16",
				"item_desc":"超值优惠",
				"item_content_end_time":"2016-04-27 23:59:59",
				"item_discount":"2.8",
				"item_content_start_time":"2016-04-26 10:00:00",
				"item_url":"//item.taobao.com/item.htm?id=521031578756",
				"item_current_price":"52.64",
				"auction_id":"521031578756",
				"item_pic":"//gw.alicdn.com/bao/uploaded/TB1aSf0LVXXXXX4XVXXSutbFXXX.jpg",
				"app_id":"5645460786980",
				"seller_id":"2212372190",
				"application_id":"5645460786980"
		    }
		]
	}
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
			new IO({
				url:"//t.alicdn.com/t/gettime",
				dataType:"jsonp",
				success:function(d){
					// console.log(d);
					self.nowms=d.time*1000;
					//mock
					// var nowms=new Date("2016/1/10 14:58:00").getTime();
					// console.log(self.nowms);
					self.correctItems = getCorrectItems(data1,self.nowms);
					//存在数据描述，异步渲染
					if (conf) {
						self.loadData(conf);
					} else {
						//为空 绑定事件
						// self.bindEvent(conf);
						// self.bindEvent(correctItems);
					}
					// self.loadData(conf);
					self.renderData1(conf);
					self.rendrtime(self.correctItems);
					// self.bindEvent(correctItems);
					//懒加载
					new DataLazyload({
		                container: self._node
		            }).refresh();
				}
			});
			self._node.find('.by_top').removeClass('cdj-loading');
			self._node.find('.by_right').removeClass('cdj-loading');
			self._node.find('.by_bottom').removeClass('cdj-loading');
			
		},
		// 发现模块
		renderData1:function(conf){
			var self=this;
			// new IO({
			// 	url:"",
			// 	data:datas,
			// 	dataType:"jsonp",
			// 	success:function(data){
					
			// 	}
			// })
			var data={
				'items':[
					{
						"item_url": "//3c.taobao.com/cdj/item.htm?id=45301245457",
					    "item_achieving_rate": "",
					    "item_pic": "//img.alicdn.com/tfscom/img.alicdn.com/tps/TB1E90bLXXXXXa8XVXXXXXXXXXX-800-800.jpg",
					    "item_desc": "时速40km,遥控距离1km,实时图像传输,",
					    "item_more_link": "",
					    "item_favorite": "228",
					    "item_listed": "2015年09月13日",
					    "item_amount_sold": "",
					    "item_price": 2299.00,
					    "item_more_desc": "",
					    "item_status": "5",
					    "item_support": "",
					    "item_title": "华科尔 runner250 无人机 智能航拍器",
					    "item_browse_count": "26260",
					    "item_trade_num": "6",
					    "item_numiid": "45301245457",
					    "item_iid": "45301245457"
					},
				    {
				      "item_url": "//3c.taobao.com/cdj/item.htm?id=45301245457",
				      "item_achieving_rate": "",
				      "item_pic": "//img.alicdn.com/tfscom/img.alicdn.com/tps/TB1E90bLXXXXXa8XVXXXXXXXXXX-800-800.jpg",
				      "item_desc": "时速传输,",
				      "item_more_link": "",
				      "item_favorite": "228",
				      "item_listed": "2015年09月13日",
				      "item_amount_sold": "",
				      "item_price": 2299.00,
				      "item_more_desc": "",
				      "item_status": "5",
				      "item_support": "",
				      "item_title": "华科尔 人机 智能航拍器",
				      "item_browse_count": "26260",
				      "item_trade_num": "6",
				      "item_numiid": "45301245457",
				      "item_iid": "45301245457"
				    },
				    {
				      "item_url": "//3c.taobao.com/cdj/item.htm?id=45301245457",
				      "item_achieving_rate": "",
				      "item_pic": "//img.alicdn.com/tfscom/img.alicdn.com/tps/TB1E90bLXXXXXa8XVXXXXXXXXXX-800-800.jpg",
				      "item_desc": "时速40km,遥控距离1km,实时图像传输,",
				      "item_more_link": "",
				      "item_favorite": "228",
				      "item_listed": "2015年09月13日",
				      "item_amount_sold": "",
				      "item_price": 2299.00,
				      "item_more_desc": "",
				      "item_status": "5",
				      "item_support": "",
				      "item_title": "华科尔 runner250 无人机 智能航拍器",
				      "item_browse_count": "26260",
				      "item_trade_num": "6",
				      "item_numiid": "45301245457",
				      "item_iid": "45301245457"
				    },
				    {
				      "item_url": "//3c.taobao.com/cdj/item.htm?id=45301245457",
				      "item_achieving_rate": "",
				      "item_pic": "//img.alicdn.com/tfscom/img.alicdn.com/tps/TB1E90bLXXXXXa8XVXXXXXXXXXX-800-800.jpg",
				      "item_desc": "时速传输,",
				      "item_more_link": "",
				      "item_favorite": "228",
				      "item_listed": "2015年09月13日",
				      "item_amount_sold": "",
				      "item_price": 2299.00,
				      "item_more_desc": "",
				      "item_status": "5",
				      "item_support": "",
				      "item_title": "华科尔 人机 智能航拍器",
				      "item_browse_count": "26260",
				      "item_trade_num": "6",
				      "item_numiid": "45301245457",
				      "item_iid": "45301245457"
				    }
				]
			}
			var $box = self._node.one('.J_FaxianList');
				self.renderData(itemTmpl1,data,$box);

			
		},
		rendrtime:function(ndata){
			var self=this;
			var $box = self._node.find('#J_ShanGouTeMaiItems1');
				self.renderData(itemTmpl2,ndata,$box);
		},
		//加载数据
		loadData: function (conf) {
			var self = this;
			XCtrl.dynamic(conf, "items", function (data) {
				//数据处理，模板渲染
				var $box = self._node.one('.con_ul');
				self.renderData(itemTmpl,data,$box);
				//模板完绑定事件 
				self.bindEvent(self.correctItems);
			})

			
		},
		// LOGO区模块
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
		bindEvent: function (correct) {
			var self=this
			$('#J_ShanGouTeMaiItems1').removeClass('cdj-loading');
		    if (correct.type == '2') {
		        /*$('#J_SGTMCountDown').html('已经结束啦！');*/
		        $('.cdj-main-shangoutemaixzp .module-wrap').css('display', 'none');
		        return;
		    }
		    var txtMap = {
		        '0': '距开始剩余时间',
		        '1': '距结束剩余时间',
		    };
		    $('#J_SGTMCountDown1 span').html(txtMap[correct.type]);
	      	Countdown({
	        	el: $('#J_SGTMCountDown1'),
	        	//stopPoint: parseDate('2015-09-06 22:00:00:00').getTime(),    // unix时间戳
	        	leftTime: correct.remain / 1000,      // or 剩余毫秒
	        	effect: 'slide' //动画效果 normal,slide,flip
	      	});
		    var time1 = setInterval(function() {
			    if ($('#J_SGTMCountDown1').text() == '距结束剩余时间：00天00时00分001秒') {
			        $('.cdj-main-shangoutemaixzp .module-wrap').css('display', 'none');
			        clearInterval(time1);
			    }
		    }, 2000);
		}
	}
	return Mod;
	function parseDate(dateStr) {
		// console.log(dateStr)
	    var dateRegExp = /^(\d{4})\-([0-1]?[0-9])\-([0-3]?[0-9])\s+([0-2]?[0-9])\:([0-5]?[0-9])\:([0-5]?[0-9])(?:\:(\d{1,3}))?/;
	    var matched = dateStr.match(dateRegExp);
	    
	    if (matched) {
	      	return new Date(
	        	parseInt(matched[1]),
	        	parseInt(matched[2]) - 1,
	        	parseInt(matched[3]),
	        	parseInt(matched[4]),
	        	parseInt(matched[5]),
		        parseInt(matched[6]),
		        parseInt(matched[7] || 0)
	      	);
	    }
	    return new Date();
	  }
	// 获得正确的商品，剩余时间，状态（即将，正在，结束）
  	function getCorrectItems(items, now) {
    	// 开始时间升序
	    items.items.sort(function(b, a) {
	      return parseDate(a.item_content_start_time).getTime() - parseDate(b.item_content_start_time).getTime();
	    });
    	var tt = [];
    	var target = {
      		remain: 0,
      		type: '0',
      		items: null
    	};
	    for (var i = 0; i < data1.items.length; i++) {
	      	var start = parseDate(data1.items[i].item_content_start_time).getTime();//开始时间
	      	var end = parseDate(data1.items[i].item_content_end_time).getTime();    //结束时间
	      	var n = parseInt(parseDate(data1.items[i].item_content_start_time).getFullYear());
	      	var y = parseInt(parseDate(data1.items[i].item_content_start_time).getMonth() + 1);
	      	var r = parseInt(parseDate(data1.items[i].item_content_start_time).getDate());
	      	var hh = n + '/' + y + '/' + r + ' ' + '00:00:00';
	      	var ksr = new Date(hh).getTime();
	      	// console.log(ksr,now,start)
	      	if (ksr <= now && now < start) {
		        data1.items[i].zt = 1;
		        tt.push(data1.items[i]);
		      } else if (now >= start && now < end) {
		        data1.items[i].zt = 2;
		        tt.push(data1.items[i]);
		      }
	    };
	    if (tt.length === '0') {
	      	$('.cdj-main-shangoutemaixzp .module-wrap').css('display', 'none');
	    }
    	target.items = tt;
    	// console.log(tt.length)
	    //因为是按开始最早到最晚排列所以第一个是最早开始
	    var start = parseDate(tt[0].item_content_start_time).getTime();
	    var n = parseInt(parseDate(tt[0].item_content_start_time).getFullYear());
	    var y = parseInt(parseDate(tt[0].item_content_start_time).getMonth() + 1);
	    var r = parseInt(parseDate(tt[0].item_content_start_time).getDate());
	    var hh = n + '/' + y + '/' + r + ' ' + '00:00:00';
	    var ksr = new Date(hh).getTime();
	    var end = null;
	    // end = parseDate(target.items[target.items.length - 1].item_content_end_time).getTime();
	    function ed() {
	      	target.items.sort(function(a, b) {
	        return parseDate(a.item_content_end_time).getTime() - parseDate(b.item_content_end_time).getTime();
	      	});
	      end = parseDate(target.items[target.items.length - 1].item_content_end_time).getTime();
	    }//让数据按结束时间从小到到排列 这样最后一个数据就是当天最晚的时间
	    	ed();
	    // 未开始
	    if (ksr <= now && now < start) {
	      	target.type = '0';
	      	target.remain = start - now;
	      	// 进行中
	    } else if (start <= now && now < end) {
	      	target.type = '1';
	      	target.remain = end - now;
	      	// 还有促销，进入下一个循环
	    } else if (i + 1 < items.length) {
	      	// 结束了
	    } else {
	      	target.type = '2';
	    }
	    return target;

	}
});
