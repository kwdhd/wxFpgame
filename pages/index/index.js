//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '开始游戏',
    userInfo: {},
    welcome: '你好'
  },
  //事件处理函数
  startGame: function () {
    wx.navigateTo({
      url: '../game/game'
    })
  }, viewScore: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
