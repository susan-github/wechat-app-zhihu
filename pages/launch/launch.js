var app = getApp();
Page({
    data: {
       imgUrl: '',
       width: 0,
       heihgt: 0
    },
    onLoad: function() {
        var that = this
        //调用应用实例的方法获取全局数据
        app.getSystemInfo(function(systemInfo){
            var width = systemInfo.windowWidth
            var height = systemInfo.windowHeight
            that.setData({
                width: width,
                height: height
            })
            wx.request({
                url: 'http://news-at.zhihu.com/api/4/start-image/'+width+'*'+height,
                success: function(res) {
                    that.setData({
                        //某些网络图片无法显示，可能是小程序的bug
                        //imgUrl: res.data.img
                        imgUrl: '../../images/bg.jpg'
                    })
                    console.log('zhihu API:', res.data.img)
                }
            })
        })
        setTimeout(
          function() {
            wx.navigateTo({url: '../index/index'})
        },2000)
    }
})