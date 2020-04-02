Component({
  mixins: [],
  data: {
    goodsList:[]
  },
  props: {
    show:false,
    onClose:()=>{},
    goods:[]
  },
  didMount() {
  },
  didUpdate() {
    this.setData({goodsList:this.props.goods})
  },
  didUnmount() {},
  methods: {
    handleOnClose(){
      this.props.onClose(this.data.goodsList)
    },
    handleNumBlur(e){
      const goodsList = this.data.goodsList
      const index = this.data.goodsList.findIndex(i => i.$id == e.target.dataset.id)
      goodsList[index].购买数量 = e.detail.value
      this.setData({
        goodsList:goodsList
      })
    },
    // 删除
    handleDelGoods(e){
      const goodsList = this.data.goodsList.splice(this.data.goodsList.findIndex(i=>i.$id == e.target.dataset.id),1)
      this.setData({goodsList:goodsList})
    }
  },
});
