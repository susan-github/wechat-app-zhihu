//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getSystemInfo:function(cb){
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res.model)
        // console.log(res.pixelRatio)
        console.log('windowWidth:', res.windowWidth)
        // console.log(res.windowHeight)
        // console.log(res.language)
        // console.log(res.version)
        that.globalData.systemInfo = res
        typeof cb == "function" && cb(res)
      }
    })
  },
  globalData:{
    userInfo: null,
    systemInfo: null
  }
})