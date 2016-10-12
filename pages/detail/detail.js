var app = getApp()
Page({
    data: {
        width: 0,
        height: 0,
        id: '',
        ids: [],
        info: {},
        tabs: [
            {'key':'back', 'icon': '../../images/left.png', 'badge': 0, 'action': 'handleNavBack'},
            {'key':'next', 'icon': '../../images/down.png', 'badge': 0, 'action': 'handleNext'},
            {'key':'appreciate', 'icon': '../../images/appreciate.png', 'badge': 0, 'action': 'handleAppreciate'},
            {'key':'share', 'icon': '../../images/share.png', 'badge': 0, 'action': 'handleShare'},
            {'key':'comment', 'icon': '../../images/comment.png', 'badge': 0, 'action': 'handleComment'},
        ],
        toView: '',
        showActionSheet: false,
        shares: [
            {'key':'wechat', 'icon': '../../images/wechat.png', 'color': '#569e3d', 'label': '微信好友', 'action': 'handleShareTo'},
            {'key':'wechatCircle', 'icon': '../../images/wechat-circle.png', 'color': '#79d858', 'label': '微信朋友圈', 'action': 'handleShareTo'},
            {'key':'qq', 'icon': '../../images/qq.png', 'color': '#3069b1', 'label': 'QQ', 'action': 'handleShareTo'},
            {'key':'qqZone', 'icon': '../../images/qq-zone.png', 'color': '#fddd52', 'label': 'QQ空间', 'action': 'handleShareTo'},
        ],
        showShareModal: false,
        activeShare: {}
    },
    getDetailReq: function(id, cb) {
        wx.request({
            url: 'http://news-at.zhihu.com/api/4/news/'+id,
            success: function(res) {
                console.log('zhihu news detail API:', res.data)
                if(typeof cb !== 'undefined') cb(res.data);
            }
        })
    },
    formatBody: function(html) {
        var body = html.match( /<p>.*?<\/p>/g );
        var ss = [];
        for( var i = 0, len = body.length; i < len;i++ ) {
            ss[ i ] = /<img.*?>/.test( body[ i ] );
            if( ss[ i ] ) {
                body[ i ] = body[ i ].match( /(http:|https:).*?\.(jpg|jpeg|gif|png)/ );
            } else {
                body[ i ] = body[ i ].replace( /<p>/g, '' )
                    .replace( /<\/p>/g, '' )
                    .replace( /<strong>/g, '' )
                    .replace( /<\/strong>/g, '' )
                    .replace( /<a.*?\/a>/g, '' )
                    .replace( /&nbsp;/g, ' ' )
                    .replace( /&ldquo;/g, '"' )
                    .replace( /&rdquo;/g, '"' );
                }
            }
        return body
    },
    handleNavBack: function() {
        wx.navigateBack()
    },
    handlePrev: function() {
        this.handlePageChange(-1)
    },
    handleNext: function() {
        this.handlePageChange(1)
    },
    //@params page: -1 前一页; 1 后一页
    handlePageChange: function(page) {
        var that = this
        var ids = this.data.ids
        for (var i = 0; i < ids.length; ++i) {
            if (ids[i] === this.data.toView) {
                if(typeof ids[i + page] === 'undefined') return
                that.getDetailReq(ids[i + page].split('-')[1], function(res) {
                    res.body = that.formatBody(res.body)
                    that.setData({
                        info: res,
                        toView: ids[i + page]
                    })
                })
                break
            }
        }
    },
    handleAppreciate: function() {

    },
    handleShare: function() {
        this.setData({
            showActionSheet: !this.data.showActionSheet
        })
    },
    handleActionSheetChange: function() {
        this.setData({
            showActionSheet: !this.data.showActionSheet
        })
    },
    handleComment: function() {
        wx.navigateTo({
            url: '../comment/comment?id='+this.data.id
        })
    },
    handleShareTo: function(e) {
        var key = e.currentTarget.dataset.key 
        var activeItem = ''
        this.data.shares.map(function(item) {if(item.key === key) activeItem = item})
        this.setData({
            showShareModal: !this.data.showShareModal,
            showActionSheet: !this.data.showActionSheet,
            activeShare: activeItem
        })
    },
    handleModalChange: function() {
        this.setData({
            showShareModal: !this.data.showShareModal
        })
    },
    setInitData: function() {
        this.setData({
            width: app.globalData.systemInfo.windowWidth,
            height: app.globalData.systemInfo.windowHeight
        })
    },
    onLoad: function(option) {
        this.setInitData()
        var that = this
        var ids = []
        option.ids.split(',').map(function(id) {ids.push('detail-'+id)})
        this.setData({
            id: option.id,
            ids: ids,
            toView: 'detail-'+option.id
        })
        this.getDetailReq(option.id, function(res) {
            res.body = that.formatBody(res.body)
            console.log('info:', res)
            that.setData({
                info: res
            })
        });
        wx.request({
            url: 'http://news-at.zhihu.com/api/4/story-extra/' + option.id,
            success: function(res) {
                console.log('zhihu news detail extra API:', res.data)
                var tabs = that.data.tabs;
                tabs[2].badge = res.data.popularity < 100 ? res.data.popularity : '99+'
                tabs[4].badge = res.data.comments < 100 ? res.data.comments : '99+'
                that.setData({
                    tabs: tabs
                })
            }
        })
    },
})