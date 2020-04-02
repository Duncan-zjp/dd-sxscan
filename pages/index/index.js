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
    selectWareHouseParmas:{},
    // 订单信息展开
    orderShow:false,
    // 工序信息展开
    gxShow:false,
    // 仓库信息展开
    ckShow:false
  },
  onLoad() {
    return util.isLogin()
    util.psotData('GetWarehouse',{}).then(res => {
      this.setData({
        selectWarehouseData:res
      })
    })
  },
  onShow(){
    
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
  },
  toggleOrderShow(){
    this.setData({orderShow:!this.data.orderShow})
  },
  toggleGxShow(){
    this.setData({gxShow:!this.data.gxShow})
  },
  toggleCkShow(){
    this.setData({ckShow:!this.data.ckShow})
  }
});
