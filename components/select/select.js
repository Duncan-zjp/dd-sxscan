Component({
  mixins: [],
  data: {
    value:'',
    
  },
  props: {
    placeholder:'',
    selectData:[],
    labelKey:'label',
    index:0,
    defaultValue:'',
    disabled:false,
    onChange:()=>{}
  },
  didMount() {
    console.log(this.props)
  },
  didUpdate() {
  },
  didUnmount() {},
  methods: {
    onChange(e){
      console.log(66666666)
      this.setData({
        select:this.props.selectData[e.detail.value]
      })
      this.props.onChange(e)
    }
  },
});
