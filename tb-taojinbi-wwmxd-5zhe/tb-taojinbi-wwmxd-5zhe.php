<?php
/**
 * 模块内容必须写在 _tms_module_begin 和 _tms_module_end 标签之间
 */
_tms_module_begin('{"name":"tb-taojinbi-wwmxd-5zhe"}'); 
$config = _tms_custom('{"name":"config","title":"模块全局配置","group":"分组","row":"1","defaultRow":"1","fields":"title:楼层标题:string,titleImage:标题图片URL:url,maxLineCount:最大行数:number"}');
$data10 = _tms_custom('{"name":"data_10","title":"10点的配置","group":"分组","row":"1","defaultRow":"1","fields":"isShow:是否显示该时段:boolean,sIDList:主题ID英文逗号分隔:string,cIDList:大淘宝类目ID英文逗号分隔:string,iList:商品ID英文逗号分隔:string"}');
$data14 = _tms_custom('{"name":"data_14","title":"14点的配置","group":"分组","row":"1","defaultRow":"1","fields":"isShow:是否显示该时段:boolean,sIDList:主题ID英文逗号分隔:string,cIDList:大淘宝类目ID英文逗号分隔:string,iList:商品ID英文逗号分隔:string"}');
?>
<div class="tb-module tb-taojinbi-wwmxd-5zhe by_floors" id="floor1" data-tit="<?=$config[0]['title']?>">
<!-- 自定义模块内容: start -->
  <div class="tjb-50-off-container">
    <img class="tjb_bgimg" data-ks-lazyload="//img.alicdn.com/tps/i2/TB1UJR_KVXXXXXfapXXJJDuKXXX-572-764.png"/>
    <div class="tjb-50-off-header">
      <img src="<?=$config[0]['titleImage']?>"/>
    </div>

    <div class="tjb-50-off-timer">
      <div class="tjb-50-timer-line">
      </div>
    </div>
    
    <div class="tjb-50-off-content"></div>
    

    <div class="clear"></div>

  </div>

  <script type="kissy/xtemplate" class="tjb-50-off-template">
    
    {{#each _itemList}}
    <div class='tjb-item'>

      <a class="tjb-item-link" href="{{itemUrl}}" target="_blank">

      {{#if stock===0}}
        <div class="tjb-item-finish"></div>
      {{/if}}

      <div class='tjb-item-point'>
        <div class='tjb-item-point1'>{{point1}}</div>
        <div class='tjb-item-point2'>{{point2}}</div>
        <div class='tjb-item-point3'>{{point3}}</div>
      </div>

      <div class="tjb-item-image">
      
          {{#if itemPhoto}}
          <img data-ks-lazyload="{{itemPhoto}}_320x320"/>
          {{else}}
          <img data-ks-lazyload="{{pic}}_320x320"/>
          {{/if}}

      </div>

      <div class="tjb-item-detail">
        <div class="tjb-item-title">
          {{#if postFree}}
            <span class="before-title">[<span class="before-title-span">包邮</span>]</span>
          {{/if}}
            {{itemName}}
          {{#if postFree}}
            <span class="after-title">包邮</span>
          {{/if}}
        </div>

        <div class="tjb-item-price">
          <span class="price">￥<em>{{prc}}</em>{{sprc}}</span>

          {{#if stock===0}}

            <span class="sell-count"><em>{{sellCount}}</em>人已买</span>

          {{else}}

            {{#if coinPrice}}
              <span class="plus">+</span>
              <span class="icon"></span>
              <span class="coin-price">{{coinPrice}}<span class="tjb-text">淘金币</span></span>
            {{/if}}

          {{/if}}

          <div class="tjb-item-ori-price">
            <del>￥{{originPrice}}</del>
          </div> 

        </div>
        {{#if stock===0}}
          <span class="item-di">￥<strong>{{di}}</strong>{{dispc}}</span>
        {{/if}}
      </div>
      </a>

    </div>
    {{/each}}

    <div class="clear"></div>

  </script>

  <script type="text/plain" class="tjb-50-off-config">
    <?php echo _tms::json_encode($config); ?>
  </script>
  <script type="text/plain" class="tjb-50-off-data-10">
    <?php echo _tms::json_encode($data10); ?>
  </script>
  <script type="text/plain" class="tjb-50-off-data-14">
    <?php echo _tms::json_encode($data14); ?>
  </script>

<!-- 自定义模块内容: end -->
</div>
<?php _tms_module_end(); ?>