Component({
  mixins: [],
  data: {},
  props: {
    show:true,
    list:[],
    onCancel:()=>{}
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    cancel(){
      this.props.onCancel()
    }
  },
});
