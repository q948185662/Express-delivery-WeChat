var Bmob = require('../../utils/bmob.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  modifyAddress: function (e) {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.user) {
      this.setData({
        user: app.globalData.user
      })
    }
    let additem = JSON.parse(options.jsonStr);
    this.setData({
      additem:additem
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  modifyAddress: function (e) {
    var add = this.data.address;
    var name = this.data.name;
    var phone = this.data.phone;
   
    var objectId=this.data.additem.objectId;
    if (add === '' || name === '' || phone === '') {
      wx.showModal({
        title: '错误',
        content: '信息未完善',
      })
    }
    else{
    wx.showToast({
      title: '修改成功',
      duration: 5000,
      success: function () {
        setTimeout(function () {
          var Address = Bmob.Object.extend("address");
          var query = new Bmob.Query(Address);
          query.get(objectId, {
            success: function (result) {
              // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
              result.set('address', add);
              result.set('username',name);
              result.set('userphone', phone);
              result.save();

              // The object was retrieved successfully.
            },
            error: function (object, error) {

            }
          });
         
          wx.switchTab({
            url: "../myInfo/myinfo",
          })
        }, 2000)

      }
    })
  }
  }
})