import util from '../../util/util'
Page({
  data: {
    // tabindex
    tabIndex:1,
    page:1
  },
  onLoad() {
    this.getData()
  },
  tabfn(e){
    let _index = e.currentTarget.dataset.tabindex;
    this.setData({tabIndex:_index,page:1})
    this.getData()
  },
  getData(){
    let _postData = {
      type : this.data.tabIndex,
      currentpage : this.data.page
    }
    util.psotData('GetWorkRefSubSource',_postData).then(res => {
      if(this.data.page > 1){
        let _data = this.data.listData
        res.filter(item => item.TradeKey).forEach(item => {
          _data.push(item)
        })
         this.setData({
          listData : _data
        })
      }else{
        this.setData({
          listData : res.filter(item => item.TradeKey)
        })
      }
      console.log(res.filter(item => item.TradeKey))
      console.log(this.data.listData)
    })
  },
  // 滚动到底部
  scrollBottom(){
    this.setData({
      page:this.data.page+1
    })
    this.getData()
  },
  // 下拉刷新
  onPullDownRefresh(){
    this.setData({
      page:1
    })
    this.getData()
  }
});
