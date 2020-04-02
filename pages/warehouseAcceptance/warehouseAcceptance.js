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
    util.psotData('GetWorkStockSource',_postData).then(res => {
      let _data = this.data.listData
      if(this.data.page > 1){
        res.filter(item => !item.AllCount).forEach(item => {
          _data.push(item)
        })
      }else{
        _data = res.filter(item => !item.AllCount)
      }
      let _newData = []
      _data.forEach(item => {
        util.psotData('GetAllWorkRelSupByPrimaryKey',{primarykey:item.Id}).then(res => {
          if(!res || res.length == 0 || res == 111){
            item.gxNull = '未能找到供应商关联工序信息或工序信息不完整'
          }else{
            item.gxList = res
          }
          _newData.push(item)
          this.setData({listData:_newData})
        })
      })
      
    })

    // util.psotData('GetAllWorkRelSupByPrimaryKey',{primarykey:'53'}).then(res => {
    //     console.log(res)
    // })
    
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
