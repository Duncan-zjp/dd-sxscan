var app = getApp()

// 39.100.63.10:30002

const isLogin = () => {
  const _userData = dd.getStorageSync({key:'user_data'})
  if(!_userData.data){
    dd.navigateTo({url:'../login/login'})
  }
  return false
}

let psotData = function(fnStr,data={},returnResStr){
  // if(typeof app.Outparameter === 'undefined'){
  //   dd.navigateTo({url:'../login/login'});
  //   return;
  // }
  console.log('开始执行')
  let _keys = Object.keys(data);
  let _vals = Object.values(data);
  const _user = dd.getStorageSync({ key: 'user_data' })
  _keys.unshift('useraccount')
  // _vals.unshift(app.username)
  _vals.unshift(_user.data.username)
  _keys.unshift('outparameter')
  // _vals.unshift(app.Outparameter)
  _vals.unshift(_user.data.Outparameter)
  console.log('接口名称---'+fnStr)
  console.log('传参')
  console.log(JSON.stringify({
    ...data,
    useraccount:_user.data.username,
    outparameter:_user.data.Outparameter,
  }))
  console.log(RequestByPost(fnStr,_keys,_vals,"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"))
  return new Promise(function(resole,reject){
    dd.httpRequest({
      url: 'http://39.100.63.10:30002/DDPhoneApi.asmx',
      method: 'POST',
      headers:{"Content-Type":"text/xml; charset=utf-8"},
      data:RequestByPost(fnStr,_keys,_vals,"http://39.100.63.10:30002/DDPhoneApi.asmx","http://tempuri.org/"),
      dataType: 'json',
      complete: function(res) {
        // console.log(JSON.stringify(res))
        // console.log('res.data.split(`<${fnStr}Result>`)[1]')
        // console.log(res.data.split(`<${fnStr}Result>`)[1])
        // 判断数据是否为空
        let _isdata = res.data.indexOf(`<${fnStr}Result>`) == -1 ? false : true;
        // console.log(_isdata)
        // return;
        var res_data = _isdata ? res.data.split(`<${fnStr}Result>`)[1].split(`</${fnStr}Result>`)[0] : '[]';
        res_data = returnResStr ? res_data : JSON.parse(res_data)
        resole(res_data)
        console.log('返回值')
        console.log(res_data)
        console.log(res.data)
      }
    });
  })
}


function RequestByPost(method,keys,vals,url,_Namespace){
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
  for(var i=0;i<keys.length;i++)
  {
  　　 data = data + '<'+keys[i]+'>'+vals[i]+'</'+keys[i]+'>';
  }
  data = data + '</'+method+'>';
  data = data + '</soap:Body>';
  data = data + '</soap:Envelope>';
  return data
}


module.exports = {
  isLogin : isLogin,
  psotData : psotData
}