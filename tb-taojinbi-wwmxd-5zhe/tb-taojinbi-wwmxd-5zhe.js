KISSY.add('tb-taojinbi-wwmxd-5zhe', function(S, Node, IO, KSJSON, XTemplate, Event, DateFormat, DataLazyload) {

  var api = '//ajax-taojinbi.taobao.com/half/get_half_discount_items.do';

  // 模块初始化函数
  function X(box, module) {

    var self = this;

    self._box = Node.one(box);

    self._headerNode = self._box.one('.tjb-50-off-header');
    self._timerNode = self._box.one('.tjb-50-off-timer');
    self._contentNode = self._box.one('.tjb-50-off-content');

    var timeList = [10,14];
    var len = timeList.length;
    var dataList = self.dataList = [];


    S.each(timeList,function(v,k){
    	var dataListItem = KSJSON.parse(self._box.one('.tjb-50-off-data-' + timeList[k]).html())[0];
        dataList[k] = dataListItem;
    })
    len = timeList.length;


    self.config = KSJSON.parse(self._box.one('.tjb-50-off-config').html())[0];

    var now = self.now = new Date();
    var nowHour = now.getHours();
    var start = null,
      end = null,
      index = null;

    if (nowHour < timeList[1]) {
      start = timeList[0];
      end = timeList[0]+2;
      index = 0;
    }else{
      start = timeList[1];
      end = timeList[1]+3;
      index = 1;
    }


    if (start === null || end === null) {
      throw 'error start end';
    }
    self.current = {
      index: index,
      start: start,
      end: end
    }


    self._timerMarks = [];

    var timerLineNode = self._timerNode.one('.tjb-50-timer-line');
    var inter = timerLineNode.width() / len;
    for (var i = 0; i < len; i++) {
      var mark = Node.one('<div class="timer-mark"><div class="timer-text"><div><div>');
      //mark.css('left', Math.floor((i + 0.5) * inter) + 'px');
      var m_d =  (self.now.getMonth() + 1) + '月' + self.now.getDate()+ '日';
      mark.one('.timer-text').html( m_d + timeList[i] + '点开始');
      timerLineNode.append(mark);
      self._timerMarks[i] = mark;
    }

    self._contentNode.delegate('mouseenter', '.tjb-item', function(e) {
      Node.one(e.currentTarget).addClass('hover');
    });

    self._contentNode.delegate('mouseleave', '.tjb-item', function(e) {
      Node.one(e.currentTarget).removeClass('hover');
    });

    self._timerNode.delegate('click', '.timer-mark', function(e) {
      var mark = Node.one(e.currentTarget);
      if (!mark.hasClass('timer-current')) {
        var index = mark.index() ;
        self.current.index = index;

        if (index === timeList.length) {
          index--
        }

        self.current.start = timeList[index];
        if(index==0||index=="0"){
            self.current.end = timeList[index]+2;
        }else{
            self.current.end = timeList[index]+3;
        }
        self._setTimer(index);
        self._render();
      }
    })

    self._setTimer(self.current.index);
    self._render();
  }


  X.prototype._render = function() {

    var self = this,
      current = self.current;

    var yyyy_m_d = (self.now.getYear() + 1900) + '-' + (self.now.getMonth() + 1) + '-' + self.now.getDate();
    var config = {
      startTime: yyyy_m_d + ' ' + current.start + ':00:00',
      endTime: yyyy_m_d + ' ' + current.end + ':00:00'
    };
    var cIDList = self.dataList[current.index].cIDList;
    var sIDList = self.dataList[current.index].sIDList;
    var iList = self.dataList[current.index].iList;

    if (cIDList) {
      config.cIDList = cIDList;
    }
    if (sIDList) {
      config.sIDList = sIDList;
    }
    if (iList) {
      config.iList = iList;
    }
    //var ids=KSJSON.parse(iList);
    var spid=iList.split(',');
    function sjxr(){
      IO.jsonp(
        api, 
        config, 
        function(data) {
          if(data.success=="true"||data.success==true){
            var lis=[];
            S.each(data.result.resultList,function(v1,k1){
              v1.prc=parseInt(v1.discountPrice);
              v1.sprc='.'+(v1.discountPrice.toString().split('.')[1]||0);
              v1.di=parseInt(v1.decreaseMoney);
              v1.dispc='.'+(v1.decreaseMoney.toString().split('.')[1]||0);
              S.each(spid,function(v2,k2){
                if(v2==v1.itemId){
                  lis.push(v1);
                }
              })
            })
            if(lis[0]=="undefined"||lis[0]==undefined){
              self._itemList = data.result.resultList;
            }else{
              self._itemList = lis;
            }
            
            var maxLineCount = parseInt(self.config.maxLineCount);

            if (maxLineCount && self._itemList.length > maxLineCount * 3) {
              self._itemList.splice(maxLineCount * 3);
            }
            render();
          }else{
            config.cIDList = "";
            config.sIDList = "";
            config.iList = "";
            sjxr();
          }
        });
    }
    sjxr();


    function render() {
      var templateStr = Node.one('.tjb-50-off-template').html();

      var template = new XTemplate(templateStr);
      self._contentNode.html(template.render(self));
      self._lazyload = new DataLazyload({
          diff: 100,
          container: self._box
      })

    }
  }


  X.prototype._setTimer = function(i) {
    var self = this;
    self._timerNode.all('.timer-mark').removeClass('timer-current');
    self._timerMarks[i].addClass('timer-current');
  }

  return X;

}, {
  requires: [
    'node',
    'io',
    'json',
    'xtemplate',
    'event',
    'date/format',
    'kg/datalazyload/2.0.2/'
  ]
});