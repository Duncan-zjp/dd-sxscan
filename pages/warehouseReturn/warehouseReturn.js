import util from '../../util/util'
Page({
  data: {},
  onLoad(option) {
    if(option.id){
      this.setData({
        id:option.id
      })
    }
  },
  return_submit(e){
    let _vals = e.detail.value
    _vals.primarykey = this.data.id
    // _vals.primarykey = '15'
    console.log(_vals)
    util.psotData('RejectWorkRefSubByStock',_vals).then(res => {
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
        dd.alert({title:'提示',content:'主键Id为空'})
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
        dd.alert({title:'提示',content:'驳回成功'})
      }
      if(res == 2){
        dd.alert({title:'提示',content:'状态改变'})
      }
    })
  }
});
