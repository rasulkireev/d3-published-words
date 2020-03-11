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

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
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

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  // 5. Draw data

  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  const line = bounds.append("path")
      .attr("d", lineGenerator(dataset))
      .attr("fill", "none")
      .attr("stroke", "#af9358")
      .attr("stroke-width", 2)

  // 6. Draw peripherals

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${
        dimensions.boundedHeight
      }px)`)

}

drawLineChart()