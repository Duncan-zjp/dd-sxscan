var user;
var Outparameter;
var app = getApp()
// 39.100.63.10:30002
Page({
  data: {
    // Outparameter:"",
    servercode:"",
    username:"",
    password:"",
    errormsg:'66'
  },
  onLoad() {
    let _that = this
    dd.getStorage({
      key: 'user_data',
      success: function(res) {
        if(!res.data){
          return
        }
        _that.setData({
          servercode : res.data.servercode ? res.data.servercode : '',
          username : res.data.username ? res.data.username : '',
          password : res.data.password ? res.data.password : '',
        })
        // dd.navigateTo({url:'../Scan/Scan'});
      }
    });
  },         
  websocket(){
    user = this.data.username
    let _that = this
    console.log(RequestByPost("Login",["servercode","username","password"],[this.data.servercode,this.data.username,this.data.password],"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"))
    // return;
    dd.httpRequest({
      url: 'http://39.100.63.10:30002/DDPhoneApi.asmx',
      method: 'POST',
      headers:{"Content-Type":"text/xml; charset=utf-8"},
      // [this.data.servercode,this.data.username,this.data.password]
      data:RequestByPost("Login",["servercode","username","password"],[this.data.servercode,this.data.username,this.data.password],"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"),
      dataType: 'json',
      complete: function(res) {
        console.log('登陆返回的信息')
        console.log(res)
        var resdata = res.data;
        var res = res.data.split("<LoginResult>")[1].split("</LoginResult>")[0];
        Outparameter = res
        
        if(res === "105" || res === '103'){
          dd.alert({
            title:'提示',
            content:'账号密码错误'
          })
          return;
        }else if(res === "102"){
          dd.alert({"title":"请填写服务码，账号，密码"})
          return;
        }
        dd.setStorageSync({
          key: 'user_data',
          data: {
            Outparameter: Outparameter,
            username:user,
            servercode:_that.data.servercode,
            password:_that.data.password
          }
        });

        app.Outparameter = Outparameter;
        app.username = user
        dd.switchTab({url:'../index/index'})
      },
      // complete:function(res){
      //   console.info('失败')
      //   console.info(res)
      // }
    });



    // dd.httpRequest({
    //   url: 'http://39.100.63.10:30002/DDPhoneApi.asmx',
    //   method: 'POST',
    //   headers:{
    //     "Content-Type": "application/json"
    //   },
    //   // [this.data.servercode,this.data.username,this.data.password]
    //   data:JSON.stringify({
    //     servercode:this.data.servercode,
    //     username:this.data.username,
    //     password:this.data.password
    //   }),
    //   // dataType: 'json',
    //   success: function(res) {
    //     console.info('成功')
    //     var res = res.data.split("<LoginResult>")[1].split("</LoginResult>")[0];
    //     var Outparameter = res
        
    //     if(res == "105"){
    //       dd.alert({"title":"账号密码错误"})
    //       return;
    //     }else if(res == "102"){
    //       dd.alert({"title":"请填写服务码，账号，密码"})
    //       return;
    //     }
    //     dd.setStorageSync({
    //       key: 'user_data',
    //       data: {
    //         Outparameter: Outparameter,
    //         username:user
    //       }
    //     });
    //     dd.navigateTo({url:'../Scan/Scan'})
        
    //   },
    //   complete:function(res){
    //    console.info('失败')
    //    console.info(JSON.stringify(res))
    //   }
    // });

  },
  bindkey_servercode(e){
    this.setData({
      servercode: e.detail.value,
    });
  },
  bindkey_username(e){
    this.setData({
      username: e.detail.value,
    });
  },
  bindkey_password(e){
    this.setData({
      password: e.detail.value,
    });
  }
});


var xmlhttp;
var value=new Array();
var variable=new Array();

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