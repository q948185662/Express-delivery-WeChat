//获取应用实例
var Bmob = require('../../utils/bmob.js');
var app = getApp()
Page({
  data: {
    currentTab: 1,
    relOrderList:{},
    accOrderList:{},
    relFinOrderList:{},
    accFinOrderList: {},
    scrollHeight:0,
    isshow:-1,
    isshwo1:-1
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      isshow: -1,
      isshwo1: -1
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        isshow: -1,
        isshwo1: -1
      })
    }
  },


  callEvent: function (e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNum
    })
  },

  // 加载
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    // var that = this
    // //更新数据
    // that.setData({
    // })
    if (app.globalData.user) {
      this.setData({
        user: app.globalData.user
      })
    }
    else{
      throw "账户异常";
    }
    this.setData({
      scrollHeight: app.globalData.screenHight,
    })
  
  },
  onShow:function(){
    getRelOrderList(this);
    getAccOrderList(this);
    getRelFinOrderList(this);
    getAccFinOrderList(this);
    this.setData({
      isshow: -1,
      isshwo1: -1
    })
  },
  showButton:function(e){
    console.log(e)
    this.setData({
      isshow: e.currentTarget.dataset.index,
      
    })
  },
  showButton1: function (e) {
    console.log(e)
    this.setData({
      isshow1: e.currentTarget.dataset.id
    })
  },
  cancelRelOrder: function (e){
    let order = e.currentTarget.dataset.items;
    console.log(e)
    if(order.transerId
!==""){
      wx.showModal({
        title: '失败',
        content: '您的订单已有人接单，无法取消，如果需要取消，请与接单人联系！',
      })
    }
    else{
      wx.showModal({
        title: '提醒：',
        content: '您确定要取消此单吗？'
        ,
        success: function (res) {
          if (res.confirm) {
            //支付界面
            wx.showToast({
              title: '成功',
              duration: 5000,
              success: function () {
                setTimeout(function () {
                  var Order = Bmob.Object.extend("order");
                  var query = new Bmob.Query(Order);
                  query.equalTo('orderId', order.orderId);
                  query.find().then(function (todos) {
                    return Bmob.Object.destroyAll(todos);
                  }).then(function (todos) {
                    console.log(todos);
                    // 删除成功
                  }, function (error) {
                    // 异常处理
                  });
                  wx.switchTab({
                    url: "../Search/search",
                  })
                }, 2000)

              }
            })
          } else if (res.cancel) {
            //失败
          }
        }
      })
    }
  },
  confirmRelOrder:function(e){
    let order = e.currentTarget.dataset.items;
    var that = this;
    wx.showModal({
      title: '提醒：',
      content: '您确定您的快递已经送达吗？'
      ,
      success: function (res) {
        if (res.confirm) {
          //支付界面
          wx.showToast({
            title: '成功',
            duration: 5000,
            success: function () {
              setTimeout(function () {
                var Order = Bmob.Object.extend("order");
                var query = new Bmob.Query(Order);
                query.equalTo('orderId', order.orderId);
                var objectId;
                query.find({
                  success: function (results) {
                    // 循环处理查询到的数据
                    //console.log(results);
                    objectId = results[0].objectId;

                  },
                  error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                  }
                });
                query.get(objectId, {
                  success: function (results) {
                    results.set('orderStatus', '已送达');
                    results.save();
                  },
                  error: function (objext, error) {
                    console.log(error);
                  }
                })
                wx.switchTab({
                  url: "../Search/search",
                })
              }, 2000)

            }
          })
        } else if (res.cancel) {
          //失败
        }
      }
    })
  },
  cancelAccOrder:function(e){
    let order = e.currentTarget.dataset.items;
    var that = this;
    wx.showModal({
      title: '提醒：',
      content: '您确定要取消此单吗？'
      ,
      success: function (res) {
        if (res.confirm) {
          //支付界面
          wx.showToast({
            title: '成功',
            duration: 5000,
            success: function () {
              setTimeout(function () {
                var Order = Bmob.Object.extend("order");
                var query = new Bmob.Query(Order);
                query.equalTo('orderId', order.orderId);
                var objectId;
                query.find({
                  success: function (results) {
                    // 循环处理查询到的数据
                    //console.log(results);
                    objectId = results[0].objectId;

                  },
                  error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                  }
                });
                query.get(objectId, {
                  success: function (results) {
                    results.set('transerId', "");
                    results.set('transerAvatarUrl', "");
                    results.set('transerPhone', "");
                    results.set('orderStatus', '未接单');
                    results.save();
                  },
                  error: function (objext, error) {
                    console.log(error);
                  }
                })
                wx.switchTab({
                  url: "../Search/search",
                })
              }, 2000)

            }
          })
        } else if (res.cancel) {
          //失败
        }
      }
    })
  },
  confirmAccOrder:function(e){
    let order = e.currentTarget.dataset.items;
    var that = this;
    wx.showModal({
      title: '提醒：',
      content: '您确定已经送达吗？'
      ,
      success: function (res) {
        if (res.confirm) {
          //支付界面
          wx.showToast({
            title: '成功',
            duration: 5000,
            success: function () {
              setTimeout(function () {
                var Order = Bmob.Object.extend("order");
                var query = new Bmob.Query(Order);
                query.equalTo('orderId', order.orderId);
                var objectId;
                query.find({
                  success: function (results) {
                    // 循环处理查询到的数据
                    //console.log(results);
                    objectId = results[0].objectId;

                  },
                  error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                  }
                });
                query.get(objectId, {
                  success: function (results) {
                    results.set('orderStatus', '待确认');
                    results.save();
                  },
                  error: function (objext, error) {
                    console.log(error);
                  }
                })
                wx.switchTab({
                  url: "../Search/search",
                })
              }, 2000)

            }
          })
        } else if (res.cancel) {
          //失败
        }
      }
    })
  },
  toHere:function(e){
    let order = e.currentTarget.dataset.items;
    console.log(order)
    console.log('ding')
    wx.navigateTo({
      url: '/pages/Route/route?start='+order.start+'&final='+order.receiverAddress
    })
  },
  callTranser:function(e){
    let order = e.currentTarget.dataset.items;
    console.log(order.transerPhone)
    if(order.transerPhone===""){
      wx.showModal({
        title: '失败',
        content: '您的订单无人接单！',
      })
    }
    else{
      wx.makePhoneCall({
        phoneNumber: order.transerPhone 
      })
    }
  },
  callReceiver:function(e){
    let order = e.currentTarget.dataset.items;
    wx.makePhoneCall({
      phoneNumber: order.receiverPhone 
    })
  }
})
function getRelOrderList(t) {
  var Order = Bmob.Object.extend("order");
  var query = new Bmob.Query(Order);
  query.limit(1000);
  query.descending('createdAt');
  query.equalTo("receiverId", t.data.user.id);
  query.notEqualTo("orderStatus", "已送达");
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      t.setData({
        relOrderList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getAccOrderList(t) {
  var Order = Bmob.Object.extend("order");
  var query = new Bmob.Query(Order);
  query.limit(1000);
  query.descending('createdAt');
  query.equalTo("transerId", t.data.user.id);
  query.notEqualTo("orderStatus", "已送达");
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      t.setData({
        accOrderList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}
function getRelFinOrderList(t){
  var Order = Bmob.Object.extend("order");
  var query = new Bmob.Query(Order);
  query.limit(1000);
  query.descending('createdAt');
  query.equalTo("receiverId", t.data.user.id);
  query.equalTo("orderStatus", "已送达");
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      t.setData({
        relFinOrderList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getAccFinOrderList(t) {
  var Order = Bmob.Object.extend("order");
  var query = new Bmob.Query(Order);
  query.limit(1000);
  query.descending('createdAt');
  query.equalTo("transerId", t.data.user.id);
  query.equalTo("orderStatus", "已送达");
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      t.setData({
        accFinOrderList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}
