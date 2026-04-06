const steps = [
  {
    element: '#step1',
    popover: {
      title: '检索角色',
      description: '输入需要查询的角色名（支持模糊查询）',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step2',
    popover: {
      title: '新建角色',
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
      title: '按工号或姓名查询',
      description: '输入工号或姓名查询职工的角色信息。',
      position: 'left',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step4',
    popover: {
      title: '角色树形图',
      description: '在该区域可检索本系统的所有角色的树形图。',
      position: 'right',
      nextBtnText: '下一步',
      closeBtnText: '关闭',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#step5',
    popover: {
      title: '角色列表操作区域',
      description: '用户在此可了解角色信息并根据需求更改角色信息或权限。',
      position: 'top',
      closeBtnText: '关闭',
      prevBtnText: '上一步',
      doneBtnText: '完成'
    }
  }
]

export default steps
