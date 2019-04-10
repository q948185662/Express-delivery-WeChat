//index.js
//获取应用实例
const app = getApp()
var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
var Shape = require("../../utils/wxdraw.min.js").Shape;
var AnimationFrame = require("../../utils/wxdraw.min.js").AnimationFrame;


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    wxCanvas: null,
    width:0

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindtouchstart: function (e) {
    // 检测手指点击事件
    // console.log(e);
    this.wxCanvas.touchstartDetect(e);

  },
  bindtouchmove: function (e) {
    // 检测手指点击 之后的移动事件
    this.wxCanvas.touchmoveDetect(e);
  },
  bindtouchend: function () {
    //检测手指点击 移出事件
    this.wxCanvas.touchendDetect();
  },
  bindtap: function (e) {
    this.wxCanvas.tapDetect(e);
  },
  bindlongpress: function (e) {
    // console.log(e);
    this.wxCanvas.longpressDetect(e);
  },
  onLoad: function () {
    /** 
     * 
     */
    // console.log(requestAnimationFrame);
    var context = wx.createCanvasContext('textA')
  console.log(wx.getSystemInfoSync().windowWidth)
    this.setData({
      width: wx.getSystemInfoSync().windowWidth
    })


    // Fill with gradient


    this.wxCanvas = new wxDraw(context, 0, 0, wx.getSystemInfoSync().windowWidth, 500);

    /**
     * 由于 小程序没有Dom 操作，所以没法获取canvas高度以及绘图的起点
     * 所以 wxDraw初始化的时候 需要设置 以便点击检测的时候使用
    */
   wx.getSystemInfo({
     success: function(res) {

     },
   })

    let text = new Shape('text', { text: "关", x: 115, y: 180, fontSize: 35, fillStyle: "#000000", needShadow: true }, 'fill', false)
    let text2 = new Shape('text', { text: "于", x: 155, y: 180, fontSize: 35, fillStyle: "#000000", needShadow: true }, 'fill', false)
    let text3 = new Shape('text', { text: "城", x: 195, y: 180, fontSize: 35, fillStyle: "#000000", needShadow: true }, 'fill', false)
    let text4 = new Shape('text', { text: "蜂", x: 235, y: 180, fontSize: 35, fillStyle: "#000000", needShadow: true }, 'fill', false)
    //let text5 = new Shape('text', { text: "T", x: 225, y: 260, fontSize: 50, fillStyle: "#34a853", needShadow: true }, 'fill', false)
    //let text6 = new Shape('text', { text: "Y", x: 245, y: 260, fontSize: 50, fillStyle: "#ea4335", needShadow: true }, 'fill', false)
    //let text7 = new Shape('text', { text: "拿", x: 245, y: 260, fontSize: 50, fillStyle: "#ea4335", needShadow: true }, 'fill', false)


    // let t = [];
    // let tex = "wxDraw"
    // let colors = ["#4285f4", "#ea4335", "#fbbc05", "#4285f4", "#34a853", "#ea4335"]
    // for (var i = 0; i < tex.length; i++) {
    //   t[i] = new Shape('text', { text: tex[i], x: 80 + 40 * i, y: 360, fontSize: 50, fillStyle: colors[i], needShadow: true }, 'fill', false);
    //   this.wxCanvas.add(t[i]);

    //   (function (i) {
    //     setTimeout(function () {
    //       t[i].animate({ "y": "-=100", shadow: { offsetY: 100, blur: 30 } }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=100", shadow: { offsetY: 5, blur: 5 } }, { easing: "swingFrom", duration: 1000 }).start(true);
    //     },i*50+50)
    //   })(i)
    // }


    this.wxCanvas.add(text);
    this.wxCanvas.add(text2);
    this.wxCanvas.add(text3);
    this.wxCanvas.add(text4);
    //this.wxCanvas.add(text5);
    //this.wxCanvas.add(text6);
    //this.wxCanvas.add(text7);


    setTimeout(function () {
      text.animate({ "y": "-=100", shadow: { offsetY: 100, blur: 30 } }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=100", shadow: { offsetY: 5, blur: 5 } }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 50);


    setTimeout(function () {
      text2.animate({ "y": "-=100", shadow: { offsetY: 100, blur: 30 } }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=100", shadow: { offsetY: 5, blur: 5 } }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 100);


    setTimeout(function () {
      text3.animate({ "y": "-=100", shadow: { offsetY: 100, blur: 30 } }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=100", shadow: { offsetY: 5, blur: 5 } }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 150);

    setTimeout(function () {
      text4.animate({ "y": "-=100", shadow: { offsetY: 100, blur: 30 } }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=100", shadow: { offsetY: 5, blur: 5 } }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 200);

    // setTimeout(function () {
    //   text5.animate({ "y": "-=100", shadow: { offsetY: 100, blur: 30 } }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=100", shadow: { offsetY: 5, blur: 5 } }, { easing: "swingFrom", duration: 1000 }).start(true);
    // }, 250);

    // setTimeout(function () {
    //   text6.animate({ "y": "-=100", shadow: { offsetY: 100, blur: 30 } }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=100", shadow: { offsetY: 5, blur: 5 } }, { easing: "swingFrom", duration: 1000 }).start(true);
    // }, 300);
  },
  onUnload: function () {
    this.wxCanvas.clear(); //推荐这个
  }

})
