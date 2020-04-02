import util from '../../util/util'

Page({
  data: {
    // 仓库列表
    warehouseList : ['测试仓库1','测试仓库2','测试仓库3'],
    // 选中的仓库索引
    warehouseIndex : '',
    // 供应商列表
    supplierList : ['测试供应商1','测试供应商2','测试供应商3'],
    // 选中的供应商索引
    supplierIndex : '',
    // 开始日期
    selectTimeStart:'',
    // 结束日期
    selectTimeEnd:'',
    // 查询到的列表
    dataarr : []
  },
  onLoad() {
    // 获取仓库数据
    util.psotData('GetWarehouse').then(res => {
      this.setData({warehouseList:res})
    })
  },
  // 监听仓库选择
  stockChange(e){
    const _index = e.detail.value;
    this.setData({warehouseIndex:_index})
  },
  // 监听供应商选择
  supplierChange(e){
    const _index = e.detail.value;
    this.setData({supplierIndex:_index})
  },
  // 监听搜索
  stockCheck_submit(e){
    let _vals = e.detail.value
    dd.showLoading({content:'加载中...'})
    console.log(_vals)
    util.psotData('GetInventoryWriteLog',_vals).then(res => {
      if(res){
        dd.hideLoading();
        this.setData({dataarr:res})
        console.log(res.length)
      }
    })
  },
  // 选择开始日期
  selectTimeStartFn(){
    dd.datePicker({
      success:date => {
        this.setData({selectTimeStart:date.date})
      }
    })
  },
  // 选择结束日期
  selectTimeEndFn(){
    dd.datePicker({
      success:date => {
        this.setData({selectTimeEnd:date.date})
      }
    })
  },
  // 监听重置
  stockCheck_reset(){
    this.setData({
      warehouseIndex:'',
      supplierIndex:''
    })
  }
});
