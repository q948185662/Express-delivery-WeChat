var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapFile = require('../../utils/amap-wx.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '76QBZ-YIREI-J3LGI-5JJOD-VJAXJ-UFBMB' // 必填
});

var myAmapFun = new amapFile.AMapWX({
  key: 'f37445a4727c3947d299f985fef031f9'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: null,
    final: null,
    distance:'',
    cost:'',
    polyline: [],
    pline1: [],
    pline2: [],
    step: {},
    steps1: {},
    steps2: {},
    latitude:'',
    longitude:'',
    dis1:'',
    dis2: '',
    c1:'',
    c2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      start: options.start,
      final: options.final
    })
    
    var that = this
    wx.getLocation({
      success: function(res) {
        type: 'gcj02',
        that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          'markers[0]': {
            id: 0,
            title: res.title,
            latitude: res.latitude,
            longitude: res.longitude
          },
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  formSubmit(e) {
    var _this = this;
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: _this.data.final, //地址参数，例：固定地址，address: '杭州市拱墅区湖州街51号'
      success: function(res) { //成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          'markers[1]': {
            id: 0,
            title: res.title,
            latitude: latitude,
            longitude: longitude,
            iconPath: '../images/final.png', //图标路径
            width: 20,
            height: 20
          },
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          }
        });
        //路线规划
        myAmapFun.getDrivingRoute({
          origin: _this.data.markers[0].longitude + ',' + _this.data.markers[0].latitude,
          destination: _this.data.markers[1].longitude + ',' + _this.data.markers[1].latitude,
          success: function(data) {
            console.log(data)
            var points = [];
            if (data.paths && data.paths[0] && data.paths[0].steps) {
              _this.setData({
                steps1: data.paths[0].steps
              });
              var steps = data.paths[0].steps;
              for (var i = 0; i < steps.length; i++) {
                var poLen = steps[i].polyline.split(';');
                for (var j = 0; j < poLen.length; j++) {
                  points.push({
                    longitude: parseFloat(poLen[j].split(',')[0]),
                    latitude: parseFloat(poLen[j].split(',')[1])
                  })
                }
              }
            }
            _this.setData({
              pline1: [{
                points: points,
                color: "#0091ff",
                width: 6
              }]
            });
            if (data.paths[0] && data.paths[0].distance) {
              _this.setData({
                dis1: data.paths[0].distance
              });
            }
            if (data.taxi_cost) {
              _this.setData({
                c1:'打车约' + parseInt(data.taxi_cost) + '元'
              });
            }

          }
        });
        console.log(_this.data.markers[0].latitude + ',' + _this.data.markers[0].longitude)
        console.log(_this.data.markers[1].latitude + ',' + _this.data.markers[1].longitude)
        
        //wx_map api调用比较距离，选择最短距离
        qqmapsdk.direction({
          mode: 'driving', //'transit'(公交路线规划)
          //from参数不填默认当前地址
          from: _this.data.markers[0].latitude + ',' + _this.data.markers[0].longitude,
          to: _this.data.markers[1].latitude + ',' + _this.data.markers[1].longitude,
          success: function(res) {
            console.log(res);
            var ret = res;
            var pl = [];
            var coors = ret.result.routes[0].polyline;
            //获取各个步骤的polyline

            //坐标解压（返回的点串坐标，通过前向差分进行压缩）
            var kr = 1000000;
            for (var i = 0; i < coors.length; i++) {
              console.log(Number(coors[i - 2]))
              coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
            }
            //将解压后的坐标放入点串数组pl中
            for (var i = 0; i < coors.length; i += 2) {
              pl.push({
                latitude: coors[i],
                longitude: coors[i + 1]
              })
            }
            
            //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
            _this.setData({
              latitude: pl[0].latitude,
              longitude: pl[0].longitude,
              dis2: ret.result.routes[0].distance,
              c2: ret.result.routes[0].taxi_fare.fare,
              step2:ret.result.routes[0].steps,
              pline2: [{
                points: pl,
                color: '#FF0000DD',
                width: 4
              }]
            })
            //进行举例比较选取最佳线路
            // if (_this.data.dis1 > _this.data.dis2) {
            //   console.log(_this.data.dis1)
            //   console.log(_this.data.dis2)
            //   _this.setData({
            //     polyline: _this.data.pline2,
            //     distance: _this.data.dis2,
            //     cost: _this.data.c2,
            //     steps: _this.data.steps2
            //   })
            // } else
             {
              _this.setData({
                polyline: _this.data.pline1,
                distance: _this.data.dis1,
                cost: _this.data.c1,
                steps: _this.data.steps1
              })
            }
          },
          fail: function(error) {
            console.error(error);
          },
          complete: function(res) {
            console.log(res);
          }
        });
        
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });

  },
  goToCar: function(e) {
    wx.redirectTo({
      url: '../Route/route?start=' + this.data.start + '&final=' + this.data.final
    })
  },
  goToBus: function(e) {
    wx.redirectTo({
      url: '../Route_bus/route_bus?start=' + this.data.start + '&final=' + this.data.final
    })
  },
  goToRide: function(e) {
    wx.redirectTo({
      url: '../Route_ride/route_ride?start=' + this.data.start + '&final=' + this.data.final
    })
  },
  goToWalk: function(e) {
    wx.redirectTo({
      url: '../Route_walk/route_walk?start=' + this.data.start + '&final=' + this.data.final
    })
  }
})