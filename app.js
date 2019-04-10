//app.js
//全局初始化Bmob账号
var Bmob = require('utils/bmob.js');
var BmobSocketIo = require('utils/bmobSocketIo.js').BmobSocketIo;
Bmob.initialize("43aed00df3f545ef3761a0a39a5d5ca9", "d2ab8524abcbece391e53dc3c5ce4236");
BmobSocketIo.initialize("43aed00df3f545ef3761a0a39a5d5ca9");
import Touches from './utils/Touches.js'

App({

  onLaunch: function () {
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.globalData.screenWidth = res.windowWidth;
        that.globalData.screenHight = res.windowHeight;
        that.globalData.screenWidthScale = res.windowWidth / 750;
        that.globalData.screenHightScale = res.windowHeight / 1334;
      }
    })
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var user1 = new Bmob.User();

    //var newOpenid = wx.getStorageSync('openid');
    //console.log(this.globalData.user)
   // if (!newOpenid) {
      

      wx.login({
        success: function (res) {
          user1.loginWithWeapp(res.code).then(function (user1) {
            var openid = user1.get("authData").weapp.openid;
            console.log(user1, 'user', user1.id, res);
            //存储每个微信用户在后端的objectId(非openid)，作为在客户端编码的唯一标识
            that.globalData.user.id=user1.id;            
            if (user1.get("nickName")) {
              // 第二次访问
              console.log(user1.get("nickName"), 'res.get("nickName")');
              
               var nickName = user1.get('nickName');
               var avatarUrl = user1.get('userPic');
               var phone=user1.get('phone');
               console.log(phone)
               that.globalData.user.avatarUrl = avatarUrl;
               that.globalData.user.nickName = nickName;
               that.globalData.user.phone=phone;
               //user.openid=openid;

              wx.setStorageSync('openid', openid)
            } else {
              //先存储openid
              var u = Bmob.Object.extend("_User");
              var query = new Bmob.Query(u);
              // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
              query.get(user1.id, {
                success: function (result) {
                  // 自动绑定之前的账号
                  result.set("openid", openid);
                  result.save();

                }
              });
              wx.setStorageSync('openid', openid)
              
              //跳转至用户授权界面
              wx.navigateTo({
                         url: '/pages/Start/start?userid='+user1.id,
                   })
            }

          }, function (err) {
            console.log(err, 'errr');
          });

        }
      });
  //  }
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
  },
  globalData: {
    user: {},
    screenWidthScale: 0.0,
    screenHightScale: 0.0,
    screenWidth: 0,
    screenHight: 0
  },
  Touches: new Touches()
})