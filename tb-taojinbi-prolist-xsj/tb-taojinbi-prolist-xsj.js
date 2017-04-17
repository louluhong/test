KISSY.add('tb-taojinbi-prolist-xsj', function (S,Node,Event,IO) {

	// 模块初始化函数
	function X (box, module) {

        var $=Node.all;
		// code here
            var PreItemUl =  $(".PreItemUl",$(module));
            S.use('xtemplate,datalazyload',function(S,XTemplate,DataLazyload){
                var tpl = $('.tpl1',$(module)).html();
                var data_render = (function(box, tpl){
                    var preItemUl = box;
                    var template = new XTemplate(tpl);
                    function render(data){
                        var html = template.render(data);
                        preItemUl.html(html);
                    }
                    return {
                        render: render
                    }
                })(PreItemUl, tpl);

                function data_fixed(data){
                    var newData = {data:[]};
                    var d = data.items;
                    for(var i= 0;i<d.length;i++){
                        if(d[i].isPostFree)
                        {
                            isPostFree="[包邮]"
                        }
                        else{
                            isPostFree=""
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
                            itemPhoto: d[i].item_photo
                        }
                    }
                    return newData;
                }
                var sIdList = PreItemUl.attr('sIdList'),//主题id
                    cIdList = PreItemUl.attr('cIdList'),
                    iList = PreItemUl.attr('iList'),
                    pf = PreItemUl.attr('pf'),
                    coinPrFl = PreItemUl.attr('coinPrFl'),
                    coinPrCe = PreItemUl.attr('coinPrCe'),
                    salesFl = PreItemUl.attr('salesFl'),
                    saleCe = PreItemUl.attr('saleCe'),
                    disFl = PreItemUl.attr('disFl'),
                    disCe = PreItemUl.attr('disCe'),
                    disPrFl = PreItemUl.attr('disPrFl'),
                    disPrCe = PreItemUl.attr('disPrCe'),
                    sizeNum = PreItemUl.attr('sizeNum'),//数量
                    sort = PreItemUl.attr('sort'),
                    st = PreItemUl.attr('st'),
                    modSize = PreItemUl.attr('modSize');


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
                            //console.log(d.items)
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
                        new DataLazyload();
                    })
                }

                preheatItem();

            });

        KISSY.use('gallery/datalazyload/1.0.1/',function(){
            var lazy = new KISSY.DataLazyload({
                diff:200
            });
        })

    }

	return X;

}, {
	requires: ['node','event','io']
});
