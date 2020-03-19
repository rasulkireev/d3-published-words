async function loadAndTransform() {
    dataset = await d3.json("https://rasulkireev.com/api/v1/writings/")

    // Parse Python Datetime string to JS date object
    dateParser = d3.utcParse("%Y-%m-%dT%H:%M:%S%Z")
    formatMonth = d3.timeFormat("%B %Y")
    
    // Grouping data by month
    wordsByMonth = Array.from(
        d3.rollup(
            dataset, 
            v => d3.sum(v, d => d.word_count),  
            d => formatMonth(dateParser(d.date))
            )
        )
    
    return wordsByMonth;
}

async function drawLineChart() {

    const dataset = await loadAndTransform()
    
    
    const yAccessor = d => d[1]
    const dateParser = d3.timeParse("%B %Y")
    const xAccessor = d => dateParser(d[0])
    
    console.log(dataset);
    console.log(xAccessor(dataset[0]))
    console.log(yAccessor(dataset[0]))

      // 2. Create chart dimensions

  const width = 600

  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  // 4. Create scales

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  // 5. Draw data

  const monthsGroup = bounds.append("g")
  const monthGroups = monthsGroup.selectAll("g")
      .data(dataset)
      .enter().append("g")
  
  const barPadding = 1

  const barRects = monthGroups.append("rect")
      .attr("x", d => xScale(xAccessor(d)))
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", (width / 10))
      .attr("height", d => dimensions.boundedHeight
          - yScale(yAccessor(d)))
      .attr("fill", "cornflowerblue")


  // 6. Draw peripherals
  const barText =  monthGroups.filter(yAccessor)
    .append("text")
    .attr("x", d => xScale(xAccessor(d)) + 30)
    .attr("y", d => yScale(yAccessor(d)) - 5)
    .text(yAccessor)
    .style("text-anchor", "middle")
    .attr("fill", "darkgrey")
    .style("font-size", "14px")
    .style("font-family", "sans-serif")

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight}px)`)
  const xAxisLabel = xAxis.append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("# of Words")
}

drawLineChart()