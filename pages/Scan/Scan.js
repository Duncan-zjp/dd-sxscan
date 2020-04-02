var put_data={};
var t_data = [];
var app =getApp();
import util from '../../util/util'
Page({
  data: {
    selectWarehouseShow:false,
    selectWarehouseData:[],
    selectWarehouseIndex:0,
    selectWarehouseId:0,
    selectWareHouseParmas:{}
  },
  onLoad() {
    console.log('用户数据')
    console.log(app.Outparameter)
    // 如果没有用户数据就重新登录
    // if(typeof app.Outparameter == 'undefined'){
    //   dd.navigateTo({url:'../login/login'});
    // }
    dd.getStorage({
      key: 'user_data',
      complete: function(res) {
        if(res.data || res.data == ""){
          app.Outparameter = res.data.Outparameter
          console.log(res.data) 
        }else{
          dd.navigateTo({url:'../login/login'});
        }
      }
    });


    util.psotData('GetWarehouse',{}).then(res => {
      this.setData({
        selectWarehouseData:res
      })
    })
  },
  PutWarehousing(){
    dd.scan({
      type: 'qr',
      success: (res) => {
        var res = res.code
        put_data.Trade = res.split("|")[0]
        put_data.OuterIid = res.split("|")[1]
        put_data.OuterSkuId = res.split("|")[2]
        put_data.Vendor = res.split("|")[3]
        put_data.Time = res.split("|")[4]
        put_data.TNum = res.split("|")[5]
        t_data.push(put_data)

        dd.setStorage({
          key: 'putdata',
          data:t_data,
          success: function() {
            dd.alert({content: '写入成功'});
          }
        });
      },
    });
  },
  OutWarehousing(){
    dd.scan({
      type: 'qr',
      success: (res) => {
        dd.alert({ title: res.code });
      },
    });
  },
  // 工序扫码
  scanfn(e){
    let _type  = e.target.dataset.type;
    // if(_type == 'review'){
    //   dd.navigateTo({url:`../processReview/processReview`})
    // }
    // if(_type == 'return'){
    //   dd.navigateTo({url:`../processReturn/processReturn`})
    // }
    // return
    if(_type == 'createOrder'){
      dd.navigateTo({url:`../createOrder/createOrder`})
    }
    if(_type == 'orderCenter'){
      dd.navigateTo({url:`../orderCenter/orderCenter`})
    }
    if(_type=='review' || _type=='return' || _type=='warehouseAcceptance' || _type=='warehouseReturn'){
      dd.scan({
        success:res => {
          let _data = JSON.parse(res.code.replace(/\'/g,'"'))
          if(_type == 'review'){
            dd.navigateTo({url:`../processReview/processReview?id=${_data.Id}`})
          }
          if(_type == 'return'){
            dd.navigateTo({url:`../processReturn/processReturn?id=${_data.Id}`})
          }
          if(_type == 'warehouseAcceptance'){
            this.setData({selectWarehouseShow:true})
            this.setData({selectWareHouseParmas:_data})
          }
          if(_type == 'warehouseReturn'){
            dd.navigateTo({url:`../warehouseReturn/warehouseReturn?id=${_data.Id}`})
          }
          
        }
      })
    }
    
  },
  // 取消仓库验收
  selectWarehouseCancel(){
    this.setData({
      selectWarehouseShow:false
    })
  },
  // 监听选择仓库
  selectWarehouseChange(e){
    console.log(this.data.selectWarehouseData[e.detail.value[0]])
    this.setData({
      selectWarehouseId:this.data.selectWarehouseData[e.detail.value[0]].Id,
      selectWarehouseIndex:e.detail.value[0]
    })
  },
  // 选择仓库确定
  selectWarehouseConfirm(){
    let _postData = {
      tradekey:this.data.selectWareHouseParmas.TradeKey,
      orderid:this.data.selectWareHouseParmas.OrderId,
      primarykey:this.data.selectWareHouseParmas.Id,
      warehousekey:this.data.selectWarehouseId
    }
    util.psotData('ReViewWorkRefSubByStock',_postData).then(res => {
      if(res == 1){
        dd.alert({title:'提示',content:'成功'})
      }else{
        dd.alert({title:'提示',content:'失败'})
      }
    })
    this.setData({
      selectWarehouseShow:false
    })
  }
});
