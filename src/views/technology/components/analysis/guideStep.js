const steps = [
  {
    element: '#step1',
    popover: {
      title: '选择时间范围',
      description: '选择想要查询生产批次的时间范围。',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step2',
    popover: {
      title: '选择生产线',
      description: '系统自动根据时间筛选出该时间段内的所有生产线，用户选择想要查询的路线。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step3',
    popover: {
      title: '选择工序',
      description: '系统自动根据上述条件筛选出所有工序，用户选择想要查询的工序。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step4',
    popover: {
      title: '选择规格/品牌',
      description: '系统自动筛选出所有规格/品牌，用户选择想要查询的规格/品牌。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step5',
    popover: {
      title: '核心功能按钮组',
      description: '用户在此进行功能操作，将鼠标放置按钮上时会提示该按钮的具体功能。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step6',
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
