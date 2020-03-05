function WordCount(str) { 
    return str.split(" ").length;
}


async function drawLineChart() {
    const dataset = await d3.json("data.json")

    // Parse Python Datetime string to JS date object
    const dateParser = d3.utcParse("%Y-%m-%dT%H:%M:%S%Z")
    const formatMonth = d3.timeFormat("%B")
    
    // Grouping data by month
    const wordsByMonth = Array.from(d3.group(dataset, d => formatMonth(dateParser(d.date))))

    const yAccessor = d => WordCount(d.body)
    const xAccessor = d => formatMonth(dateParser(d.date))
    

    console.table(wordsByMonth[0])

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

    // 4. Create Scales
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, 0])

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0,dimensions.boundedWidth])

    // 5. Draw a Line
    const lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))
    
    const line = bounds.append("path")
        .attr("d", lineGenerator(dataset))
}

drawLineChart()