App({
  globalData:"",
  
  onLaunch(options) {
    dd.removeStorage({key:'scanOrder'})
    
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
