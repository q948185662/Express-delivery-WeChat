var Bmob = require('../../utils/bmob.js');
var Base64 = require('../../utils/Base64.js');
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  phone: function () {
    if (this.data.user.phone ==='您还未绑定手机号')
          wx.navigateTo({    
            url: "/pages/Phone/phone",
           
          })
          else{
          wx.navigateTo({   
            url: "/pages/Phone2/phone2"
          })
          }

  },
  address:function(e){
    wx.navigateTo({
      url: '/pages/Address/address',
    })
  },
  AboutUs:function(e){
    wx.navigateTo({
      url: '/pages/About/about'
    })
  },
  orders:function(){
    wx.navigateTo({
      url: '/pages/Orders/orders',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   
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
    if (app.globalData.user.phone != '您还未绑定手机号') {
      this.setData({
        user: app.globalData.user,
        phone: Base64.decode(app.globalData.user.phone)
      })
    }
    else{
      this.setData({
        user: app.globalData.user,
        phone: '您还未绑定手机号'
      })
    }
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
    
  }
})

