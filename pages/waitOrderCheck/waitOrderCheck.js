import {deepCopy} from '../../common/js/common'
Page({
  data: {
    orderList:[]
  },
  onLoad() {
    const orderLocal = dd.getStorageSync({key:'scanOrder'}).data
    console.log(orderLocal)
    if(!orderLocal)return
    this.setData({orderList:deepCopy(orderLocal).map(i => {
      i.select = false
      return i
    }) ? orderLocal : [] })
  },
  onShow(){
    
  },
  onHide(){
    this.handleSetLocal()
  },
  onUnload(){
    this.handleSetLocal()
  },
  handleSelect(e){
    const index = this.data.orderList.findIndex(i => i.id == e.currentTarget.id)
    this.setData({
      [`orderList[${index}].select`]:!this.data.orderList[index].select
    })
  },
  handleScan(){
    dd.scan({
      success: res => {
        const order = res.code
        // const order = {id:'1',a:'DD192031231234'}
        if(this.data.orderList.find(i => i.no == order)){
          return dd.alert({title:'提示',content:'请不要扫描重复的订单'})
        }
        this.setData({orderList:this.data.orderList.concat({no:order,id:this.data.orderList.length + 1})})
      }
    })
  },
  handleCheck(){
    const orders = this.data.orderList.filter(i => i.select)
    if(!orders.length){
      return dd.alert({title:'提示',content:'请选择订单'})
    }
    dd.redirectTo({url:`../reviewAlign/reviewAlign?nos=${orders.map(i=>i.no).join(',')}`})
  },
  handleSetLocal(){
    const data = this.data.orderList.map(item => {
      return item
    })
    dd.setStorage({key:'scanOrder',data:data})
  }
});
