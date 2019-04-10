var Bmob = require('../../utils/bmob.js');
var Base64 = require('../../utils/Base64.js')
var app = getApp()
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    userPhone: "",
    userPassword:"",
time: '获取验证码', //倒计时 
    currentTime: 61
    
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
  usernuminput: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  userpasswordinput: function (e) {
    this.setData({
      userPassword: e.detail.value
    })
  },


  bindphone: function () {
    var a = this.data.userPhone;
    console.log(a);
    Bmob.Sms.requestSmsCode({ "mobilePhoneNumber": a }).then(function (obj) {
      console.log("smsId:" + obj.smsId);
    }, function (err) {
      console.log("发送失败:" );
      console.log(err)
    });

    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },


  checkphone: function () {
    var that=this
    var a = this.data.userPhone;
    var b = this.data.userPassword;
    var rephone = Base64.encode(a); 
    console.log(b);
    Bmob.Sms.verifySmsCode(a, b).then(function (obj) {
      console.log("msg:" + obj.msg); //
      wx.showToast({
        title: '成功',
        duration: 5000,
        success: function () {
          setTimeout(function () {
            //var user = new Bmob.User();
            var u = Bmob.Object.extend("_User");
            var query = new Bmob.Query(u);
            // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
            query.get(that.data.user.id, {
              success: function (result) {
                // 自动绑定之前的账号

                result.set('phone', rephone);
                result.save();
                app.globalData.user.phone=a;
              }
            });
            wx.switchTab({
              url: '../Search/search',
            })
          }, 2000)

        }
      })
    }, function (err) {
      console.log("发送失败:" + err);
      wx.showModal({
        title: '错误',
        content: '验证码错误',
      })
    });


  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒后发送'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
})