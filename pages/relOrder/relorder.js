//index.js
//获取应用实例
const app = getApp()
//获取Bmob
var Bmob = require('../../utils/bmob.js');
Page({
  data: {
    // userInfo: {},
    user:{},
    noteMaxLen: 200,//备注最多字数
    noteNowLen: 0,//备注当前字数
    hasUserInfo: false,
    start:"",//确认的快递
    arrayAdd: [],//收获地址列表
    address: "",//确认的收货地址
    arraySize: ['','大件 ≥ 10kg', '中件 10kg ≥ 5kg ≥ 2kg', '小件 ≤ 2kg'],//大小件列表
    size:"",
    arrayMoney: [0,8, 5, 3],//金额列表
    money:0,//金额数目
    receiverName: "",//收货人姓名
    receiverPhone:"",//收货人手机号
    remark: "",//备注
    orderStatus:"未接单",
   
    
    //progressPercent:0,
  },


  //事件处理函数


  onLoad: function () {
    if (app.globalData.user){
      this.setData({
        user: app.globalData.user
      })
    }
    
   },
  onShow:function(){
    //getAddressList(this)
    
  },
//选择地址信息
  bindAddPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    let add=this.data.address;
    this.setData({
      index1: e.detail.value,
      address: this.data.arrayAdd[e.detail.value],
      
    })
    //console.log(this.data.address)
    if (this.data.progressPercent===100){
      this.setData({
        disabled: false
      })
    }
    else{
      this.setData({
        disabled: true
      })
    }
  },
  //选择大小件
  bindSizePickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let size=this.data.size;
    this.setData({
      index2: e.detail.value,
      size:this.data.arraySize[e.detail.value],
      money: this.data.arrayMoney[e.detail.value],
      
    })
    
  },
  //选择快递站点
  // bindStartPickerChange:function(e){
  //   let start=this.data.start;
  //   this.setData({
  //     index3: e.detail.value,
  //     start: this.data.arrayStart[e.detail.value],
     
  //   })
  // },
  selectAdd:function(e){
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          start:res.address
        })
      },
    })
  },

  setRemark: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      remark: value, noteNowLen: len
    })
    
  },
 
  
  submitForm:function(e){
    
    let name = this.data.receiverName;
    let phone = this.data.receiverPhone;
    let size = this.data.size;
    let money = this.data.money;
    let address = this.data.address;
    let remark=this.data.remark;
    let status=this.data.orderStatus;
    let start = this.data.start;
    let user=this.data.user;
    console.log(this.data.start)
    if(name===''||phone===''||address===''||size===''||start===''){
      wx.showModal({
        title: '错误',
        content: '信息未完善',
      })
    }
    else{
    wx.showModal({
      title: '您要发布的订单信息：',
      content: '收货人：'+name+
               '手机号：'+phone+
               '大小件：'+size+
               '金额：'+money+
               '快递类型:'+start+
               '收货地址'+address
      ,
      success: function (res) {
        if (res.confirm) {
          //支付界面
          wx.showToast({
            title: '成功',
            duration:5000,
            success:function(){
              setTimeout(function(){
                var Order=Bmob.Object.extend("order");
                var order=new Order();
                var date=new Date();
                //获取年月日时分秒
                order.set("orderId", "" + date.getFullYear() + (date.getMonth()< 9 ? "0" + (date.getMonth()+1) : (date.getHours()+1))+ (date.getDate()<10?"0"+date.getDate():date.getDate()) + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + (this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()) + phone.substring(phone.length-8,phone.length-4));
                order.set("receiverName",name);
                order.set("receiverPhone", phone);
                order.set("size",size);
                order.set("money", money);
                order.set("receiverAddress", address);
                order.set("start",start);
                order.set("remark", remark);
                order.set("orderStatus",status);
                order.set("receiverId",user.id);
                order.set("receiverAvatarUrl", user.avatarUrl);
                console.log(user.avatarUrl)
                order.set("transerId","");
                order.set("transerAvatarUrl", "");
                order.set("transerPhone","");
                order.save(null, {
                  success: function (result) {
                    // 添加成功,返回每个order的objectId(和user的openId完全是两回事)
                    console.log("订单创建成功, objectId:" + result.id);
                  },
                  error: function (result, error) {
                    // 添加失败
                    console.log('订单日记失败');
                    console.log(error)
                  }
                });

                wx.switchTab({
                  url: "../Search/search",
                })
              },2000)
             
            }
          })
        } else if (res.cancel) {
          //失败
        }
      }  
    })
  }
    
  },
  resetForm:function(e){
    console.log(e)
    this.setData({
      noteNowLen:0,
      index2:0,
      index3:0,
      address:'',
      receiverName:'',
      receiverPhone:''
    })
    
  },
  bindPersonInfo: function () {
    wx.navigateTo({
      url: './SelectAdd/selectadd',
      success: function (res) {

      },
      fail: function (res) {

      },
      complete: function (res) { },
    })
  }
  
})
//获取地址信息
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

