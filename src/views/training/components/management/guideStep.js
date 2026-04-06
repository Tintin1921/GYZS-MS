const steps = [
  {
    element: '#step1',
    popover: {
      title: '资料模糊搜索',
      description: '管理员可以在当前表格中模糊搜索资料。',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step2',
    popover: {
      title: '培训工单',
      description: '管理员点击后可下发培训工单。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step3',
    popover: {
      title: '上传资料',
      description: '管理员点击后可上传培训资料。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step4',
    popover: {
      title: '功能按钮组',
      description: '点击后可切换下方表格区域显示的内容。',
      position: 'bottom',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step5',
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
