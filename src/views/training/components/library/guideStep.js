const steps = [
  {
    element: '#step1',
    popover: {
      title: '模糊搜索资料',
      description: '输入资料名称后可模糊搜索想要查询的资料信息。',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step2',
    popover: {
      title: '根据资料上传时间范围查询',
      description: '系统自动根据时间筛选出该时间段内的所有资料。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step3',
    popover: {
      title: '选择资料分类',
      description: '系统已上传的资料分类进行筛选查询。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step4',
    popover: {
      title: '表格展示区',
      description: '用户查询的数据信息将会在此区域展示。',
      position: 'top',
      closeBtnText: '关闭',
      prevBtnText: '上一步',
      doneBtnText: '完成'
    }
  }
]

export default steps
