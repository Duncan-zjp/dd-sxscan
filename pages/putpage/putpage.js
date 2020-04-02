var t_data = [];
var warehouse_data = [];
var app = getApp()
import util from '../../util/util'



Page({
  data: {
    table_th:["序号","规格名称","数量","操作"],
    table_th_2:["序号","入库时间","商品编码","规格名称","数量","入库仓库"],
    table_td:[],
    table_tded:"",
    StartTime:"开始时间",
    EndTime:"结束时间",
    tabs_if:0,
    warehouse:warehouse_data,
    post_data:"",
    posted_data:"",
    search_inpu:"",
    outparameter:"",
    username:"",
    // 已入库总数
    inputNum : 0,
    userData:dd.getStorageSync({key:'user_data'}).data
  },
  onLoad(option) {
    console.log(app)
    console.log('进来获取外面传进来的参数')
    console.log(JSON.stringify(option))
    if(option.tab){
      this.setData({tabs_if:parseInt(option.tab)})
    }
    var that = this;
    dd.getStorage({
      key: 'user_data',
      complete: function(res) {
        console.log(res.data)
        if(res.data || res.data != ""){
          console.log(res.data) 
          var nmsl0 = res.data.Outparameter;
          var nmsl1 = res.data.username;
          that.setData({
            outparameter:nmsl0,
            username:nmsl1
          })
        }else{
          dd.navigateTo({url:'../login/login'});
        }
      }
    });

    // 获取仓库
    util.psotData('GetWarehouse').then(wareRes => {
      this.setData({
        warehouse:wareRes
      })
      // 获取已出库数据
      util.psotData('GetInStockSource',{
        begintime:this.data.StartTime,
        endtime:this.data.EndTime,
        createuser:this.data.search_inpu
      })
      .then(res => {
        res = res.map((item,index) => {
          item.TNum = index + 1
          item.WarehouseKey = wareRes.find(i => item.WarehouseKey == i.Id) ? wareRes.find(i => item.WarehouseKey == i.Id).WarehouseName : ''
          return item
        })
        //计算总入库数
        let _inputNum = res.reduce((prev,next) => prev+parseInt(next.Num),0);

        that.setData({
          posted_data:res,
          inputNum:_inputNum
        })
      })
    })

    
  },
  PutWarehousing(){
    var that = this;
    let t_data = this.data.table_td;
    console.log('t_data数据')
    console.log(typeof t_data)
    dd.scan({
      type: 'qr',
      success: (res) => {
        var res = res.code;
        console.log('扫码输出')
        console.log(res)
        var put_data={};
        put_data.TNum = res.split("|")[0];
        put_data.ItemKey = res.split("|")[1];
        put_data.SkuKey = res.split("|")[2];
        put_data.VendorKey = res.split("|")[3];
        put_data.shortName = res.split("|")[5];

        // put_data.Time = res.split("|")[4];
        put_data.Num = 1;
        put_data.ced = false;
        dd.getStorage({
          key: 'user_data',
          success: function(df) {
            put_data.CreateUser = df.data.username;
          }
        });
        // put_data.CreateUser = that.data.username;
        console.log(that.data.username)
        if(t_data.length){
          for(let i = 0;i<t_data.length;i++){
            if(t_data[i].ItemKey==put_data.ItemKey && t_data[i].SkuKey==put_data.SkuKey && t_data[i].VendorKey == put_data.VendorKey){
              t_data[i].Num++;
              this.setData({
                  table_td:t_data
              })
              return;
            }
          }
        }
        t_data.push(put_data);
        this.setData({
            table_td:t_data
        })
      },
    });
  },
  StartTime(){
    dd.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: '2019-01-01',
      success: (res) => {
        this.setData({
          StartTime:res.date,
          begintime:res.data
        })
      },
    });
  },
  EndTime(){
    dd.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: '2019-01-01',
      success: (res) => {
        this.setData({
          EndTime:res.date,
          endtime:res.data
        })
      },
    });
  },
  Tabs_0(){
    this.setData({
      tabs_if:0
    })
  },
  Tabs_1(){
    var that = this;
    this.setData({
      tabs_if:1
    })
    dd.httpRequest({
      url: 'http://39.100.63.10:30002/DDPhoneApi.asmx',
      method: 'POST',
      headers:{"Content-Type":"text/xml; charset=utf-8"},
      // [this.data.servercode,this.data.username,this.data.password]
      data:RequestByPost("GetInStockSource",["outparameter","begintime","endtime","createuser"],[that.data.userData.Outparameter,that.data.StartTime,that.data.EndTime,that.data.search_inpu],"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"),
      dataType: 'json',
      complete: function(res) {
        var res = res.data.split("<GetInStockSourceResult>")[1].split("</GetInStockSourceResult>")[0];
        var puterdata = JSON.parse(res);
        for(let i=0; i<puterdata.length;i++){
          puterdata[i].TNum = i+1;
        }
        let warehouse_data = that.data.warehouse
        puterdata.forEach(item => {
          warehouse_data.forEach(item2 => {
            if(item.WarehouseKey === item2.Id){
              item.WarehouseKey = item2.WarehouseName
            }
          })
        })
        console.log(puterdata)
        that.setData({
          posted_data:puterdata
        })
      }
    });
  },
  change_tr(e){
    var _itemkey = e.target.targetDataset.itemkey;
    var _skukey = e.target.targetDataset.skukey;
    var _val = e.detail.value
    var _index;
    var _data = this.data.table_td;
    console.log('原来的数据')
    console.log(JSON.stringify(_data))
    _data.forEach(item => {
      _data[_data.findIndex(i => i.ItemKey === _itemkey && i.SkuKey === _skukey)].ced = _val;
    })
    console.log('触发选择之后的数据')
    console.log(JSON.stringify(_data))
    this.setData({table_td:_data})
    // for(let i = 0;i<_data.length;i++){
    //   if(_data[i].ItemKey === _itemkey && _data[i].SkuKey === _skukey){
    //     _index = i;
    //     _data[i].ced = false;
    //   }
    // }
    // _data[_index].ced = _val;defaultTap
    // console.log('选择改变后的数据')
    // console.log(JSON.stringify(_newdata))
    // this.setData({
    //   post_data:e.detail.value
    // })
  },
  sele_ware(e){
    console.log(this.data.warehouse[e.detail.value].Id);
    var that = this;
    var postdata = this.data.table_td.filter(item => item.ced);
    
    if(postdata.length){
        for(let i=0;i<postdata.length;i++){
          postdata[i].WarehouseKey = that.data.warehouse[e.detail.value].Id
          postdata[i].CreateUser = that.data.userData.username
          
          // dd.getStorage({
          //   key: 'user_data',
          //   complete: function(res) {
          //     that.data.username = res.data.username;
          //   }
          // });
          // dd.getStorage({
          //   key: 'user_data',
          //   complete: function(res) {
          //     var nmsl0 = res.data.Outparameter;
          //     var nmsl1 = res.data.username;
          //     postdata[i].CreateUser = nmsl1;
          //   }
          // });
          delete postdata[i].TNum;
          // delete postdata[i].ced;
        }
        console.log('app数据')
        console.log(JSON.stringify(app))
        postdata = JSON.stringify(postdata)
        console.log('请求过去的参数')
        console.log('组装好请求过去的参数')
        console.log(RequestByPost("ScanInSotck",["outparameter","jsonarray"],[that.data.userData.Outparameter,postdata],"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/").toString())
        console.log(postdata)
        dd.httpRequest({
          url: 'http://39.100.63.10:30002/DDPhoneApi.asmx',
          method: 'POST',
          headers:{"Content-Type":"text/xml; charset=utf-8"},
          data:RequestByPost("ScanInSotck",["outparameter","jsonarray"],[that.data.userData.Outparameter,postdata],"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"),
          dataType: 'json',
          complete: function(res) {
            console.log('入库返回的信息')
            console.log(JSON.stringify(res.data))
            var res = res.data.split("<ScanInSotckResult>")[1].split("</ScanInSotckResult>")[0];
            if(res == "1"){
              dd.alert({title:"入库成功"})
              var all_data = that.data.table_td;
              var p_data = that.data.post_data;
              // for(let i = 0;i<p_data.length;i++){
              //   for(let j = 0;j<all_data.length;j++){
              //     if(p_data[i].ItemKey == all_data[j].ItemKey && p_data[i].SkuKey == all_data[j].SkuKey && p_data[i].VendorKey == all_data[j].VendorKey && p_data[i].Num == all_data[j].Num){
              //       all_data.splice(j,1)
              //     }
              //   }
              // }
              console.log('入库成功后原本的数据')
              console.log(postdata)
              JSON.parse(postdata).forEach(item => {
                all_data.splice(all_data.findIndex(i => i.ItemKey === item.ItemKey && i.SkuKey === item.SkuKey),1)
              })
              // p_data.forEach(item =>{
              //    all_data.splice(all_data.findIndex(i => i.ItemKey === item.ItemKey && i.SkuKey === item.SkuKey),1)
              // })
              console.log('入库成功后保留的数据')
              console.log(JSON.stringify(all_data))
              for(let i = 0;i<all_data.length;i++){
                all_data[i].ced = false;
              }
              that.setData({
                table_td:all_data,
                post_data:""
              })
            }
            if(res == "107"){
              dd.alert({title:"请扫码并选择商品"})
            }
              if(res == "112"){
              dd.alert({
                title:"JSON格式错误。"
              })
              return;
            }
            if(res == "113"){
              dd.alert({
                title:"JSON格式错误，不包含指定字段。"
              })
              return;
            }
            if(res == "114"){
              dd.alert({
                title:"请选择需要入库的商品"
              })
              return;
            }
          }
        });
    }else{
      dd.alert({
        title:"请选择需要入库的商品"
      })
    }
    if(res == "112"){
      dd.alert({
        title:"JSON格式错误。"
      })
      return;
    }
    if(res == "113"){
      dd.alert({
        title:"JSON格式错误，不包含指定字段。"
      })
      return;
    }
    if(res == "114"){
      dd.alert({
        title:"请选择需要入库的商品"
      })
      return;
    }
  },
  all_check(e){
    console.log(e);
  },
  search(){
    var that = this;
    dd.httpRequest({
      url: 'http://39.100.63.10:30002/DDPhoneApi.asmx',
      method: 'POST',
      headers:{"Content-Type":"text/xml; charset=utf-8"},
      // [this.data.servercode,this.data.username,this.data.password]
      data:RequestByPost("GetInStockSource",["outparameter","begintime","endtime","createuser"],[that.data.userData.Outparameter,that.data.StartTime,that.data.EndTime,that.data.search_inpu],"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"),
      dataType: 'json',
      complete: function(res) {
        if(res.data.split("<GetInStockSourceResult>")[1]){
          var res = res.data.split("<GetInStockSourceResult>")[1].split("</GetInStockSourceResult>")[0];
          var puterdata = JSON.parse(res);
          for(let i=0; i<puterdata.length;i++){
            puterdata[i].TNum = i+1;
          }
          console.log(puterdata)
          that.setData({
            posted_data:puterdata
          })
        }else{
          that.setData({
            posted_data:""
          })
        }
        
      }
    });
  },
  bindkey_search_inpu(e){
    this.setData({
      search_inpu: e.detail.value,
    });
  },
  editshopnum(e){
    console.log('修改时')
    console.log(JSON.stringify(e));
    let [tnum,val] = [e.target.targetDataset.one,e.detail.value];
    let _postdata = this.data.post_data;
    console.log('获取到的数据')
    console.log(JSON.stringify(_postdata))
    _postdata.map(item => {
      if(item.TNum === tnum){
        item.Num = val
      }
    })
    console.log('修改好的数据')
    console.log(JSON.stringify(_postdata))
    this.setData({
      post_data:_postdata
    })
  },
  // 删除
  delSelectData(e){
    let [itemkey,skukey] = [e.target.targetDataset.itemkey,e.target.targetDataset.skukey];
    let _delenddata = this.data.table_td.filter(i => i.ItemKey != itemkey && i.SkuKey != skukey);
    // console.log('原来的数据');
    // console.log(JSON.stringify(_delenddata));
    // _delenddata.forEach(item => {
    //   _delenddata.splice(_delenddata.findIndex(i =>i.ItemKey === item.ItemKey && i.SkuKey === item.SkuKey),1);
    // })
    console.log('删除之后保留的数据');
    console.log(JSON.stringify(_delenddata));
    this.setData({table_td : _delenddata})
  }
});



function RequestByPost(method,variable,value,url,_Namespace){
  var data;
  data = '<?xml version="1.0" encoding="utf-8"?>';
  data = data + '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
    
  //UserName ,Pwd这是我的SOAP验证形式，需替换
  data = data + "<soap:Header>"
  data = data + '<MySoapHeader  xmlns="http://tempuri.org/">'
  data = data + "<UserName>sunshine_dingding_program</UserName>"
  data = data + "<PassWord>sunshine_dingding_program_185_!@#_765_===_698_>>>_55</PassWord>"
  data = data + "</MySoapHeader >"
  data = data + "</soap:Header>"
    
    
  data = data + '<soap:Body>';
  data = data + '<'+method+' xmlns="'+_Namespace+'">';
  for(var i=0;i<variable.length;i++)
  {
  　　 data = data + '<'+variable[i]+'>'+value[i]+'</'+variable[i]+'>';
  }
  data = data + '</'+method+'>';
  data = data + '</soap:Body>';
  data = data + '</soap:Envelope>';
  return data
}



// 数据格式
// [
//   {"WarehouseKey":"1","ItemKey":"test-01","SkuKey":"test-sku-01","Num":"1","VendorKey":"1","CreateUser":"admin"},
//   {"WarehouseKey":"2","ItemKey":"test-02","SkuKey":"test-sku-02","Num":"2","VendorKey":"2","CreateUser":"admin"}
// ]