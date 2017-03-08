//index.js
//获取应用实例
var app = getApp()
var allCard = ['card1',
  'card2',
  'card3',
  'card4',
  'card5',
  'card6',
  'card7',
  'card8',
  'card9',
  'card10',
  'card11',
  'card12',
  'card13',
  'card14',
  'card15',
  'card16',
  'card17',
  'card18',
  'card19',
  'card20',
  'card21',
  'card22',
  'card23',
  'card24',
  'card25',
  'card26',
  'card27',
  'card28',
  'card29',
  'card30',
  'card31',
  'card32',
  'card33',
  'card34',
  'card35',
  'card36',
  'card37',
  'card38',
  'card39',
  'card40',
  'card41',
  'card42'];
var backCardImage = "../images/cardbg.jpg"
Page({
  data: {
    clickNum: 0,      // 点击次数
    useTime: 0,       // 游戏时间  
    checked: 0,       // 已匹配牌数
    allCard: allCard,    // 全部卡牌数组
    backImage: backCardImage, // 牌背面 图片地址
    modalHidden: true,    // 游戏完成提示是否显示
    firstX: -1,        // 点击的第一张卡牌的坐标 
    firstY: -1,
    cards: [],        // 随机挑选出来的牌   
    size: 8,        // 界面显示的牌数=size*2
    clickable: false,    // 当前是否可点击
    timer: ''        // 游戏计时的定时器
  },
  startGame: function () {  // 开始游戏
    var data = this.data;
    var that = this;
    console.log('startGame');
    var tmp = this.data.allCard.sort(
      function (a, b) { return Math.random() > .5 ? -1 : 1; }).splice(0, Math.floor(data.size)); // 打乱牌堆,挑出size/2张牌
    tmp = tmp.concat(tmp).sort(function (a, b) { return Math.random() > .5 ? -1 : 1; }); // 牌*2,再打乱
    // 添加src,state,转成二维数组方面展示
    var cards = [];
    var ix = -1; var iy = 0;
    for (var i in tmp) {
      if (i % 4 == 0) {
        cards.push([]);
        ix++; iy = 0;
      }
      cards[ix].push({
        src: '../images/' + tmp[i] + '.jpg',
        state: 1   // 为1时显示图片,为0时显示牌背面
      });
    }
    this.data.cards = cards;
    this.setData({
      cards: cards,
      clickNum: 0,
      useTime: 0,
      checked: 0,
      modalHidden: true,
      firstX: -1,
      clickable: false
    });

    var that = this;
    setTimeout(function () {
      that.turnAllBack();  // 所有的牌翻到背面
      console.log('turn all back');
      data.clickable = true; // 开始计时了才让点
      if (data.timer === '') {
        data.timer = setInterval(function () {
          data.useTime++;
          that.setData({ useTime: data.useTime });
        }, 1000); // 游戏开始计时
      } else {
        that.setData({ useTime: 0 });
      }
    }, 1000); // 游戏开始前先让玩家记忆几秒钟
  },
  onTap: function (event) {
    var that = this;
    var data = this.data;
    var ix = event.currentTarget.dataset.ix; // 获取点击对象的坐标
    var iy = event.currentTarget.dataset.iy;
    console.log('onTap ' + ix + ' ' + iy);
    if (data.cards[ix][iy].state != 0 || !data.clickable)  // 点击的不是未翻过来的牌或者现在不让点直接pass
      return;
    that.setData({ clickNum: ++data.clickNum }); //点击数加1   
    // 1. 检测是翻过来的第几张牌
    if (data.firstX == -1) {
      // 1.1 第一张修改状态为 1
      data.cards[ix][iy].state = 1;
      data.firstX = ix; data.firstY = iy;  // 记下坐标
      that.setData({ cards: data.cards });     // 通过setData让界面变化
    } else {
      // 1.2 前面已经有张牌翻过来了,先翻到正面然后看是不是一样
      data.cards[ix][iy].state = 1;
      that.setData({ cards: data.cards });
      if (data.cards[data.firstX][data.firstY].src === data.cards[ix][iy].src) {
        // 1.2.1.1 两张牌相同, 修改两张牌的state为2完成配对
        data.cards[data.firstX][data.firstY].state = 2;
        data.cards[ix][iy].state = 2;
        data.checked += 1; // 完成配对数++
        data.firstX = -1; // 准备下一轮匹配 
        // 1.2.1.2 检查是否所有牌都已经翻过来,都已翻过来提示游戏结束
        if (data.checked == data.size) { // 所有牌都配对成功了!
          this.setData({ modalHidden: false });
          clearInterval(this.data.timer); // 暂停计时
          this.data.timer = '';
          this.saveScore({ 'time': data.useTime, 'click': data.clickNum }) // 保存成绩
        }
      } else {  // 1.2.2 两张牌不同, 修改两张牌的state为 0
        data.cards[data.firstX][data.firstY].state = 0;
        data.cards[ix][iy].state = 0;
        data.firstX = -1;
        data.clickable = false;
        setTimeout(function () {
          that.setData({ cards: data.cards, clickable: true });
        }, 500); //过半秒再翻回去
      }
    }
    console.log(this.data.cards);
  }, turnAllBack: function () {
    for (var ix in this.data.cards)
      for (var iy in this.data.cards[ix])
        this.data.cards[ix][iy].state = 0;
    this.setData({ cards: this.data.cards });
  },
  saveScore: function (score) { // 保存分数
    var maxscore = wx.getStorageSync('maxscore');
    if (maxscore == undefined || maxscore == '')
      maxscore = [];
    maxscore.push(score);
    maxscore = maxscore.sort(function (a, b) {
      if (a.time < b.time)
        return -1;
      else if (a.time == b.time && a.click < b.click)
        return -1;
      else return 1;
    });
    wx.setStorageSync('maxscore', maxscore);
  }
  , "disableScroll": true,
  onLoad: function () {
    this.startGame();
    console.log(this.data.cards);
  },
  modalComfirm: function () {
    this.startGame();
  },
  modalCancle: function () {
    this.setData({
      modalHidden: true,
    })
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function () {
    console.log("onReady")
  },
  onShow: function () {
    console.log("onShow");
    if (this.data.checked == this.data.size)
      this.startGame()
  },
  onHide: function () {
    console.log("onHide")
  },
  onUnload: function () {
    console.log("onUnload")
  },
  onReachBottom: function () {
    console.log("onReachBottom")
  },
  onShareAppMessage: function () {
    console.log("onShareAppMessage")
  },
  onShareAppMessage: function () {
    console.log('onShareAppMessage')
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/page/user?id=123'
    }
  }
})
