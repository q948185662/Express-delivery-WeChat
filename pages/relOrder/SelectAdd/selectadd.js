// pages/leftSlide/leftSlide.js
var Bmob = require('../../../utils/bmob.js');

const App = getApp()

Page({
  data: {
    itemData: [],
  },
  selectadd:function(e){
    var item = e.currentTarget.dataset.item;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      address: item.address, receiverName: item.username, receiverPhone:item.userphone
    })
    wx.navigateBack()
  },
  
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (App.globalData.user) {
      this.setData({
        user: App.globalData.user
      })

    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    getAddressList(this)
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})

function getAddressList(t) {
  var Address = Bmob.Object.extend("address");
  var query = new Bmob.Query(Address);
  query.limit(1000);
  query.descending('createdAt');
  query.equalTo('userid', t.data.user.id);
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      //console.log(results);
      let arr = []
      for (var i in results) {
        let a = {}

        a.address = results[i].attributes.address;
        a.userid = results[i].attributes.userid;
        a.username = results[i].attributes.username
        a.userphone = results[i].attributes.userphone
        a.userinfo = results[i].attributes.username + " " + results[i].attributes.userphone;
        a.objectId = results[i].id
        arr.push(a)
      }

      t.setData({
        itemData: arr
      })

    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}