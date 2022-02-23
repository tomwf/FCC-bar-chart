// Select container
const chart = d3.select('#chart')

// Add title
chart.append('h1')
  .attr('id', 'title')
  .style('text-align', 'center')
  .style('font-weight', '300')
  .text('United States GDP')

// Add SVG
const w = 900
const h = 460
const padding = 40

const svg = chart.append('svg')
  .attr('width', w + (padding * 2))
  .attr('height', h + (padding * 2))

// Fetch data
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

fetch(url)
  .then(req => req.json())
  .then(res => {
    const data = res.data
      
    // Initialize scale for x and y axis
    const firstYear = new Date(data[0][0]).getFullYear()
    const lastYear = new Date(data[data.length - 1][0]).getFullYear()

    // Configure scales
    const xScale = d3.scaleLinear()
      .domain([firstYear, lastYear])
      .range([0, w])
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1])])
      .range([h, 0])

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => d.toString())
    const yAxis = d3.axisLeft(yScale)

    // Add x-axis
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('class', 'tick')
      .attr('transform', `translate(${padding}, ${h + padding})`)
      .call(xAxis)

    // Add y-axis
    svg.append('g')
      .attr('id', 'y-axis')
      .attr('class', 'tick')
      .attr('text-anchor', 'end')
      .style('text-align', 'right')
      .attr('transform', `translate(${padding}, ${padding})`)
      .call(yAxis)

    // Set bar width
    const barWidth = w / data.length

    // Add bar
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('width', barWidth)
      .attr('height', d => h - yScale(d[1]))
      .attr('x', (_, i) => i * barWidth + padding)
      .attr('y', d => yScale(d[1]) + padding)
      .on('mouseover', showTooltip)
      .on('mouseleave', hideTooltip)
  })

function period(date) {
  function getYear(date) {
    return new Date(date).getFullYear()
  }

  function getQuarter(date) {
    let month = new Date(date).getMonth()

    if (month < 3) {
      return 'Q1'
    } else if (month < 6) {
      return 'Q2'
    } else if (month < 9) {
      return 'Q3'
    } else {
      return 'Q4'
    }
  }

  return `${getYear(date)} ${getQuarter(date)}`
}

function gdpValue(gdp) {
  return `$ ${gdp} Billion`
}

function showTooltip(event) {
  // Tooltip settings
  const margin = 30
  const tooltipWidth = 150
  const tooltipHeight = 65
  const tooltipX = +event.target.attributes.x.value + margin
  const tooltipY = 400

  // Create tooltip element
  const tooltip = d3.select('svg')
    .append('g')
    .attr('id', 'tooltip')
    .attr('data-date', event.target.attributes['data-date'].value)
    .style('opacity', .5)

  tooltip
    .transition()
    .duration(500)
    .style('opacity', .9)

  // Add a background
  tooltip.append('rect')
    .attr('rx', '2')
    .attr('width', `${tooltipWidth}`)
    .attr('height', `${tooltipHeight}`)
    .attr('x', tooltipX)
    .attr('y',tooltipY)

  // Add date
  tooltip.append('text')
    .attr('x', tooltipX + tooltipWidth / 2)
    .attr('y', tooltipY + 25)
    .text(period(event.target.attributes['data-date'].value))

  // Add gdp
  tooltip.append('text')
    .attr('x', tooltipX + tooltipWidth / 2)
    .attr('y', tooltipY + 50)
    .text(gdpValue(event.target.attributes['data-gdp'].value))
}

function hideTooltip() {
  d3.selectAll('#tooltip').remove()
}
