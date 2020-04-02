import {
  xml2json,
  json2xml
} from 'xml-js'

export const handleXmlToJson = function (rawData, key) {
  if (!rawData) return {}
  const dataText = xml2json(rawData, {
    compact: true,
    ignoreDeclaration: true
  })
  
  const dataJson = JSON.parse(dataText)
  const innerData = dataJson['soap:Envelope']['soap:Body'][`${key}Response`][`${key}Result`]['_text']
  console.log(innerData);
  
  if (innerData && innerData.indexOf('{') !== -1) {
    return JSON.parse(innerData)
  }else{
    return innerData
  }
}

export const handleJsonToXml = function (json, key) {
  const template = {
    'soap:Envelope': {
      'soap:Header': {
        MySoapHeader: {
          PassWord: {
            _text: "sunshine_dingding_program_185_!@#_765_===_698_>>>_55"
          },
          UserName: {
            _text: "sunshine_dingding_program"
          },
          _attributes: {
            'xmlns': "http://tempuri.org/"
          }
        }
      },
      'soap:Body': {
        [key]: {
          ...json,
          _attributes: {
            'xmlns': "http://tempuri.org/"
          }
        }

      },
      _attributes: {
        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
        'xmlns:xsd': "http://www.w3.org/2001/XMLSchema",
        'xmlns:soap': "http://schemas.xmlsoap.org/soap/envelope/"
      }
    }
  }
  return json2xml(JSON.stringify(template), {
    compact: true
  })
}


export const request = function (path, data) {
  const userData = getStorage('user_data')
  let loginInfo = {}
  if(userData.data){
    loginInfo = {
      outparameter:userData.data.Outparameter,
      useraccount:userData.data.username
    }
  }
  console.log('传参')
  console.log({...data, ...loginInfo})
  console.log(handleJsonToXml({...data, ...loginInfo}, path))
  return new Promise((resolve, reject) => {
    dd.httpRequest({
      url: 'http://39.100.63.10:30002/DDPhoneApi.asmx',
      method: 'POST',
      data: handleJsonToXml({...data, ...loginInfo}, path),
      headers: {
        "Content-Type": "text/xml; charset=utf-8"
      },
      dataType: 'text',
      success: res => {
        return resolve({
          ...res,
          data: handleXmlToJson(res.data, path)
        })
      },
      fail: res => {
        return reject({
          ...res,
          data: handleXmlToJson(res.data, path)
        })
      }
    })
  })

}

export const getStorage = (key) =>{
  return dd.getStorageSync({key})
}

export const isLogin = () => {
  const _userData = getStorage('user_data')
  if(!_userData.data){
    dd.navigateTo({url:'../login/login'})
  }
  return false
}

export const deepCopy = json => {
  return JSON.parse(JSON.stringify(json))
}