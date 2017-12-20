var dataset = [], svg, w, h, bars,
    numCountOfDataset = 23,
    numDatasetMaxRandom = 100,
    numDatasetMinRandom = 0,
    xScale, yScale, rScale, fnIterate, xAxis, yAxis, elmGForText,
    numWidthOfBar, numXAddForTxt, fontSizeScale,
    numXAddForBar = 3, numYAddForHeight = 5,
    formatAsPercentage, numPrevLength_Dataset = 23, key,
    elmTxt, numIndex, numMinKey, numMaxKey, rects, numElm1stIndex,
    boolBtn = {
      labelBtn: true,
      repeatBtn: false,
      sortBtn: null
    },
    numWidth = window.innerWidth, numHeight = window.innerHeight,
    objFnMap = {};

function fnUpdate_dataset() {
  dataset = (function() {
    var tempResult = []
    for(var i = 0; i < numPrevLength_Dataset; i++) tempResult.push({
      key: i,
      value: Math.floor(Math.random() * numDatasetMaxRandom)
    })
    return tempResult
  })()
  numIndex = dataset.length - 1
}

function fnFindMinMaxIdex() {
  numMinKey = d3.min(dataset, function(d) {
    return d.key
  })
  numMaxKey = d3.max(dataset, function(d) {
    return d.key
  })
}

function fnUpdateValues() {
  numWidthOfBar = w / dataset.length / 2
  numXAddForTxt = numWidthOfBar / 2 + 3;
}

function fnUpdateD3Select() {
  bars = svg.selectAll('rect.barRect')
            .data(dataset, key)
  elmTxt = svg.selectAll('text.labelTxt')
              .data(dataset, key)
}

function fnUpdateInputDomain() {
  xScale.domain(boolBtn.sortBtn === null ? dataset.map(function(val) { return val.key }) : d3.range(dataset.length))
}

function fnUpdate_numElm1stIndex(a) {
  numElm1stIndex !== a && (numElm1stIndex = a)
}

function fnRender() {
  fnUpdate_dataset()
  fnFindMinMaxIdex()
  fnUpdateValues()
  numElm1stIndex = numMinKey
  xScale = d3.scale.ordinal()
            .domain(d3.range(dataset.length))
            .rangeBands([40, w - 40])

  fontSizeScale = d3.scale.linear()
                    .domain([5, 23])
                    .range([8, 6])
                    .clamp(true)

  yScale = d3.scale.linear()
            .domain([numDatasetMinRandom, numDatasetMaxRandom])
            .range([h - 40, 5])
            .clamp(true)

  colorScale = d3.scale.linear()
                .domain([numDatasetMinRandom, numDatasetMaxRandom])
                .range(['red', 'blue'])

  svg.append('g')
    .attr('id', 'barContainer')
    .attr('clip-path', 'url(#chart-area)')
    .selectAll('#barContainer rect')
    .data(dataset, key)
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return xScale(d.key) + numXAddForBar
    })
    .attr('y', function(d) {
      return yScale(d.value) + numYAddForHeight
    })
    .attr('width', numWidthOfBar)
    .attr('height', function(d) {
      return yScale(numDatasetMaxRandom - d.value)
    })
    .attr('fill', function(d) {
      return colorScale(d.value)
    })
    .attr('data-value', function(d) {
      return d.value
    })
    .attr('data-key', function(d) {
      return d.key
    })
    .attr('class', 'barRect')
    .on('touchstart', fnTouchstartEvt, { passive: true })
    .on('touchend', fnTouchendEvt)
  boolBtn.labelBtn && fnRenderLabel()

  objFnMap = {
    resetBtn: function() {
      // remove existing data for adding new data.
      bars.remove()
      elmTxt.remove()

      fnUpdate_dataset()
      fnUpdateValues()

      fnUpdateChart('reset')
    },
    removeBtn: function() {
      if(dataset.length == 5) return alert('At least data should be more than five.')
      var numTargetIndex = dataset.findIndex(function(val) { return val.key == numElm1stIndex })
      numTargetIndex > -1 && (
        dataset.splice(numTargetIndex, 1),
        numPrevLength_Dataset = dataset.length,
        fnFindMinMaxIdex(),
        fnUpdateChart('remove')
      )
    },
    plusBtn: function() {
      if(dataset.length == 23) return alert('data can\'t be added more than 23.')
      numPrevLength_Dataset = dataset.length
      dataset.push({
        key: ++numIndex,
        value: Math.floor(Math.random() * numDatasetMaxRandom)
      })
      fnUpdateChart('add')
    },
    sortBtn: function() {
      // sortBtn can have three states : not ordered, ascended, descended.
      boolBtn.sortBtn === true
        ? (boolBtn.sortBtn = false)
        : boolBtn.sortBtn === false
          ? (boolBtn.sortBtn = null)
          : boolBtn.sortBtn === null && (boolBtn.sortBtn = true);

      // belows need for update.
      fnUpdateD3Select()
      fnUpdateInputDomain()

      // the state : not ordered.
      boolBtn.sortBtn == null && (
        bars.order(),
        elmTxt.order(),
        fnUpdate_numElm1stIndex(dataset[0].key)
      )

      fnUpdateChart()
    }
  }

  // button click function.
  d3.selectAll('button')
    .on('click', function() {
      var id = d3.select(this).attr('id')
      return objFnMap.hasOwnProperty(id) ? objFnMap[id]() : null
    })

  var elmBarContainer = document.querySelector('#barContainer').getBBox()
  svg.append('clipPath')
    .attr('id', 'chart-area')
    .append('rect')
    .attr('x', elmBarContainer.x)
    .attr('y', elmBarContainer.y)
    .attr('width', elmBarContainer.width)
    .attr('height', elmBarContainer.height)

  fnUpdateD3Select()
}

function fnRenderLabel() {
  elmGForText = svg.append('g')
                  .attr('class', 'labelContainer')
                  .attr('clip-path', 'url(#chart-area)')
                  .selectAll('text')
                  .data(dataset, key)
                  .enter()
                  .append('text')
                  .text(function(d) {
                    return d.value
                  })
                  .attr('x', function(d, i) {
                    return xScale(d.key) + numXAddForTxt
                  })
                  .attr('y', function(d) {
                    return yScale(d.value) + (4 > d.value ? -6 : 16)
                  })
                  .attr('font-size', function(d) {
                    return 4 > d.value ? 8 : fontSizeScale(dataset.length)
                  })
                  .attr('fill', function(d) {
                    return 4 > d.value ? colorScale(d.value) : 'white'
                  })
                  .attr('text-anchor', 'middle')
                  .attr('class', 'labelTxt')
                  .attr('data-key', function(d) {
                    return d.key
                  })
                  .attr('data-value', function(d) {
                    return d.value
                  })
}

function fnUpdateChart(action) {
  fnFindMinMaxIdex()
  action && (fnUpdateValues(), fnUpdateInputDomain())
  fnUpdateD3Select()

  if(action == 'add' || action == 'reset') {
    bars.enter()
      .append('rect')
      .attr('x', function(d, i) {
        return 40
      })
      .attr('y', function(d) {
        return yScale(d.value) + 5
      })
      .attr('height', function(d) {
        return yScale(numDatasetMaxRandom - d.value)
      })
      .attr('width', numWidthOfBar)
      .attr('fill', function(d) {
        return colorScale(d.value)
      })
      .attr('data-value', function(d) {
        return d.value
      })
      .attr('data-key', function(d) {
        return d.key
      })
      .attr('class', 'barRect')
      .style({ opacity: 0 })
      .on('touchstart', fnTouchstartEvt, { passive: true })
      .on('touchend', fnTouchendEvt)

    elmTxt.enter()
      .append('text')
      .attr('x', function(d, i) {
        return 40
      })
      .attr('y', function(d) {
        return yScale(d.value) + (4 > d.value ? -6 : 16)
      })
      .attr('font-size', function(d) {
        return 4 > d.value ? 8 : fontSizeScale(dataset.length)
      })
      .attr('fill', function(d) {
        return 4 > d.value ? colorScale(d.value) : 'white'
      })
      .attr('data-key', function(d) {
        return d.key
      })
      .attr('data-value', function(d) {
        return d.value
      })
      .attr('text-anchor', 'middle')
      .attr('class', 'labelTxt')

  }

  // sorting using with d3
  boolBtn.sortBtn !== null && (
    boolBtn.sortBtn ? (bars.sort(fnAscending), elmTxt.sort(fnAscending)) : (bars.sort(fnDescending), elmTxt.sort(fnDescending))
  )

  bars.transition()
    .delay(function(d, i) {
      return i / dataset.length * 400
    })
    .duration(350)
    .attr('x', function(d, i) {
      i == 0 && fnUpdate_numElm1stIndex(d.key)
      return xScale(boolBtn.sortBtn === null ? d.key : i) + numXAddForBar
    })
    .attr('y', function(d) {
      return yScale(d.value) + 5
    })
    .attr('width', numWidthOfBar)
    .attr('height', function(d) {
      return yScale(numDatasetMaxRandom - d.value)
    })
    .attr('fill', function(d) {
      return colorScale(d.value)
    })
    .attr('data-value', function(d) {
      return d.value
    })
    .attr('data-key', function(d) {
      return d.key
    })
    .style({ opacity: 1 })

  elmTxt.transition()
    .delay(function(d, i) {
      return i / dataset.length * 300
    })
    .duration(300)
    .text(function(d) {
      return d.value
    })
    .attr('x', function(d, i) {
      return xScale(boolBtn.sortBtn === null ? d.key : i) + numXAddForTxt
    })
    .attr('y', function(d) {
      return yScale(d.value) + (4 > d.value ? -6 : 16)
    })
    .attr('font-size', function(d) {
      return 4 > d.value ? 8 : fontSizeScale(dataset.length)
    })
    .attr('fill', function(d) {
      return 4 > d.value ? colorScale(d.value) : 'white'
    })
    .attr('data-key', function(d) {
      return d.key
    })
    .attr('data-value', function(d) {
      return d.value
    })

  if(action == 'remove') {
    bars.exit()
      .transition()
      .duration(400)
      .attr('x', w + 100)
      .style({ opacity: 0.5 })
      .remove()

    elmTxt.exit()
      .transition()
      .duration(400)
      .attr('x', w + 100)
      .style({ opacity: 0.5 })
      .remove()

    fnUpdateChart()
  }

}

document.addEventListener('DOMContentLoaded', function() {
  var elmSvg = document.querySelector('svg').getBoundingClientRect()
  w = elmSvg.width
  h = elmSvg.height
  svg = d3.select('svg')
          .attr('width', w)
          .attr('height', h)
  fnRender()
  window.addEventListener('resize', function() {
    (window.innerWidth > numWidth * 1.09 || numWidth * 0.91 > window.innerWidth || window.innerHeight > numHeight * 1.09 || numHeight * 0.91 > window.innerHeight) && window.location.reload()
  })
  key = function(d) { return d.key }
})

function fnReset() {
  fnUpdate_dataset()
  fnUpdateChart()
}

function fnClickEvt() {
  d3.select(this)
    .transition()
    .duration(250)
    .attr('fill', 'green')
}

function fnMouseOutEvt() {
  d3.select(this)
    .transition()
    .duration(250)
    .attr('fill', function(d) {
      return colorScale(d.value)
    })
}

function fnTouchstartEvt() {
  var elm = d3.select(this)
  elm.classed('hover') || elm.classed('hover', true)
}

function fnTouchendEvt() {
  var elm = d3.select(this)
  elm.classed('hover') && elm.classed('hover', false)
}

function fnAscending(a, b) {
  return d3.ascending(a.value, b.value)
}

function fnDescending(a, b) {
  return d3.descending(a.value, b.value)
}
