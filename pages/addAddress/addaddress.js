var Bmob = require('../../utils/bmob.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    name:'',
    phone:''
  },
  addAddress: function (e) {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  selectAdd: function (e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        console.log(res.address)
        that.setData({
          address: res.name
        })
      },
      fail: function(res) {},
      complete: function(res) {},
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
  nameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  addressInput:function(e){
    this.setData({
      address: e.detail.value
    })
  },
  addAddress:function(e){
    var add = this.data.address;
    var name = this.data.name;
    var phone=this.data.phone;
    
    var userid=this.data.user.id;
    if (add === '' || name === '' || phone === '') {
      wx.showModal({
        title: '错误',
        content: '信息未完善',
      })
    }
    else{
    wx.showToast({
      title: '保存成功',
      duration: 5000,
      success: function () {
        setTimeout(function () {
          var Address = Bmob.Object.extend("address");
          var address = new Address();
          address.set("userid", userid);
          address.set("address",add)
          address.set('username',name)
          address.set("userphone", phone);
          address.save(null, {
            success: function (result) {
              // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
              console.log("地址添加成功, objectId:" + result.id);
            },
            error: function (result, error) {
              // 添加失败
              console.log('失败');
              console.log(error)
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