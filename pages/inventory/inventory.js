import {request,deepCopy} from '../../common/js/common'

Page({
  data: {
    wareHouseList:[],
    goodList:[],
    selectData:{
      // 仓库
      warehouse:'',
      // 盘点类型
      type:''
    }
  },
  onLoad(options) {
    this.getWareHouse()
  },
  getWareHouse() {
    request('GetWarehouse', {}).then(res => {
      this.setData({
        wareHouseList: res.data.map(i => ({
          label: i.WarehouseName,
          value: i.Id
        }))
      })
    })
  },
});
