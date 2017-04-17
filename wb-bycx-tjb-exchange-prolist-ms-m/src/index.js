/**
 * @author {徐伟萍}({WB033476})
 * @version 0.0.1
 */
define(function (require) {

	var itemTpl = require('./item.jst.html');
    var XCtrl = require('kg/xctrl');

    var lazy=require('kg/km-lazyload');
    //var Slide = require('tbc/km-slider');

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
            self._conf =conf || $.parseJSON(self._node.find('.J_ModuleData').html());
            //self.error可用于记录模块的异常 并且在jstracker平台查看 self.error('api错误')
            //存在数据描述，异步渲染
            self._conf.moduleinfo.isshowtime=true;

            self.balancenav(self._conf);
            
        },
        balancenav: function (conf) {
            var self = this;
            XCtrl.dynamic(conf, "items", function (data) {
               
                self.gettime();
                self.bindEvent();
            })
        },
        gettime: function () {
            var self = this;
            $.ajax({
                url: "//t.alicdn.com/t/gettime",
                dataType: "jsonp",
                success: function (d) {
                    //mock
                    //d.time = new Date('2016/2/15 14:00:00').getTime() / 1000;
                    self.nowms = d.time * 1000;
                    self.nowhour = new Date(self.nowms).getHours();
                    self.nowYMD=new Date(self.nowms).getFullYear()+"/"+(new Date(self.nowms).getMonth()+1)+"/"+(new Date(self.nowms).getDate())
                    console.log(self.nowYMD)
                    self.nowpos = -1;
                    
                    
                    $.each(self._conf.items, function (k, v) {
                      //  console.log("23",self.nowhour,v.mshour)
                        
                        if (self.nowhour >= v.mshour && v.msdate==self.nowYMD || v.msdate<self.nowYMD ) {
                            self.nowpos = k;
                           // return false;
                        }
                    });
                    
                    console.log(self.nowms,new Date(self._conf.items[0].msdate + " 00:00:00").getTime())
                    if (self.nowms < new Date(self._conf.items[0].msdate + " 00:00:00").getTime()) {
                        
                        self.nowpos = -1;
                    }
                    //self.nowpos代表当前时间下在哪个时间点下;
                    if (!self._conf.moduleinfo.isshowtime) {
                        //如果勾选了时间轴
                        //self.activeNav(self.nowpos, -1);
                        //self.ajaxitem();
                    } else {
                        self.ajaxitem(0, function () {
                            self.ajaxitem(1, function () {
                                self.ajaxitem(2, function () {
                                    self.ajaxitem(3);
                                })
                            })
                        });

                    }

                }
            });
        },
        ajaxitem: function (clickindex, callback) {
            //clickindex为点击导航的时候传入的索引.
            var self = this;
            callback = callback || function () {};
            //clickindex = clickindex || "";
            var status = "before";
           
            if (clickindex || clickindex == 0) {
                //点击的时候
                var nowitem = self._conf.items[clickindex];
                 console.log("sdfsd",self._conf,clickindex,self.nowpos)
                if (clickindex > self.nowpos) {
                   /* if (self._conf.moduleinfo.isshowtime == true || self._conf.moduleinfo.isshowtime == "true") {
                        status = "before2"
                    } else {
                        status = "before";
                    }*/
                    status = "before";
                } else if (clickindex == self.nowpos) {
                    status = "doing";
                } else {
                    status = "doing"
                }
            } else {
                //默认进来
                if (self.nowpos == -1) {
                    var nowitem = self._conf.items[0];
                } else {
                    var nowitem = self._conf.items[self.nowpos];
                    status = "doing";
                }
            }
            //console.log(status);
            if (clickindex == "" && clickindex != 0 || clickindex == undefined) {
                var wrapindex = self.nowpos;
            } else {
                var wrapindex = clickindex;
            }
            try {
                var postdata = {
                    sort: nowitem.sort || "",
                    st: nowitem.st || "",
                    iList: nowitem.ilist || "",
                    sidList: nowitem.sidlist || "",
                    size: nowitem.sizenum || ""
                };
            } catch (e) {
                return;
            }

            var d = {
                displayItems: nowitem.msitems,
                success: true
            }
            if (!d.success) {
                return;
            }
            d.moduleinfo = self._conf.moduleinfo;
            //console.log(d)
            $.each(d.displayItems, function (k, v) {
                //mock
                v.showsqlink=nowitem.isshowsqlink;

                //v.quantity = 0;
                //换算出开始时间;
                //换算出开始时间;
                try {
                    var datearr = nowitem.msdate.split("/");
                    v.startdate = datearr[1] + "月" + datearr[2] + "日";
                    //v.startDate2 = datearr[0] + "/" + datearr[1] + "/" + datearr[2];
                    v.startDate2 = nowitem.msdate;
                    //v.starthour = v.startDate.split(" ")[1].slice(0, 5) + "开始";
                    v.starthour = nowitem.mshour + ":00:00 开始";
                } catch (e) {
                    v.starthour = "即将开始";
                }

                if (self.nowms < new Date(v.startDate2 + " 00:00:00").getTime()) {
                    //如果在日期之前则默认before
                    status = "before";
                    //v.status = status;
                } else if (self.nowms > new Date(v.startDate2 + " 23:59:59").getTime()) {
                    //如果大于当天了
                    status = "doing";
                }
               // console.log(self.nowms ,v.startDate2 + " "+nowitem.mshour+":15:00")
                if(self.nowms > new Date(v.startDate2 + " "+nowitem.mshour+":15:00").getTime()){
                    
                    status = "after";
                }
                if (d.moduleinfo.isshowtime == true) {
                    //如果不显示时间轴的时候判断状态
                    status == "before" ? status = "before2" : "";

                }
                v.status = status;
                //强制售罄
                if (v.quantity <= 0) {
                    v.status = "after";
                }
            });

            itemwrap = self._node.find('.item-ul');

            itemwrap.css('display', 'block');
            self.renderNormal(d,status);
            self.checkend();
            callback();
        },
        checkend: function () {
            var self = this;

            function _getAmount(obj) {
                var o = this;
                o.onetime = obj.onetime || 20;
                o.url = obj.url || "//tbskip.taobao.com/json/auction_saled_amount.do?qt=0&keys=";
                o.arr = [];
                o.nodename = obj.nodename || "item-box";
                o.getids = function () {
                    self._node.find("." + o.nodename).each(function () {
                        var id = $(this).attr("data-id");
                        o.arr.push(id);
                    });
                };
                o.oper = obj.oper || function (d) {
                    var list = d.auctions;
                    for (var i = 0; i < list.length; i++) {
                        var num = list[i].amount;
                        var id = list[i].aid;
                        //mock
                        //list[i].st = -1;
                        if (list[i].st < 0 || list[i].inSale=="false") {
                            $.each(self._node.find('.item_' + id), function (kk, vv) {
                                
                              if($(vv).hasClass("item-doing") || $(vv).hasClass("item-after")){
                                   $(vv).removeClass('item-before item-doing').addClass("item-after");
                                     var showsqlink=$(vv).attr("data-showsqlink");
                                    if(showsqlink==false || showsqlink=="false" || showsqlink=="否") {
                                    $(vv).find("a").attr("href",$(vv).attr("data-url"))
                                    }
                                }
                            });
                            
                            
                        }
                    }
                };
                o.getnum = function () {
                    var arr = o.arr.splice(0, o.onetime);
                    if (arr.length <= 0) {
                        return false;
                    }
                    var keys = arr.join();
                    $.ajax({
                        url: o.url + keys,
                        dataType: 'jsonp',
                        success: function (d) {
                            o.oper(d);
                            o.getnum();
                        }
                    });
                };
                o.init = function () {
                    o.getids();
                    o.getnum();
                }
                this.init.call(this);
            }
            new _getAmount({
                onetime: "20"
            });
        },
        activeNav: function (index1, index2) {
            /*
             **@param index1 时间计算出的激活项
             **@param index2 点击后的索引值,默认为-1;
             */
            var self = this,
                sn = self._node,
                navitem = sn.find('.time-item');
             console.log(index1,index2)
            navitem.removeClass('nav-before nav-doing nav-after active-doing active-before active-after');
            //
            if (self.nowms < new Date(self._conf.items[0].msdate + " 00:00:00").getTime()) {
               
                //日期时间点之前
                index2 == "-1" ? index2 = 0 : "";
                navitem.addClass('nav-before');
                navitem.eq(index2).addClass('active-before');
                return;
            } else {
                navitem.each(function (k, v) {
                    if (k == index1) {
                        $(this).addClass('nav-doing active-doing');
                    } else if (k > index1) {
                        $(this).addClass('nav-before');
                    } else {
                        $(this).addClass('nav-after');
                    }
                });
                if (index2 != -1) {
                    //点击进来
                    //console.log('点击进来');
                    //点击进来的时候
                    if (index1 >= 0) {
                        //点击按钮后的操作;
                        if (index2 != index1) {
                            navitem.removeClass('active-before active-doing active-after');
                            if (index2 < index1) {
                                navitem.eq(index2).addClass('active-after')
                            } else {
                                navitem.eq(index2).addClass('active-before');
                            }
                        }
                    } else {
                        if (self.nowpos == -1) {
                            if (index2 == -1) {
                                navitem.eq(0).addClass('active-before');
                            } else if (index2 >= 0) {
                                navitem.each(function (k, v) {
                                    if (k == index2) {
                                        $(this).addClass('nav-before active-before');
                                    } else if (k > index1) {
                                        $(this).addClass('nav-before');
                                    } else {
                                        $(this).addClass('nav-before');
                                    }
                                });
                            }
                        }
                    }
                } else {
                    if (index1 == -1 && index2 == -1) {
                        navitem.eq(0).addClass('active-before');
                    }
                }
            }
        },
        renderNormal: function (data,status) {
            var self = this;
            console.log(status)
            self._node.find('.slider-wrap').empty();
            itemwrap = self._node.find('.list-wrap').find('.item-ul');
            self._node.find('.list-wrap').find('.item-wrap').show();
             //无时间轴
            
            if (!self._conf.moduleinfo.isshowtime) {
               
                itemwrap.html(itemTpl(data));
            } else {
                itemwrap.append(itemTpl(data));
                
            }
                if(status=="doing"){
                // 
                
                }

            self._node.find('.J_LazyLoad').lazyload({
                offsetY: 100
            });
        },
        //事件绑定
        bindEvent: function () {
            var self = this,
                sn = self._node,
                navitem = sn.find('.time-item');
            navitem.on('click', function () {

                var index = $(this).index();
                if (index != self.clickindex) {
                    self.clickindex = index;
                    self.activeNav(self.nowpos, self.clickindex);
                    self.ajaxitem(index);
                }
            });
        }
    };

    return Mod;

});
