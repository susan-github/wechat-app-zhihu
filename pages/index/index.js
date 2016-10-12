//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    width: 0,
    height: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    stories: [],
    topStories: [],
    ids: []
  },
  //事件处理函数
  handleNavToDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id+'&ids='+this.data.ids
    })
  },
  setInitData: function() {
    this.setData({
      width: app.globalData.systemInfo.windowWidth,
      height: app.globalData.systemInfo.windowHeight
    })
  },
  onLoad: function () {
    this.setInitData()
    var that = this;
    wx.request({
        url: 'http://news-at.zhihu.com/api/4/news/latest',
        success: function(res) {
            console.log('zhihu news API:', res.data)
            var data = res.data || {};
            var ids = [];
            data.stories.map(function(item) { ids.push(item.id) })
            that.setData({
              stories: data.stories,
              topStories: data.top_stories,
              ids: ids
            })
        }
    })
  },
  onReady: function() {
    wx.setNavigationBarTitle({title: '今日热闻'})
  }
})
