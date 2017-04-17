<?php
/**
 * 模块内容必须写在 _tms_module_begin 和 _tms_module_end 标签之间
 */
_tms_module_begin('{"name":"tb-taojinbi-prolist-xsj"}');
 $htitle = _tms_custom('{"name":"htitle","title":"楼层标题","group":"楼层标题","row":"1","defaultRow":"1","fields":"img:图片地址:img"}');
 $datasubject = _tms_custom('{"name":"subjectes","title":"数据配置","group":"折上折","fields":"sIdList:主题ID列表[以，分割]:string,cIdList:淘宝后台类目ID[以，分割]:string,iList:宝贝ID列表[以，分割]:string,pf:商品是否包邮[是：y否：n]:string,coinPrFl:淘金币价格下限:string,coinPrCe:淘金币价格上限:string,salesFl:30天销量下限:string,saleCe:30天销量上限:string,disFl:抵扣比例下限:string,disCe:抵扣比例上限:string,disPrFl:抵扣金额下限:string,disPrCe:抵扣金额上限:string,sizeNum:输出商品个数:string,sort:商品排序规则[按照销量排序：sales；按照（淘金币）价格降序：price：des；按照（淘金币）价格升序：price：asc；按照抵扣金额从高到低排序：decrease_money；按照抵扣比例从高到低排序：rate；随机为空]:string,st:状态[排期成功：schedule_success；上线：online；默认为上线状态]:string,modSize:总共个数:string,startTimeFl:开始时间下限:string,startTimeCe:开始时间上限:string,endTimeFl:结束时间下限:string,endTimeCe:结束时间上限:string,hasLesPr:是否需要历史最低价[不为空则要]:string","row":"1","defaultRow":"1"}');
?>
<div class="tb-module tb-taojinbi-prolist-xsj tb-lazyload">
<!-- 自定义模块内容: start -->
    <div class="w990">
        <img data-ks-lazyload="<?=$htitle[0]['img']?>" src="http://g.tbcdn.cn/s.gif">
         <ul class="clearfix PreItemUl" sIdList="<?=$datasubject[0]['sIdList']?>" cIdList="<?=$datasubject[0]['cIdList']?>" iList="<?=$datasubject[0]['iList']?>" pf="<?=$datasubject[0]['pf']?>" coinPrFl="<?=$datasubject[0]['coinPrFl']?>" coinPrCe="<?=$datasubject[0]['coinPrCe']?>" salesFl="<?=$datasubject[0]['salesFl']?>" saleCe="<?=$datasubject[0]['saleCe']?>" disFl="<?=$datasubject[0]['disFl']?>" disCe="<?=$datasubject[0]['disCe']?>" disPrFl="<?=$datasubject[0]['disPrFl']?>" disPrCe="<?=$datasubject[0]['disPrCe']?>" sizeNum="<?=$datasubject[0]['sizeNum']?>" sort="<?=$datasubject[0]['sort']?>" st="<?=$datasubject[0]['st']?>" modSize="<?=$datasubject[0]['modSize']?>"  startTimeFl="<?=$datasubject[0]['startTimeFl']?>" startTimeCe="<?=$datasubject[0]['startTimeCe']?>" endTimeFl="<?=$datasubject[0]['endTimeFl']?>" endTimeCe="<?=$datasubject[0]['endTimeCe']?>" hasLesPr="<?=$datasubject[0]['hasLesPr']?>"></ul>
    </div>
    <script type='kissy/xtemplate' class="tpl1">
        {{#each data}}
        <li class="itemli {{#if xindex%3===2}} last {{/if}}">
            <a href="//item.taobao.com/item.htm?id={{itemid}}" target="_blank" class="fixfloat">
                <div class="interest-templ">
                    {{#if itemPhoto}}
                    <img data-ks-lazyload="{{itemPhoto}}_320x320.jpg" title="{{title}}" class="itempic">
                    {{else}}
                    <img data-ks-lazyload="{{img}}_320x320.jpg" title="{{title}}" class="itempic">
                    {{/if}}
                    {{#if shopLogo}}
                    <img src="{{shopLogo}}_60x30.jpg" alt="" class="logo">
                    {{/if}}
                    <div class="wrap">
                        {{#if point1}}
                        <div class="interest-wrap">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr><td vlign="middle"><p class="interest line1">{{point1}}</p>   </td></tr>
                                <tr><td vlign="middle"><p class="interest line2">{{point2}}</p></td></tr>
                                <tr><td vlign="middle"><p class="interest main-interest line3">{{{point3}}}</p></td></tr>
                            </table>
                        </div>
                        {{/if}}
                        {{#if isAndPay}}
                        <i class="deduction"></i>
                        {{/if}}
                    </div>
                </div>
                <div class="item-des">
                    <p class="item-name"><span class="post-free">{{isPostFree}}</span>{{title}}</p>
                           <span class="item-prc">
                               <span class="xprice">
                           <em class="Ameri">&yen;</em><strong>{{prc}}<span class="sprc">{{sprc}}</span></strong>
                               </span>
                           <del>&yen;{{prced}}</del>
                           <br>
                           <span class="item-sale"><em>{{howNum}}</em>人已买</span>
                           </span>

                    {{#if dijia!=="0"}}
                    <span class="item-di">&yen;<strong>{{di}}</strong>{{dispc}}</span>
                    {{/if}}
                </div>
            </a>
        </li>
        {{/each}}
    </script>

<!-- 自定义模块内容: end -->
</div>
<?php _tms_module_end(); ?>