const tempSession = [];

// 设置session
export function setSession(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

// 获取session
export function getSession(key) {
  return JSON.parse(sessionStorage.getItem(key))
}

// 删除session
export function deleteSession(chart, boolean) {
  if (boolean) {
    chart.realData = false
    // socket
    const json = {
      chartId: chart.id,
      type: 'REMOVE_CHART'
    }
    chart.socket.send(JSON.stringify(json))
  }
  sessionStorage.removeItem(chart.id)
}

// 设置series
export function setSeries(res) {
  const array = res.reduce((acc, item) => {
    const existingItem = acc.find(i => i.dataPointCode === item.dataPointCode)
    if (existingItem) {
      existingItem.data.push(parseFloat(item.dataPointValue))
      existingItem.time.push(item.collectionTime)
    } else {
      acc.push({
        name: item.dataPointName.split('_').pop(),
        dataPointCode: item.dataPointCode,
        type: 'line',
        data: [item.dataPointValue],
        time: [item.collectionTime],
        animationDuration: 2800,
        animationEasing: 'cubicInOut',
        smooth: true
      })
    }
    return acc
  }, [])
  array.forEach((item, index) => {
    item.yAxisIndex = index
  })
  return array
}

// 设置xAxis
export function setXAxis(series) {
  const [obj] = series
  return {
    data: obj.time,
    boundaryGap: false,
    axisTick: {
      show: false
    }
  }
}

// 设置yAxis
export function setYaxis(series) {
  const yAxis = []
  // let max = 0
  series.map(item => {
    // max = (Math.max(...item.data)) * 1.5
    // if (!max) {
    //   max = 0
    // }
    const obj = {
      type: 'value',
      name: item.name,
      show: false,
      // max: max
    }
    yAxis.push(obj)
  })
  return yAxis
}

// 设置Graphic
export function setGraphic(series, boolean) {
  const graphic = []
  // 只有实时数据才显示设置Graphic
  if (boolean) {
    series.map((item, index) => {
      const [value] = item.data
      const obj = {
        type: 'text',
        left: '0%',
        top: `${40 + index * 25}px`,
        style: {
          text: item.name + ':' + value,
          fill: '#000',
          font: '12px sans-serif'
        }
      }
      graphic.push(obj)
    })
  }
  return graphic
}

// 处理实时数据
export function setRealData(id, chartData) {
  const session = getSession(id)
  if (session) {
    // 处理series
    chartData.series.forEach(item => {
      session.series.forEach(obj => {
        if (item.dataPointCode === obj.dataPointCode) {
          item.data = obj.data.concat(item.data)
          item.time = obj.time.concat(item.time)
        }
      })
    })
    // 处理xAxis
    const [obj] = chartData.series
    chartData.xAxis.data = obj.time
    // 处理yAxis
    // chartData.yAxis.forEach(item => {
    //   chartData.series.forEach(obj => {
    //     if (item.name === obj.name) {
    //       item.max = (Math.max(...obj.data) * 1.2).toFixed(2)
    //     }
    //   })
    // })
    // 处理graphic
    chartData.graphic.forEach(item => {
      chartData.series.forEach(obj => {
        if (item.name === obj.name) {
          item.text = obj.name + ':' + obj.data
        }
      })
    })
  }
  setSession(id, chartData)
}

// 处理预警数据
export function mergeObjects(a, b) {
  const result = {}
  for (const id of Object.keys(b)) {
    const bArray = b[id]
    const aArray = a[id] || []
    const aMap = new Map()
    aArray.forEach(item => {
      aMap.set(item.dataPointCode, item.dataPointValue)
    })
    result[id] = bArray.map(item => {
      const dataPointValue = aMap.get(item.dataPointCode)
      return { ...item, dataPointValue }
    })
  }
  return result
}
