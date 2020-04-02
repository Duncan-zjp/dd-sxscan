import {psotData} from '../../util/util'
import {deepCopy} from '../../common/js/common'
Page({
  data: {
    userData:{},
    // 当前页数
    currentpage:1,
    // 订单列表
    list:[],
    // 按同一天分组的订单列表
    dateGroupList:[],
    // 搜索类型
    searchType:'',
    // 搜索类型key
    searchTypeStr:'',
    // 搜索字符串
    searchStr:'',
    orderMoreShow:false,
    // 当前订单的商品
    currOrderGoods:[],
    selectData:{
      searchType:[
        {label:'单号',value:'tradeno'},
        {label:'买家昵称',value:'buyernick'},
        {label:'手机',value:'mobile'}
      ]
    }
  },
  onLoad() {
    this.setData({
      userData:dd.getStorageSync({key:'user_data'}).data
    })
    // const json = '[{"创建时间":"2020/2/28 11:21:22","系统单号":"DD2002280000011","支付方式":"预付款","买家昵称":"22","收货人":"22","收货手机":"33","省":"123","市":"123","区":"123","详细地址":"3123","支付金额":"0.00","商品明细":"[{"商品编码":"007#餐桌","规格编码":"03cb2c91029649c4b7a2d1d85ec27bb5","购买数量":"1","标准售价":"0.00"}]","确认收货":"False","用户账户":"admin"},{"创建时间":"2020/2/28 10:53:00","系统单号":"DD2002280000010","支付方式":"预付款","买家昵称":"测试收货人","收货人":"测试收货人","收货手机":"13929950000","省":"广东省","市":"佛山市","区":"顺德区","详细地址":"测试详细地址","支付金额":"0.00","商品明细":"[{"商品编码":"007#餐桌","规格编码":"03cb2c91029649c4b7a2d1d85ec27bb5","购买数量":"1","标准售价":"0.00"}]","确认收货":"False","用户账户":"admin"},{"创建时间":"2020/2/24 11:37:22","系统单号":"DD2002240000003","支付方式":"预付款","买家昵称":"测试昵称","收货人":"戴小强","收货手机":"18576569855","省":"广东省","市":"佛山市","区":"顺德区","详细地址":"乐从大道","支付金额":"1000.00","商品明细":"[{"商品编码":"SJ-C-C08","规格编码":"A-1.5*1.9-C-C08-C","购买数量":"1","标准售价":"500.00"},{"商品编码":"SJ-C-C08","规格编码":"A-1.5*2.0-C-C08-GXC","购买数量":"1","标准售价":"500.00"}]","确认收货":"True","用户账户":"admin"},{"创建时间":"2020/2/19 1:41:51","系统单号":"DD2002190000007","支付方式":"信用额度","买家昵称":"songgehappy","收货人":"宋歌","收货手机":"18326628612","省":"海南省","市":"陵水黎族自治县","区":"","详细地址":"新村镇清水湾旅游度假区C区绿城蓝湾小镇丹桂苑第2幢3单元101室","支付金额":"2394.00","商品明细":"[{"商品编码":"5614","规格编码":"CJ+DSG+CD+RD","购买数量":"2","标准售价":"0.00"}]","确认收货":"False","用户账户":"admin"},{"创建时间":"2020/2/19 1:41:48","系统单号":"DD2002190000006","支付方式":"预付款","买家昵称":"小猫燕儿","收货人":"班立红","收货手机":"15510990808","省":"天津","市":"天津市","区":"南开区","详细地址":"华苑街道天华里教师村33号楼906室","支付金额":"99.00","商品明细":"[{"商品编码":"5614","规格编码":"CJ+DSG+CD+RD","购买数量":"1","标准售价":"0.00"}]","确认收货":"False","用户账户":"admin"}]'
    // console.log(json.replace(/((?<="商品明细":")(\S*)(?=","确认收货"))/gm,json.match(/((?<="商品明细":")(\S*)(?=","确认收货"))/)[1].replace(/\"/g,"'")))
    // console.log()
    // this.getData()
    this.getData()
  },
  onShow(){
    // this.getData()
  },
  getData(params){
    dd.showLoading()
    psotData('GetTradeEntity',{
      currentuser:this.data.userData.username,
      currentpage:this.data.currentpage,
      ...params
    }).then(res =>{
      // return
      if(!res.length){
        dd.hideLoading()
        return this.setData({
          currentpage:this.data.currentpage - 1
        })
      }
      const _temp = res.map(i=>{
        i.确认收货 = i.确认收货 == 'True'
        i.商品明细=JSON.parse(i.商品明细.replace(/\'/g,'"'))
        i.$id = i.系统单号
        return i
      })
      const dateGroupTemp = deepCopy(res).reduce((prev,next,i) => {
        if(prev.find(i=>i.创建时间 == next.创建时间.split(' ')[0])){
          const temp = prev.find(i=>i.创建时间 == next.创建时间.split(' ')[0])
          temp.商品明细 = temp.商品明细.concat(next.商品明细)
        }else{
          next.创建时间 = next.创建时间.split(' ')[0]
          prev.push(next)
        }
        return prev
      },[])
      console.log(dateGroupTemp)
      console.log(_temp)
      this.setData({list:this.data.currentpage == 1 ? dateGroupTemp : this.data.list.concat(dateGroupTemp)})
      dd.hideLoading()
    })
  },
  searchTypeChange(e){
    this.setData({
      searchType:this.data.selectData.searchType[e.detail.value].value,
      searchTypeStr:this.data.selectData.searchType[e.detail.value].label,
    })
  },
  onSearchInput(e){
    this.setData({
      searchStr:e.detail.value
    })
  },
  search(){
    if(!this.data.searchType){
      return dd.showToast({content:'请选择搜索类型'})
    }
    const _params = {}
    _params[this.data.searchType] = this.data.searchStr
    _params.currentpage = 1
    this.getData(_params)
  },
  tel(e){
    dd.showCallMenu({
      phoneNumber: e.target.dataset.phone, // 期望拨打的电话号码
      code: '+86', // 国家代号，中国是+86
      showDingCall: false, // 是否显示钉钉电话
      success:function(res){   
      },
      fail:function(err){
      }
    });
  },
  listOnLower(){
    this.setData({
      currentpage:this.data.currentpage+1
    })
    this.getData()
  },
  onDelivery(e){
    const msg = {
      '-1':'登录失败',
      '-2':'outpara参数异常',
      '-6':'未发货状态不能确认收货',
      '-7':'订单已确认收货',
      '-8':'输入的参数不能为空',
      '1':'确认收货成功'
    }
    psotData('ComfigTakeGood',{
      currentuser:this.data.userData.username,
      tradeno:e.target.dataset.no
    }).then(res => {
      if(typeof res == 'number') return dd.showToast({content:msg[res]})
    })
  },
  orderMore(e){
    this.setData({
      orderMoreShow:true,
      currOrderGoods:e.target.dataset.goods
    })
  },
  orderMoreCancel(){
    this.setData({
      orderMoreShow:false
    })
  },
  handleToggleOpen(e){
    const index = e.currentTarget.id
    this.setData({
      [`list[${index}].open`] : !this.data.list[index].open
    })
  }
});
