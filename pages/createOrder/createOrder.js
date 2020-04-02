import {psotData} from '../../util/util'
Page({
  data: {
    // 选择框数据
    selectData:{
      // 店铺列表
      shop:[],
      // 配送方式
      ps:[],
      // 支付方式
      pay:[]
    },
    // 店铺昵称
    shopValue:'',
    // 配送方式
    psValue:'',
    // 支付方式
    payValue:'',
    addGoodsShow:false,
    // 商品列表
    goodList:[],
    // 用户信息
    userData:dd.getStorageSync({key:'user_data'}).data,
    // 订单信息缓存
    orderDataLocal:null
  },
  onLoad() {
    this.clearGoods()
    this.getSelectData()
    // 设置默认下拉数据到data
    const _userData = dd.getStorageSync({key:'createOrderData'}).data
    if(_userData){
      this.setData({
        shopValue : _userData.店铺昵称,
        psValue:_userData.配送方式,
        payValue:_userData.支付方式,
        orderDataLocal:_userData
      })
    }
    
  },
  shopchange(e){
    this.setData({
      shopValue:this.data.selectData.shop[e.detail.value].value
    })
  },
  pschange(e){
    this.setData({
      psValue:this.data.selectData.ps[e.detail.value].value
    })
  },
  paychange(e){
    this.setData({
      payValue:this.data.selectData.pay[e.detail.value].value
    })
  },
  addGoods(){
    this.setData({addGoodsShow:true})
  },
  numInput(e){
    const _data = this.data.goodList
    _data.find(i=>i.id == e.target.dataset.id).购买数量 = e.detail.value
    this.setData({goodList:_data})
  },
  deleteGood(e){
    const _goods = this.data.goodList.filter(i => i.id != e.target.dataset.id)
    this.setData({goodList:_goods})
  },
  addGoodsConfirm(data){
    this.setData({
      goodList:data.reduce((prev,next)=>{
        if(!prev.find(i =>i.id == next.id)) prev.push(next)
        return prev
      },this.data.goodList)
    })
    this.addGoodsCancel()
  },
  addGoodsCancel(){
     this.setData({addGoodsShow:false})
  },
  createOrder(e){
    const tradeData = e.detail.value
    const tradejson = {
      店铺昵称:this.data.shopValue,
      配送方式:this.data.psValue,
      买家备注:tradeData.买家备注,
      收货人:tradeData.收货人,
      收货电话:tradeData.收货电话,
      省:tradeData.省,
      市:tradeData.市,
      区:tradeData.区,
      详细地址:tradeData.详细地址,
      当前用户:tradeData.当前用户,
      支付方式:this.data.payValue
    }
    const _postData = {
      tradejson:JSON.stringify([tradejson]),
      orderjson:JSON.stringify(this.data.goodList.map(i=>{
        return {
          商品编码:i.商品编码,
          规格编码:i.规格编码,
          购买数量:i.购买数量,
          标准售价:i.标准售价
        }
      }))
    }
    if(!_postData.orderjson.length){
      return dd.showToast({content:'请添加商品'})
    }
    const msg = {
      '-1':'登录失败',
      '-2':'outparameter参数异常',
      '-6':'订单/商品参数为空',
      '-7':'订单/商品参数格式错误',
      '-8':'商品参数购买数量不能小于0',
      '2':'支付方式数据集为空',
      '3':'预存款金额不足',
      '4':'信用额度金额不足',
      '5':'支付方式错误',
      '0':'创建失败',
      '1':'新增订单成功'

    }
    psotData('CreateTradeEntity',_postData).then(res =>{
      if(typeof res == 'number') dd.showToast({content:msg[res]})
      if(res == 1) {
        this.clearGoods()
        this.saveCreateDatalocal(tradejson)
      }
    })
  },
  getSelectData(){
    psotData('GetUserDeposit').then(res => {
      this.setData({
        'selectData.shop':res.map(i=>{
          i.value = i.店铺昵称
          return i
        })
      })
    })
    psotData('GetCodeDelivery').then(res =>{
      this.setData({
        'selectData.ps':res.map(i=>{
          i.value = i.配送名称
          return i
        })
      })
    })
    psotData('GetDepositType').then(res =>{
      this.setData({
        'selectData.pay':res.map(i=>{
          i.value = i.支付方式
          return i
        })
      })
    })
  },
  // 清楚商品数据
  clearGoods(){
    this.setData({goodList:[]})
  },
  // 保存输入信息到缓存
  saveCreateDatalocal(saveData){
    // 保存下拉index
    saveData.店铺昵称index = this.data.selectData.shop.findIndex(i=>i.店铺昵称 == saveData.店铺昵称)
    saveData.配送方式index = this.data.selectData.ps.findIndex(i=>i.配送名称 == saveData.配送方式)
    saveData.支付方式index = this.data.selectData.pay.findIndex(i=>i.支付方式 == saveData.支付方式)
    dd.setStorage({
      key:'createOrderData',
      data:saveData
    })
  },
  removeCreateOrderData(){
    dd.confirm({
      title:'操作提醒',
      content:'你将清空页面数据和缓存数据，是否继续？',
      confirmButtonText:'确认',
      cancelButtonText:'取消',
      success:()=>{
        dd.removeStorage({
          key:'createOrderData',
          success:()=>{
            this.setData({orderDataLocal:null})
            this.clearGoods()
          }
        })
      }
    })
  }
});
