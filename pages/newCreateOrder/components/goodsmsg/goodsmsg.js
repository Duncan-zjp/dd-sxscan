Component({
  mixins: [],
  data: {
    bottom:-520,
    data:{}
  },
  props: {
    // 商品数据
    goods:{},
    // 加入购物车
    onJoin:()=>{}
  },
  didMount() {

  },
  didUpdate(_,{bottom}) {
    this.setData({
      bottom : bottom < 0 ? 0 : -520,
      data:this.props.goods
    })
  },
  didUnmount() {},
  methods: {
    handleCancel(){
      this.setData({bottom:-520})
    },
    handleNumBlur(e){
      this.setData({
        'data.购买数量':e.detail.value
      })
    },
    handleOnJoin(){
      this.props.onJoin(this.data.data)
      this.handleCancel()
    }
  },
});
