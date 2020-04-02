import {psotData} from '../../util/util'

Component({
  mixins: [],
  data: {
    searchStr:'',
    goodList:[],
    data:[]
  },
  props: {
    show:true,
    onConfirm:()=>{},
    onCancel:()=>{}
  },
  didMount() {
    
  },
  didUpdate() {
    
  },
  didUnmount() {},
  methods: {
    searchInput(e){
      this.setData({searchStr:e.detail.value})
    },
    search(){
      const _title = this.data.searchStr
      if(!_title){
        return dd.showToast({content:'商品关键字不能为空'})
      }
      dd.showLoading()
      // 获取商品列表
      psotData('GetSkuSource',{title:_title}).then(res => {
        if(!res instanceof Array) return dd.showToast({content:'搜索商品失败'})
        this.setData({
          goodList:res.map((i,index) =>{
            i.value = index
            i.id = `${i.商品编码}${i.规格编码}`
            i.购买数量 = 1
            return i
          })
        })
        dd.hideLoading()
      })
    },
    changeSelect(e){
      this.setData({
        data:e.detail.value.map(i=>this.data.goodList[i])
      })
    },
    confirm(){
      this.props.onConfirm(this.data.data)
    },
    cancel(){
      this.props.onCancel()
    }
  },
});
