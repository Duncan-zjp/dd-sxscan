var t_data = [];
var warehouse_data = [];
var app = getApp()
import util from '../../util/util'



Page({
  data: {
    table_th:["序号","规格名称","数量","操作"],
    table_th_2:["序号","出库日期","商品编码","规格名称","数量",'出库仓库'],
    table_td:"",
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
    // 已出库总数
    outputNum : 0,
    userData:dd.getStorageSync({key:'user_data'}).data
  },
  onLoad(option) {
    var that = this;
    console.log('进来获取外面传进来的参数')
    console.log(JSON.stringify(option))
    if(option.tab){
      this.setData({tabs_if:parseInt(option.tab)})
    }

    // 获取仓库
    util.psotData('GetWarehouse').then(wareRes => {
      this.setData({
        warehouse:wareRes
      })
      // 获取已出库数据
      util.psotData('GetOutStockSource',{
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
        let _outputNum = res.reduce((prev,next) => prev+parseInt(next.Num),0);
        this.setData({
          posted_data:res,
          outputNum:_outputNum
        })
      })
    })

    

    
  },
  PutWarehousing(){
    var that = this;
    dd.scan({
      type: 'qr',
      success: (res) => {
        var res = res.code;
        var put_data={};
        put_data.TNum = res.split("|")[0];
        put_data.ItemKey = res.split("|")[1];
        put_data.SkuKey = res.split("|")[2];
        put_data.VendorKey = res.split("|")[3];
        put_data.shortName = res.split("|")[5];
        dd.getStorage({
          key: 'user_data',
          success: function(df) {
            put_data.CreateUser = df.data.username;
          }
        });
        // put_data.Time = res.split("|")[4];
        put_data.Num = 1;
        put_data.ced = false;
        
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
    // 获取已出库数据
      util.psotData('GetOutStockSource',{
        begintime:this.data.StartTime,
        endtime:this.data.EndTime,
        createuser:this.data.search_inpu
      })
      .then(res => {
        res = res.map((item,index) => {
          item.TNum = index + 1
          item.WarehouseKey = this.data.warehouse.find(i => item.WarehouseKey == i.Id) ? this.data.warehouse.find(i => item.WarehouseKey == i.Id).WarehouseName : ''
          return item
        })
        //计算总入库数
        let _outputNum = res.reduce((prev,next) => prev+parseInt(next.Num),0);
        this.setData({
          posted_data:res,
          outputNum:_outputNum
        })
      })
  },
  change_tr(e){
    this.setData({
      post_data:e.detail.value
    })
  },
  sele_ware(e){
    console.log(this.data.warehouse[e.detail.value].Id);
    var that = this;
    var postdata = this.data.post_data;
    // that.data.username = res.data.username;
    if(postdata.length){
        for(let i=0;i<postdata.length;i++){
          postdata[i].WarehouseKey = that.data.warehouse[e.detail.value].Id;
          postdata[i].CreateUser = that.data.userData.Outparameter
          delete postdata[i].TNum;
          delete postdata[i].ced;
        }
        postdata = JSON.stringify(postdata)
        console.log(postdata)
        dd.httpRequest({
          url: 'http://39.100.63.10:30002/DDPhoneApi.asmx',
          method: 'POST',
          headers:{"Content-Type":"text/xml; charset=utf-8"},
          data:RequestByPost("ScanOutSotck",["outparameter","jsonarray"],[that.data.userData.Outparameter,postdata],"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"),
          dataType: 'json',
          complete: function(res) {
            var res = res.data.split("<ScanOutSotckResult>")[1].split("</ScanOutSotckResult>")[0];
            console.log(res)
            if(res == "1"){
              dd.alert({title:"出库成功"})
              var all_data = that.data.table_td;
              var p_data = that.data.post_data;
              for(let i = 0;i<p_data.length;i++){
                for(let j = 0;j<all_data.length;j++){
                  if(p_data[i].ItemKey == all_data[j].ItemKey && p_data[i].SkuKey == all_data[j].SkuKey && p_data[i].VendorKey == all_data[j].VendorKey && p_data[i].Num == all_data[j].Num){
                    all_data.splice(j,1)
                  }
                }
              }
              
              for(let i = 0;i<all_data.length;i++){
                all_data[i].ced = false;
              }
              that.setData({
                table_td:all_data,
                post_data:""
              })
            }else if(res == "107"){
              dd.alert({title:"请扫码并选择商品"})
            }
          }
        });
    }else{
      dd.alert({
        title:"请选择需要出库的商品"
      })
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
      data:RequestByPost("GetOutStockSource",["outparameter","begintime","endtime","createuser"],[that.data.userData.Outparameter,that.data.StartTime,that.data.EndTime,that.data.search_inpu],"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"),
      dataType: 'json',
      complete: function(res) {
        if(res.data.split("<GetOutStockSourceResult>")[1]){
          var res = res.data.split("<GetOutStockSourceResult>")[1].split("</GetOutStockSourceResult>")[0];
          var puterdata = JSON.parse(res);
          for(let i=0; i<puterdata.length;i++){
            puterdata[i].TNum = i+1;
          }
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
  delSelectData(e){
    console.log('删除之前的数据')
    console.log(JSON.stringify(this.data.table_td))
    let [itemkey,skukey] = [e.target.targetDataset.itemkey,e.target.targetDataset.skukey];
    let _delenddata = this.data.table_td.filter(i => i.ItemKey != itemkey && i.SkuKey != skukey);
    console.log('删除之后保留的数据');
    console.log(JSON.stringify(_delenddata));
    this.setData({table_td : _delenddata});
    if(t_data.length && t_data.length > 0){
      t_data[t_data.findIndex(i => i.ItemKey === itemkey && i.SkuKey === skukey)].Num--;
    }
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