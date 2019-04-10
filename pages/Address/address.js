
 var Bmob = require('../../utils/bmob.js');
var Base64 = require('../../utils/Base64.js');
const App = getApp()


Page({
  data: {
    itemData:[],
  },

  modify: function (e) {
    var item = e.currentTarget.dataset.item;
    let str = JSON.stringify(item);
    wx.navigateTo({
      url: '/pages/modifyAddress/modifyaddress?jsonStr=' + str
    })
    
  },
  addAddress: function (e) {
    wx.navigateTo({
      url: '/pages/addAddress/addaddress',
    })
  },
  touchS: function (e) {  // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchM: function (e) {  // touchmove
    let itemData = App.Touches.touchM(e, this.data.itemData, this.data.startX)
    itemData && this.setData({ itemData })

  },
  touchE: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let itemData = App.Touches.touchE(e, this.data.itemData, this.data.startX, width)
    itemData && this.setData({ itemData })
  },
  itemDelete: function (e) {  // itemDelete
    let itemData = App.Touches.deleteItem(e, this.data.itemData)
    itemData && this.setData({ itemData })
    //console.log(itemData)
    deleteAddress(e.currentTarget.dataset.item)
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
      let arr=[]
      for(var i in results){
        let a={}
       
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
function deleteAddress(item){
  var Address = Bmob.Object.extend("address");
  var query = new Bmob.Query(Address);
  query.equalTo('objectId', item.objectId);
  query.find().then(function (todos) {
    return Bmob.Object.destroyAll(todos);
  }).then(function (todos) {
    console.log(todos);
    // 删除成功
  }, function (error) {
    // 异常处理
  });
}



































