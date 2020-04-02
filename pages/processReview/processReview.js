import util from '../../util/util'
Page({
  data: {
    objJson:{
      Length:'长度',
      Width:'宽度',
      Height:'高度',
      Metre:'米数',
      Number:'件数',
      Weight:'重量',
      Volume:'体积',
      Area:'平方',
      CostPrice:'单价',
      Total:'总价',
    }
  },
  onLoad(option) {
    // 保存需要审核的id
    this.setData({
      id : option.id
    })
    // 动态数据字段
    util.psotData('GetRawWorkFeeParas',{primarykey:option.id}).then(res => {
      let _objData = []
      for(let key in res[0]){
          let _obj = {}
          _obj.key = key
          _obj.value = parseInt(res[0][key])
          _objData.push(_obj)
      }
      this.setData({
        objData : _objData,
      })
    })
    // 动态金额字段
    util.psotData('GetAllRawWorkTotal',{primarykey:option.id}).then(res => {
      //  res = [{"Id":"1","TradeOrderSkuRawKey":"1","木加工":"100.00","木喷漆":"200.00","铁加工":"300.00"}]
      let _otherData = []
      for(let key in res[0]){
        if(/.*[\u4e00-\u9fa5]+.*$/.test(key)){
          let _obj = {}
          _obj.key = key
          _obj.value = parseInt(res[0][key])
          _otherData.push(_obj)
        }
      }
      this.setData({
        otherData : _otherData,
        otherPostData : res[0]
      })
    })
  },
  review_submit(e){
    let _vals = e.detail.value
    let _otherPostData = this.data.otherPostData
    console.log(_vals)
    for(let key in _vals){
      if(/.*[\u4e00-\u9fa5]+.*$/.test(key)){
        _otherPostData[key] = _vals[key]
      }
    }
    // console.log(_otherPostData)
    // return
    _vals.primarykey = this.data.id
    // _vals.primarykey = '15'
    _vals.totalfeejsonstring = JSON.stringify([_otherPostData])
    console.log(JSON.stringify(_vals))
    util.psotData('ReViewWorkRefSub',_vals).then(res => {
      console.log(res)
      if(res == 101){
        dd.alert({title:'提示',content:'soap登陆账号密码错误'})
      }
      if(res == 107){
        dd.alert({title:'提示',content:'outparameter参数为空'})
      }
      if(res == 113){
        dd.alert({title:'提示',content:'参数账号为空'})
      }
      if(res == 114){
        dd.alert({title:'提示',message:'主键Id为空'})
      }
      if(res == 115){
        dd.alert({title:'提示',content:'当前账号未绑定供应商或供应商未绑定工序'})
      }
      if(res == 116){
        dd.alert({title:'提示',content:'没有找到工序列表'})
      }
      if(res == 117){
        dd.alert({title:'提示',content:'审核失败'})
      }
      if(res == 1){
        dd.alert({title:'提示',content:'审核成功'})
      }
      if(res == 2){
        dd.alert({title:'提示',content:'状态改变'})
      }
    })
  }
});
