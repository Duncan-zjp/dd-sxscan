import {request,deepCopy} from '../../common/js/common'

Page({
  data: {
    goodList:[
      
    ],
    isSelectEnd:false
  },
  onLoad(options) {
    // 模拟数据
    // const orders = [{"TradeNo":"DD2003210000074"},{"TradeNo":"DD2003210000074"}]
    const orders = options.nos.split(',').map(i=>{
      return {
        TradeNo:i
      }
    })
    request('GetTradeOrders',{jsontrades:JSON.stringify(orders)}).then(res => {
      if(res.data == -6){
        return dd.alert({title:'提示',content:'没有商品数据'})
      }
      this.setData({
        goodList:res.data.map(i => {
          i.$id = i.OuterIid+i.OuterSkuId
          i.code = []
          return i
        })
      })
    })
  },
  handleScanGood(){
    dd.scan({
      success:res => {
        if(!res.code){
          return dd.alert({title:'提示',content:'唯一码没有数据'})
        }
        // 模拟数据
        // res.code = 'PO1708290000001|908#|908#-PT-3RW|6|20170829|00001'
        // res.code = 'PO1708290000001|908#|908#-PT-GFW|6|20170829|00001'
        const codeArr = res.code.split('|')
        const $id = codeArr[1]+codeArr[2]
        const currgoods = deepCopy(this.data.goodList).filter(i => i.$id == $id)
        if(!currgoods.length){
          return dd.alert({title:'提示',content:'列表没有该商品'})
        }
        if(currgoods.some(i=>i.code.find(i2 => i2 == res.code))){
          return dd.alert({title:'提示',content:'请勿重复扫一样的码'})
        }
        let temp = res.code
        // currgoods.every(item => {
        //   if(item.code.length < Number(item.Num) && temp!= ''){
        //     console.log('进入循环')
        //     item.code.push(res.code)
        //     temp = ''
        //   }else{
        //     return true
        //   }
        // })
        for(let i=0;i<currgoods.length;i++){
          if(currgoods[i].code.length < Number(currgoods[i].Num) && temp!= ''){
            console.log('进入循环')
            currgoods[i].code.push(res.code)
            temp = ''
          }
        }
        // let temp = res.code
        // let currgoods2 = currgoods.reduce((prev,next) => {
        //   if(next && next.code.length < Number(next.Num) && temp != ''){
        //     next.code.push(res.code)
        //     prev.push(next)
        //     temp = ''
        //     console.log(temp)
        //   }
        //   return prev
        // },[])
        const newGoodList = deepCopy(this.data.goodList).map(item => {
          currgoods.forEach(item2 => {
            if(item.$id == item2.$id && item.TradeKey == item2.TradeKey)item = item2
          })
          return item
        })
        console.log(newGoodList)
        // 检查唯一码是否入库
        request('CodeCheck',{code:res.code}).then(res => {
          if(res.data != '1'){
            return dd.alert({title:'提示',content:'唯一码未完成入库'})
          }
          console.log('执行')
          this.setData({
            goodList : newGoodList
          })
          this.handleChangeIsEnd()
        })
        .catch(err => this.handleChangeIsEnd())
        
      }
    })
  },
  // 检查是否全部扫描完毕
  handleChangeIsEnd(){
    const data = this.data.goodList
    const is = data.reduce((p,n) => p+Number(n.Num),0) == data.reduce((p,n) => p+n.code.length,0)
    this.setData({
      isSelectEnd:is
    })
  },
  // 完成复检
  handleScanEnd(){
    const postData = JSON.stringify(deepCopy(this.data.goodList).map(i => {
      i.code = i.code.join(',')
      return i
    }))
    console.log(postData)
    // 检查产品关联订单是否复检
    request('TradeCheck',{jsontrades:postData}).then(res => {
      if(res.data != '1'){
        return dd.alert({title:'提示',content:res.data.map(i => i.TradeKey).join(',')+'已复检'})
      }
      request('FinshedCheck',{jsontrades:postData}).then(res => {
        const errStr = {
          '-4' : 'json格式解析失败',
          '-5' : 'json格式错误',
          '-3' : 'json参数为空',
          '-6' : '购买数量不予许小于0',
          '-7' : '唯一码格式错误',
          '-9' : '订单号为空',
          '-10' : '商品编码为空',
          '-11' : '规格编码为空',
          '-12' : '存在已完成复检订单',
          '0'  : '响应异常'
        }
        if(res.data != '1'){
          return dd.alert({title:'提示',content:errStr[res.data]})
        }
        dd.alert({title:'提示',content:'复检成功'})
        this.handleClearScanOrder(JSON.parse(postData).map(i => i.TradeKey))
        this.handleClearData()
      })
    })
  },
  // 清数据
  handleClearData(){
    this.setData({
      goodList:[]
    })
  },
  // 清除复检成功的缓存
  handleClearScanOrder(nos){
    let orderLocal = dd.getStorageSync({key:'scanOrder'}).data
    if(!orderLocal)return
    nos.forEach(item => {
      orderLocal = orderLocal.filter(i => i.no != item)
    })
    dd.setStorage({key:'scanOrder',data:orderLocal})
  }
});
