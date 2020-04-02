Page({
  data: {
    orderList: [{
      orderNum: '1122333331',
      status: '已复检',
      tbNum: 'tb11223333333',
      buyerName: '张三',
      buyerNick: '张三张三张大三',
      buyerPhone: '13222222222',
      createTime: '2020-01-01 12:12'
    }, {
      orderNum: '1122333332',
      status: '已复检',
      tbNum: 'tb11223333333',
      buyerName: '张三',
      buyerNick: '张三张三张大三',
      buyerPhone: '13222222222',
      createTime: '2020-01-01 12:12'
    }, {
      orderNum: '1122333333',
      status: '已复检',
      tbNum: 'tb11223333333',
      buyerName: '张三',
      buyerNick: '张三张三张大三',
      buyerPhone: '13222222222',
      createTime: '2020-01-01 12:12'
    }, {
      orderNum: '1122333334',
      status: '已复检',
      tbNum: 'tb11223333333',
      buyerName: '张三',
      buyerNick: '张三张三张大三',
      buyerPhone: '13222222222',
      createTime: '2020-01-01 12:12'
    }, {
      orderNum: '1122333335',
      status: '已复检',
      tbNum: 'tb11223333333',
      buyerName: '张三',
      buyerNick: '张三张三张大三',
      buyerPhone: '13222222222',
      createTime: '2020-01-01 12:12'
    }, {
      orderNum: '1122333336',
      status: '已复检',
      tbNum: 'tb11223333333',
      buyerName: '张三',
      buyerNick: '张三张三张大三',
      buyerPhone: '13222222222',
      createTime: '2020-01-01 12:12'
    }, {
      orderNum: '112233337',
      status: '已复检',
      tbNum: 'tb11223333333',
      buyerName: '张三',
      buyerNick: '张三张三张大三',
      buyerPhone: '13222222222',
      createTime: '2020-01-01 12:12'
    }]
  },
  onLoad() {},
  onRedirect(e) {
    const {orderData} = e.currentTarget.dataset
    const pathData = []
    const ignoreParams = ['createTime', 'status']
    for (const key in orderData) {
      if (!ignoreParams.includes(key)) {
        pathData.push(`${key}=${orderData[key]}`)
      }
    }
    dd.navigateTo({
      url: '../ship/ship?' + pathData.join('&')
    });
  }
});