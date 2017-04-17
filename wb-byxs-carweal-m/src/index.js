/**
 * @author {徐伟萍}({WB033476})
 * @version 0.0.1
 */
define(function(require) { // eslint-disable-line no-unused-vars
    //var itemTpl = require('./item.jst.html');
    var lazy=require('kg/km-lazyload');
    var libmtop = require('kg/km-mtop');
    //var XCtrl = require('kg/xctrl');
    var Login = require("mtb/lib-login");
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

        self.$container = $(container);
         if (!conf) {
            conf = $.parseJSON(self.$container.find('.J_conf').html());
        }
        self._conf = conf;
        self.login();
        //self.loadData(conf);
    },
    // 加载数据
    loadData: function(conf) { // eslint-disable-line no-unused-vars
        var self = this;

        //XCtrl逻辑，参考文档：http://gitlab.alibaba-inc.com/tbc/market/blob/master/xctrl.md
         XCtrl.dynamic(conf, "items", function (data) {
            //数据处理，模板渲染
            self.$container.find('.prolist').html(itemTpl(data));
            //模板完绑定事件
             
             self.$container.find('.J_tb_lazyload').lazyload({
                offsetY: 100
            });
        });
    },
    login:function(){
      var self = this;

      if(location.href.indexOf('tms')<0){
        console.log("1")
        if(!lib.login.isLogin()){
          console.log("2");
           lib.login.goLogin();
        }
      }
    },
    _updateCoinInfo: function () {
            var self = this;
            console.log("1");
            lib.mtop.request({
                    api: 'mtop.matrixexchange.wireless.userInfo.get',
                    v: '1.0',
                    data: {},
                    type: 'get', // 默认get
                    dataType: 'jsonp', // 默认jsonp
                    timeout: 20000 // 接口超时设置，默认为20000ms
                },
                function (resJson, retType) {
                    // 更新金币信息
                    console.log(resJson)
                    var totalCoinString = "" + resJson.data.totalCoin;
                    console.log("淘金币剩余：",totalCoinString)
                    $('.J_Num').html(totalCoinString);
                },
                function (resJson, retType) {
                    // 失败回调
                    // retType为数字，可以通过lib.mtop.RESPONSE_TYPE枚举来获得具体信息
                }
            );
        },
    // 事件绑定
    bindEvent: function() {

    }
  };

  return Mod;

});
