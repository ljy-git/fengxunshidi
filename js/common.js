

// 获取当前坐标位置
function getPosition()
{
    return new Promise(function(resolve) {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(resolve);
        })
}

// 获取当前文件名前缀
function getJsonName()
{
    var str = window.location.pathname;
    var name = str.split("/").pop().split(".")[0];
    return 'data/' + name+'.json';
}


// 获取路径参数
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

// 长宽比锁定组件
Vue.component('lockDiv', function (resolve, reject) {
  Vue.http({url: "template/lockDiv.html"})
  .then(
      function(res){
          resolve({
            template: res.body,
            props:{
                per: {type: [Number,String], default: 100 },
                bg: {type: [String], default: ""},
                link: {type: [String], default: ""}
            },
            data:function (){
                return  {
                    hh:100
                }
            },
            methods: {
                clickH:function(){
                    if(this.link){
                        window.location.href=this.link;
                    }
                }
            },
            mounted: function() {
                this.hh = this.$el.offsetWidth* this.per/100;
            }
          })
    })
});


Vue.component('search_bar', function (resolve, reject) {
  Vue.http({url: "template/search_bar.html"})
  .then(
      function(res){
          resolve({
            template: res.body,
            props:{
                holder: {type: [String], default: "附近商家" }
            },
            data:function (){
                return  {
                    val : ""
                }
            },
            methods: {
                submit:function () {
                  this.$emit("search",this.val);
                }
            }
          })
    })
});

var NAV = [
    {tit:"首页",url:"main.html",ico:"icon-shouye-shouye"},
    {tit:"类目",url:"sort.html",ico:"icon-leimulianjie"},
    {tit:"",url:"shop.html",ico:"icon-dianpu1"},
    {tit:"订单",url:"order.html",ico:"icon-dingdan"},
    {tit:"会员",url:"member.html",ico:"icon-wode"}
];
Vue.component('nav_foot', function (resolve, reject) {
  Vue.http({url: "template/nav_foot.html"})
  .then(
      function(res){
          resolve({
            template: res.body,
            props:{
                active: {type: [Number], default: 0 }
            },
            data:function (){
                return  {
                    list : NAV
                }
            },
            methods: {
            }
          })
    })
});

Vue.component('sku', function (resolve, reject) {
  Vue.http({url: "template/sku.html"})
  .then(
      function(res){
          resolve({
            template: res.body,
            props:{
                sku_id: {type: [Number], default: 0 },
                price: {type: [Number], default: 0 },
                badge: {type: [String], default: "" },
                src: {type: [String], default: "images/nopic.jpg" }
            },
            data:function (){
                return  {
                    
                }
            },
            methods: {
            }
          })
    })
});


Vue.component('popDetail', function (resolve, reject) {
  Vue.http({url: "template/popDetail.html"})
  .then(
      function(res){
          resolve({
            template: res.body,
            props:{
                show: {type: [Boolean], default: false },
                hh: {type: [Number], default: 80 }
            },
            data:function (){
                return  {
                    arr_nav : NAV
                }
            }
          })
    })
});


Vue.component('menuTop', function (resolve, reject) {
  Vue.http({url: "template/menuTop.html"})
  .then(
      function(res){
          resolve({
            template: res.body,
            props:{
                url_up: {type: [String], default: "main.html" },
                skin: {type: [String], default: "" }
            },
            data:function (){
                return  {
                    arr_nav : NAV,
                    w0 : WEATHER_ICO[weather_id],
                    w1:weather_qw[0],
                    w2:weather_qw[1],
                    tel: "tel:"+TEL
                }
            },
            methods: {},
            mounted: function() {

                var _this = this;

                // 收费天气接口，暂时关掉
                Vue.http.get("http://api.yytianqi.com/forecast7d?city=CH250101&key=j04220af8ob1a7ca")
                  .then(function (e) {
                    _this.w0 = WEATHER_ICO[e.body.data.list[0].numtq1];
                    _this.w1 = e.body.data.list[0].qw1;
                    _this.w2 = e.body.data.list[0].qw2;
                  });
            },
          })
    })
});

var mixin_common = {
    data:{
         is_pop_nav_active:false,    //当前导航弹窗打开状态
         detail_current:{},
         is_pop_detail_active:false
    },
    created: function() {
    },

    mounted: function() {

    },
    methods: {
        guideH:function () {
            console.log('一键导航');
        },

        // 打开详情弹窗
        detailH:function (obj) {
            this.detail_current = obj;
            this.is_pop_detail_active = true;
        }
    }
    
};

var mixin_infinite = {
    data:{
         page:1
    },
    created: function() {},
    mounted: function() {},
    methods: {
        loadList:function() {
            this.$http.get(this.json_pre+"?page="+this.page)
            .then(function (e) {
                this.my.list = this.my.list.concat(e.body.list);

                if (e.body.flag_end) {
                    console.log("已到末尾!");
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }

                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
            });
        }
    }
    
};

var mixin_get_position = {
    data:{
         lat:0,
         lng:0
    },

    mounted: function() {
        getPosition().then(function(position) {
            this.lat = position.point.lat;
            this.lng = position.point.lng;
        }.bind(this));
    },
    methods: {
        gp:function (navi) {
            var str = 'http://api.map.baidu.com/direction?origin=latlng:'+this.lat+','+this.lng+'|name:当前位置&destination='+ navi + '&mode=driving&region=长沙&output=html';
            return str;
        }
    }
    
};



Vue.component('count-down', function (resolve, reject) {
  Vue.http({url: "template/count-down.html"})
  .then(
      function(res){
          resolve({
            template: res.body,
            props:{
                endTime: {type: [String], default: "" },
                endText: {type: [String], default: "已结束" },
                callback : {
                        type : Function,
                        default :""
                      }
            },
            data:function (){
                return  {
                    content: '',
                }
            },
            methods: {
              countdowm(timestamp){
                    let self = this;
                    let timer = setInterval(function(){
                      let nowTime = new Date();
                      let endTime = new Date(timestamp * 1000);
                      let t = endTime.getTime() - nowTime.getTime();
                      if(t>0){
                        let day = Math.floor(t/86400000);
                        let hour=Math.floor((t/3600000)%24);
                        let min=Math.floor((t/60000)%60);
                        let sec=Math.floor((t/1000)%60);
                        hour = hour < 10 ? "0" + hour : hour;
                        min = min < 10 ? "0" + min : min;
                        sec = sec < 10 ? "0" + sec : sec;
                        let format = '';
                        if(day > 0){
                          format = `${day}天${hour}小时${min}分${sec}秒`;
                        } 
                        if(day <= 0 && hour > 0 ){
                          format = `${hour}小时${min}分${sec}秒`; 
                        }
                        if(day <= 0 && hour <= 0){
                          format =`${min}分${sec}秒`;
                        }
                        self.content = format;
                        }else{
                         clearInterval(timer);
                         self.content = self.endText;
                         self._callback();
                        }
                       },1000);
                      },
                      _callback(){
                      if(this.callback && this.callback instanceof Function){
                         this.callback(...this);
                       }
                      }
            },
            mounted: function() {

                this.countdowm(this.endTime)
            },
          })
    })
});
