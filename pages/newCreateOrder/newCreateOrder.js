import {request} from '../../common/js/common'
Page({
  data: {
    // 店铺列表
    shop:[],
    // 当前店铺
    currShop:{

    },
    test:'',
    // 商品搜索
    searchGoodsStr:'',
    // 商品列表
    goodsList:[],
    // 当前点击的商品
    currGoods:{
      
    },
    // 购物车商品
    buyCarData:[],
    // 购物车显示隐藏
    buyCarShow:false
  },
  onLoad() {
    this.handleGetShop()
  },
  // 获取店铺列表
  handleGetShop(){
    request('GetUserDeposit').then(res => {
      this.setData({
        shop:res.data.map(i=>{
          i.value = i.店铺昵称
          return i
        }),
        currShop:{...res.data[0],$index:0}
      })
    })
  },
  // 获取商品列表
  handleGetGoods(title){
    dd.showLoading()
    // 获取商品列表
    request('GetSkuSource',{title:title}).then(res => {
      if(!res.data instanceof Array || !res.data) return dd.showToast({content:'搜索商品失败'})
      this.setData({
        goodsList:res.data.map((i,index) =>{
          i.$id = `${i.商品编码}${i.规格编码}`
          i.购买数量 = 1
          return i
        })
      })
      dd.hideLoading()
    })
    .catch(err => {
      dd.hideLoading()
    })
  },
  // 搜索商品输入框
  handleSearchGoodsChange(e){
    this.setData({searchGoodsStr:e.detail.value})
  },
  // 搜索商品
  handleSearchGoods(){
    const title = this.data.searchGoodsStr
    if(!title){
      return dd.showToast({content:'商品关键字不能为空'})
    }
    this.handleGetGoods(title)
  },
  // 选择店铺
  handleShopChange(e){
    this.setData({
      currShop:{...this.data.shop[e.detail.value],$index:e.detail.value}
    })
  },
  // 点击商品
  handleClickGoods(e){
    this.setData({
      currGoods:e.target.dataset.data
    })
  },
  // 立即下单
  createOrder(){
    if(!this.data.buyCarData.length){
      return dd.showToast({content:'请先添加商品到购物车'})
    }
    dd.navigateTo({url:`../../pages/newCreateOrderSubmit/newCreateOrderSubmit?goods=${JSON.stringify(this.data.buyCarData)}&shop=${JSON.stringify(this.data.currShop)}`})
  },
  // 显示购物车
  handleShowBuyCar(){
    this.setData({buyCarShow:true})
  },
  // 关闭购物车
  handleOnClose(goods){
    this.setData({buyCarShow:false,buyCarData:goods})
  },
  // 监听加入购物车
  handleChangeJoinCar(goods){
    const car = this.data.buyCarData
    if(car.find(i => i.$id == goods.$id)) return
    this.setData({buyCarData:car.concat(goods)})
  },
  handleToggleOpen(e){
    const index = e.currentTarget.id
    this.setData({
      [`goodsList[${index}].open`] : !this.data.goodsList[index].open
    })
  }
});
