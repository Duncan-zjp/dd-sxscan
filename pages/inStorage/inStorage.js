import {
  request
} from "../../common/js/common";
Page({
  data: {
    // 仓库列表
    isScanded: [],
    wareHouseList: [],
    goodsList: [],
    showPicker: false,
    wareHouseIdx: 0,
    isLoading: false
  },
  onLoad() {
    this.getWareHouse()
    this.setData({
      isScanded: [],
      wareHouseList: [],
      goodsList: [],
      showPicker: false,
      wareHouseIdx: 0,
      isLoading: false
    })
  },
  getWareHouse() {
    request('GetWarehouse', {}).then(res => {
      this.setData({
        wareHouseList: res.data.map(i => ({
          label: i.WarehouseName,
          value: i.Id
        }))
      })
    })
  },
  getQrCodeData(code) {
    return request('QRCodeInStock', {
      code
    })
  },
  onSelectChange(e) {
    this.setData({
      wareHouseIdx: e.detail.value[0]
    })
  },
  addGoods(code, {
    Spec,
    Color,
    PurchaseKey,
    SkuKey,
    VendorName,
    VendorKey,
    ItemKey,
    Qty,
    ReceivedQty
  }) {
    const id = PurchaseKey + VendorKey + SkuKey + ItemKey
    const goodsList = this.data.goodsList
    const isScanded = this.data.isScanded
    const qtyNum = Number(Qty)
    const receivedQtyNum = Number(ReceivedQty)

    if (qtyNum - receivedQtyNum <= 0) {
      return dd.alert({
        buttonText: '知道了',
        title: '提示',
        content: '该商品可入库数不足.'
      })
    }

    const sameGoods = goodsList.find(i => i.id === id)
    if (sameGoods) {
      if (sameGoods.scannedNum >= sameGoods.canReceivedQty) {
        return dd.alert({
          buttonText: '知道了',
          title: '提示',
          content: '该商品可入库数不足'
        })
      }
      sameGoods.scannedNum += 1
      sameGoods.qrCode.push(code)
    } else {
      goodsList.push({
        id,
        Spec,
        Color,
        PurchaseKey,
        VendorName,
        VendorKey,
        ItemKey,
        SkuKey,
        Qty: qtyNum,
        ReceivedQty: receivedQtyNum,
        canReceivedQty: qtyNum - receivedQtyNum,
        scannedNum: 1,
        qrCode: [code]
      })
    }
    isScanded.push(code)
    this.setData({
      goodsList: goodsList,
      isScanded: isScanded,
    })
  },
  handleScan() {
    this.setData({
      isLoading: true
    })
    dd.scan({
      type: 'qr',
      success: res => {
        const rawData = res.code
        if (this.qrCodeHasBeenScanded(rawData)) {
          return this.setData({
            isLoading: false
          })
        }
        this.getQrCodeData(rawData).then(res => {
          this.setData({
            isLoading: false
          })
          let msg = '网络繁忙'
          if (!res.data) {
            msg = '条码无效'
          }
          console.log(res.data);

          if (Array.isArray(res.data)) {
            return this.addGoods(rawData, res.data[0])
          }

          switch (res.data) {
            case '-3':
              msg = '唯一码为空'
              break;
            case '-6':
              msg = '唯一码格式错误'
              break;
            case '-7':
              msg = '该条码已做过入库操作'
              break;
            case '-8':
              msg = '未能找到想关条码信息'
              break;
            case '0':
              msg = '响应异常'
              break;
            case '-1':
              msg = 'soap登录失败'
              break;
            case '-2':
              msg = 'outparameter参数为空'
              break;
          }
          dd.alert({
            buttonText: '知道了',
            title: '提示',
            content: msg
          })
        }).catch(err => {
          console.log(err);
          this.setData({
            isLoading: false
          })
          dd.alert({
            buttonText: '知道了',
            title: '提示',
            content: '服务器繁忙'
          })
        })

      }
    })
  },
  qrCodeHasBeenScanded(code) {
    // 判断条码是否已经扫描
    const idx = this.data.isScanded.findIndex(i => i === code)
    if (idx !== -1) {
      dd.alert({
        buttonText: '知道了',
        title: '提示',
        content: '该条码已被扫描'
      })
      return true
    }
  },
  // handleDel(e) {
  //   const { id } = e.currentTarget.dataset
  //   const goodsList = this.data.goodsList

  //   const idx = goodsList.findIndex(i => i.id === id)
  //   if (idx === -1) return
  //   // 移除已扫描的码
  //   const delCode = goodsList[idx].qrCode.pop()
  //   const delIdx = isScanded.findIndex(i=>i===delCode)
  //   isScanded.splice(delIdx, 1)

  //   // 移除对应的商品数
  //   if(goodsList[idx].scannedNum > 1){
  //     goodsList[idx].scannedNum -= 1
  //   }else{
  //     goodsList.splice(idx, 1)
  //   }

  //   this.setData({
  //     goodsList,
  //     isScanded
  //   })

  // },
  selectWarehouseCancel() {
    this.setData({
      showPicker: false
    })
  },
  selectWarehouseConfirm() {
    if (this.data.isLoading) return
    dd.showLoading({ content: '正在入库...' });
    this.setData({
      isLoading: true
    })
    this.handleInStorage()
  },
  matchWareHouse(wareHouseIndex) {
    return this.data.wareHouseList[wareHouseIndex].value
  },
  clearData() {
    this.setData({
      showPicker: false,
      goodsList: [],
      wareHouseIdx: 0
    })
  },
  onInStorage() {
    this.setData({
      showPicker: true
    })
  },
  handleInStorage() {
    const msg = []
    const goodsListIsEmpty = this.data.goodsList.length !== 0
    const chosesWareHouse = this.data.wareHouseIdx !== undefined && this.data.wareHouseIdx !== ''
    if (!(goodsListIsEmpty && chosesWareHouse)) {
      if (!goodsListIsEmpty) {
        msg.push('商品列表不能为空')
      }

      if (!chosesWareHouse) {
        msg.push('入库仓库不能为空')
      }
      this.setData({
        isLoading: false
      })
      dd.hideLoading();
      return dd.alert({
        buttonText: '知道了',
        title: '提示',
        content: `${msg.join('\r\n')}`
      })
    }

    const wareHouseValue = this.matchWareHouse(this.data.wareHouseIdx)
    const goodsData = JSON.parse(JSON.stringify(this.data.goodsList))
    console.log(wareHouseValue, goodsData);
    const data = goodsData.map(item => ({
      PurchaseKey: item.PurchaseKey,
      VendorKey: item.VendorKey,
      ItemKey: item.ItemKey,
      SkuKey: item.SkuKey,
      scannedNum: item.scannedNum,
      Code: item.qrCode.join(','),
    }))
    request('FinishedInStock', {
      jsonitem: JSON.stringify(data),
      warehousekey: wareHouseValue,
    }).then(res => {
      this.setData({
        isLoading: false
      })
      dd.hideLoading();
      let msg = '网络繁忙'
      if (!res.data) {
        msg = '网络繁忙 0'
      }
      if (res.data === '1') {
        msg = '入库成功'
        this.clearData()
      }
      switch (res.data) {
        case '-3':
          msg = 'jsonitem或warehousekey传入参数为空'
          break;
        case '-4':
          msg = '仓库参数错误'
          break;
        case '-5':
          msg = 'json解析错误'
          break;
        case '-6':
          msg = 'jsonitem 参数不为空解析出的值为空'
          break;
        case '-7':
          msg = 'jsonitem格式错误'
          break;
        case '-8':
          msg = 'jsonitem 值中存在空值'
          break;
        case '-9':
          msg = '待入库数量与唯一码数量不匹配'
          break;
        case '-10':
          msg = '唯一码格式错误'
          break;
        case '-11':
          msg = '待入库数必须出入大于0数值'
          break;
        case '0':
          msg = '响应异常'
          break;
        case '-1':
          msg = 'soap登录失败'
          break;
        case '-2':
          msg = 'outparameter参数为空'
          break;
      }
      return dd.alert({
        buttonText: '知道了',
        title: '提示',
        content: msg
      })
    }).catch(err => {
      console.log(err);
      this.setData({
        isLoading: false
      })
      dd.hideLoading();
    })
  }
});