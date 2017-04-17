/**
 * @author {娄露红}({WB085725})
 * @version 0.0.1
 */

KISSY.add(function(S, require) {

    var Node = require('node');
    var DataLazyload = require('kg/datalazyload/6.0.5/');
    var ML = require('kg/mini-login/6.3.8/');
    var _JSON=require('json'),
        UA=require('ua'),
        Like=require('kg/like/6.1.0/index'),
        Event=require('event');
    var IO = require('io');
    var MtopDesktop = require('kg/mtop-desktop/0.1.1/');
    var $=S.all;
        Mlogin = new ML();
    var Node = require('node');
    var Node = require('node');

  function Mod() {
    this.init.apply(this, arguments);
  }

  Mod.prototype = {
    /**
    * 入口
    * @param dom 模块根节点
    * @param conf 数据描述，为空说明已渲染
    */
    init: function(container, conf) {
        var self = this;
        self._node = Node.one(container);
        //self.error可用于记录模块的异常 并且在jstracker平台查看 self.error('api错误')
        conf = conf || JSON.parse(self._node.one(".J_conf").val());


        //存在数据描述，异步渲染
        if (conf) {
            self.loadData(conf);
            self.bindEvent();
        } else {
        //为空 绑定事件
        }
    },
    // 加载数据
    loadData: function(conf) { // eslint-disable-line no-unused-vars
      // var self = this;
      // XCtrl逻辑，参考文档：http://gitlab.alibaba-inc.com/tbc/market/blob/master/xctrl.md
      // XCtrl.dynamic(conf, "items", function (data) {
      //    //数据处理，模板渲染
      //    S.log(data);
      //    //模板完绑定事件
      //    self.bindEvent();
      // });
    },
    showWin: function (cname, callback) {
        var self = this;
        callback = callback || function () {};
        var tmpl = self._node.all(cname).html();
        self._node.all('.toast_tk').html(tmpl);
        callback();
        self._node.all(".toast_tk").show();
    },
    consume:function(){
        var self=this;
        MtopDesktop.loadMtop(function () {
            lib.mtop.request({
                    api: 'mtop.matrixexchange.coin.buyer.consume',
                    v: '1.0',
                    ecode:1,
                    data:{
                        appName:'dashang',
                        accessKey:"f47571ee714fa69c2087daf98e292a3e",
                        ruleCode:"COIN_CHILDISH_REWARD_CONSUME",
                        amount:'10'
                    },
                    type: 'get', // 默认get
                    dataType: 'jsonp', // 默认jsonp
                    timeout: 20000 // 接口超时设置，默认为20000ms
                },
                function (resJson, retType) {
                    // 成功回调
                    if (resJson.ret[0] == "SUCCESS::调用成功") {
                        // self.showWin('.tmpl_box5', function () {});
                    }
                },
                function (resJson, retType) {
                    // 失败回调
                    // retType为数字，可以通过lib.mtop.RESPONSE_TYPE枚举来获得具体信息
                }
            );
        });
    }, 
    checked:function(key,bool,myacid,myasac,ua){
        var self=this;
        MtopDesktop.loadMtop(function () {
            lib.mtop.request({
                    api: 'mtop.matrixexchange.wireless.userInfo.get',
                    v: '1.0',
                    ecode:1,
                    type: 'get', // 默认get
                    dataType: 'jsonp', // 默认jsonp
                    timeout: 20000 // 接口超时设置，默认为20000ms
                },
                function (resJson, retType) {
                    // 成功回调
                    // 仅当ret为SUCCESS或未提供failure回调时调用
                    // retType为数字，可以通过lib.mtop.RESPONSE_TYPE枚举来获得具体信息
                    //console.warn(resJson);
                    if (resJson.ret[0] == "SUCCESS::调用成功") {
                        if(resJson.data.totalCoin<10){ //金币不足
                            self.showWin('.tmpl_box2', function () {});
                        }else{
                            self.showWin('.dh_box2',function(){
                                // console.log($(this))
                                var container=self._node.one('.sure');
                                container.attr('data-id',key);
                                new Like({
                                    container: '.sure',
                                    likeText: "确定",
                                    isDefaultStyle: false,
                                    callback: {
                                        liked: function() {
                                            self.showWin('.tmpl_box3', function () {});
                                        },
                                        likeAnimate: function() {},
                                        initCount: function() {
                                            $('.tbc-dig-button').attr('title','');
                                        },
                                        likeSuccess: function() {
                                            if(bool==true){
                                                // self.consume();
                                                self.jbData(myacid,myasac,ua);
                                            }else{
                                                // self.consume();
                                                self.showWin('.tmpl_box5', function () {});
                                            }
                                        
                                        }
                                    },
                                    counter: {
                                        type: 3,
                                        key: container.attr("data-id")
                                    }
                                });
                            });
                        }
                    }
                },
                function (resJson, retType) {
                    // 失败回调
                    // retType为数字，可以通过lib.mtop.RESPONSE_TYPE枚举来获得具体信息
                }
            );
        });
    }, 
    jbData:function(myacid,myasac,ua){
        var self=this;
        var api ='//go.caipiao.taobao.com/raffle/raffle_index.htm';
        var data = {
            acids:myacid
        };
        new IO({
            url:api,
            dataType:'jsonp',
            data:data,
            success: function(resJson){
                // console.log(resJson._tb_token_);
                var getToken=resJson._tb_token_
                self.jbData2(myacid,myasac,getToken,ua)
            }
        });
    }, 
    jbData2:function(myacid,myasac,getToken,ua){
        var self=this;
        var api ='//go.caipiao.taobao.com/raffle/run_raffle.htm';
        var data = {
            acid: myacid,
            asac: myasac,
            ua:ua,
            _tb_token_: getToken,
            referer: location.href
        };
        new IO({
            url:api,
            dataType:'jsonp',
            data:data,
            success: function(resJson){
                console.log(resJson)
                var code = resJson.result.code;
                var massage = resJson.result.message;
                
                if(code == "GOOD_LUCK"){
                    self.showWin('.dh_box', function () {
                        self._node.all('.toast_tk').all('.bt1').html("恭喜你答对了");
                        self._node.all('.toast_tk').all('.bt2').html("送你20个淘金币");
                    }); 
                }
                else if(code == "BAD_LUCK_BIZ"){
                    self.showWin('.dh_box', function () {
                        self._node.all('.toast_tk').all('.bt1').html("您的金币不够哦，赶快去赚金币吧");
                    }); 
                }
                else if(code == "RULE_MAX_WIN"){
                    self.showWin('.dh_box', function () {
                        self._node.all('.toast_tk').all('.bt1').html("亲，您已经抽过了，留点机会给其他人吧！");
                    }); 
                }
                else{
                    self.showWin('.dh_box', function () {
                        self._node.all('.toast_tk').all('.bt1').html("您未中奖哦！");
                    }); 
                }
            }
        });
    }, 
    // 事件绑定
    bindEvent: function() {
        var self=this;
        self._node.all('.ans-btn').on('click',function(){
            var _this=this;
            var key=$(_this).attr('data-id');
            var bool=false;//答错
            var myacid=$(_this).parent().parent().attr('data-acid'); 
            var myasac=$(_this).parent().parent().attr('data-asac'); 
            var ua=window['getUA']();
            // console.log($(_this));
            self._node.all('.ans-btn').removeClass('btn_yes');
            $(_this).addClass('btn_yes');
            if($(_this).hasClass('ask-right')){
                bool=true;
            }
            Mlogin.check(function(err, isLogin) {
                if (!isLogin) {
                    Mlogin.on("login", function(e) {
                        location.reload();
                    });
                }
                Mlogin.show(function () {
                    if($(_this).hasClass('over')){
                        self.showWin('.dh_box3', function () {});
                    }else{
                        self.checked(key,bool,myacid,myasac,ua);
                    }
                });
            });
        })
        self._node.all('.close').on('click',function(){
            self._node.all('.toast_out').hide();
        })
        Event.delegate(document,'click','.confirm',function(){
            self._node.one('.toast_tk').empty();
            self._node.all('.ans-btn').removeClass('btn_yes');
        });
    }
  };

  return Mod;

});
