import {psotData} from '../../util/util'
Page({
  data: {
    username:'',
    userPrice:[]
  },
  onLoad() {
  },
  onShow(){
    this.getUserPrice()
    this.setData({username:dd.getStorageSync({key:'user_data'}).data.username})
  },
  getUserPrice(){
    // 获取店铺剩余预存款和信用额度
    psotData('GetUserDeposit').then(res => {
      this.setData({userPrice:res})
    })
  },
  cancellation(){
    dd.navigateTo({url:'../login/login'});
  }
});
