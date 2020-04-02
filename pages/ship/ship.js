import {
  request
} from '../../common/js/common';
Page({
  data: {
    submitLoading: false,
    formProp: [
      {
        label: '系统单号',
        prop: 'xtdh',
        required: true,
        type: 'input',
        disabled: true
      },
      {
        label: '收货人',
        prop: 'shr',
        type: 'input',
        disabled: true
      },
      {
        label: '收货电话',
        prop: 'shdh',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '收货地址',
        prop: 'shdz',
        type: 'input'
      },
      {
        label: '物流公司',
        prop: 'wlgs',
        type: 'select',
        required: true,
        selectData: []
      },
      {
        label: '物流运费',
        prop: 'wlyf',
        type: 'input',
        required: true,
        option: {
          type: 'number'
        }
      },
      {
        label: '运费类型',
        prop: 'wlgs',
        type: 'select',
        required: true,
        selectData: []
      },
      {
        label: '物流单号',
        prop: 'wldh',
        type: 'input',
        required: true
      },
      {
        label: '预计运费',
        prop: 'yjyf',
        type: 'input',
        disabled: true
      },
      {
        label: '体积单价',
        prop: 'tjdj',
        type: 'input'
      },
      {
        label: '总体积',
        prop: 'ztj',
        type: 'input',
        option: {
          type: 'number'
        },
        required: true
      },
      {
        label: '配送电话',
        prop: 'psdh',
        type: 'input'
      },
      {
        label: '配送公司',
        prop: 'psgs',
        type: 'input'
      },
      {
        label: '配送单号',
        prop: 'psdh',
        type: 'input'
      },
      {
        label: '配送类型',
        prop: 'pslx',
        type: 'select',
        selectData: []
      },
      {
        label: '搬楼费用',
        prop: 'blfy',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '送货费用',
        prop: 'shfy',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '配送总计',
        prop: 'pszj',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '安装费用',
        prop: 'azfy',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '包件总数',
        prop: 'bjzs',
        type: 'input',
        required: true,
        option: {
          type: 'number'
        }
      },
      {
        label: '拉货费用',
        prop: 'lhfy',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '木架费',
        prop: 'mjf',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '供应厂商',
        prop: 'gycs',
        type: 'select',
        selectData: []
      },
      {
        label: '好评返现',
        prop: 'fxhp',
        type: 'input',
        option: {
          type: 'number'
        }
      }, {
        label: '物流保险',
        prop: 'wlbx',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '发货时间',
        prop: 'fhsj',
        required: true,
        type: 'date'
      },
      {
        label: '优惠返现',
        prop: 'yhfx',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '加收费用',
        prop: 'jsfy',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '大理石费用',
        prop: 'dlsfy',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '预计到货',
        prop: 'yjdh',
        required: true,
        type: 'date'
      },
      {
        label: '发货备注',
        prop: 'fhbz',
        type: 'input'
      },
      {
        label: '发货仓库',
        prop: 'fhck',
        type: 'select',
        selectData: []
      },
      {
        label: '超区费用',
        prop: 'cqfy',
        type: 'input',
        option: {
          type: 'number'
        }
      },
      {
        label: '超方费用',
        prop: 'cffy',
        type: 'input',
        option: {
          type: 'number'
        }
      }
    ],
    formData: {
      syncSend: false,
      xtdh: '123',
      shr: '张大山'
    }
  },
  onLoad(query) {
    console.log(query);
    this.setData({
      'formData.xtdh': query.orderNum,
      'formData.shr': query.buyerName,
      'formData.shdh': query.buyerPhone
    })
  },
  getWarehouse(){
    request('GetWarehouse', {}).then(res => {
      this.findFormProp('fhck').selectData = res.data.map(i => ({
        label: i.WarehouseName,
        value: i.Id
      }))
      this.setData({
        formProp: this.data.formProp
      })
    })
  },
  findFormProp(prop) {
    return this.data.formProp.find(i => i.prop === prop)
  },
  propIsExist(prop) {
    return prop !== undefined && prop !== '' && prop !== null
  },
  handleRequiredParams(requiredList) {
    const missParams = []
    let failFlag = false
    requiredList.forEach(item => {
      const bool = Object.keys(this.data.formData).includes(item.prop)
      if (!bool) {
        missParams.push(item.label)
      }
    });

    if (missParams.length !== 0) {
      failFlag = true
      dd.alert({
        title: '字段缺失',
        content: `请完善以下字段：\r\n[${missParams.join('，')}]`,
        buttonText: '知道了'
      })
    }

    return failFlag
  },
  handleSelectData(copyData, selectDataList) {
    selectDataList.forEach(item => {
      if (copyData[item.prop] !== undefined) {
        copyData[item.prop] = item.selectData[copyData[item.prop]].value
      }
    })
  },
  onSubmit() {
    let failFlag = false
    const requiredList = this.data.formProp.filter(i => i.required)
    const selectDataList = this.data.formProp.filter(i => i.type === 'select')
    const copyData = JSON.parse(JSON.stringify(this.data.formData))
    this.setData({
      submitLoading: true
    })

    // 检查缺失字段
    failFlag = this.handleRequiredParams(requiredList)

    // 处理select data
    this.handleSelectData(copyData, selectDataList)
    this.setData({
      submitLoading: false
    })
    console.log(copyData);
    if (failFlag) return
    // 请求接口
  },
  handleSetData(e, value) {
    const prop = e.currentTarget.dataset.prop
    this.setData({
      ['formData.' + prop]: value
    })
  },
  switchChange(e){
    this.setData({
      'formData.syncSend': e.detail.value
    })
  },
  bindPickerChange(e) {
    const value = e.detail.value
    this.handleSetData(e, value)
  },
  bindInput(e) {
    const value = e.detail.value
    this.handleSetData(e, value)
  },
  handleDatePicker(e) {
    const prop = e.currentTarget.dataset.prop
    if (this.findFormProp(prop).disabled) {
      return
    }
    dd.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: this.data.formData[prop] || '',
      success: res => {
        this.handleSetData(e, res.date)
      },
      fail: res => {
        console.log(res)
      }
    })
  }
});