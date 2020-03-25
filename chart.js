async function loadAndTransform() {
    dataset = await d3.json("https://rasulkireev.com/api/v1/writings/")
    console.log(dataset)

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
    const xAccessor = d => d[0]
    
    console.log(dataset);
    console.log(xAccessor)
    console.log(yAccessor(dataset[0]))

      // 2. Create chart dimensions

  const width = 700

  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 60,
      right: 10,
      bottom: 70,
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

  const xScale = d3.scaleBand()
    .domain(dataset.map(d => xAccessor(d)))
    .range([0, dimensions.boundedWidth])
    .padding(0.2)

  // 5. Draw data

  const monthsGroup = bounds.append("g")
  const monthGroups = monthsGroup.selectAll("g")
      .data(dataset)
      .enter().append("g")
  
  const barPadding = 1

  const barRects = monthGroups.append("rect")
      .attr("x", d => xScale(xAccessor(d)))
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", xScale.bandwidth())
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr("fill", "cornflowerblue")


  // 6. Draw peripherals
  const chartTitle = bounds.append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", -15)
    .style("text-anchor", "middle")
    .text("# of Published Words")
    .style("font-size", "20px")
    .style("font-family", "sans-serif")
  
  
  const barText =  monthGroups.filter(yAccessor)
    .append("text")
    .attr("x", d => xScale(xAccessor(d)) + 30)
    .attr("y", d => yScale(yAccessor(d)) - 5)
    .text(yAccessor)
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .style("font-size", "14px")
    .style("font-family", "sans-serif")

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform",`translate(0, ${dimensions.boundedHeight}px)`)
    .selectAll("text")
      .style("font-size", "14px")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {return "rotate(-25)"})
  
}

drawLineChart()