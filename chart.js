async function loadAndTransform() {
    dataset = await d3.json("https://rasulkireev.com/api/v1/writings/")

    // Parse Python Datetime string to JS date object
    dateParser = d3.utcParse("%Y-%m-%dT%H:%M:%S%Z")
    formatMonth = d3.timeFormat("%B")
    
    // Grouping data by month
    wordsByMonthArrayOfArrays = Array.from(
        d3.rollup(
            dataset, 
            v => d3.sum(v, d => d.word_count),  
            d => formatMonth(dateParser(d.date))
            )
        )
    
    wordsByMonthArrayOfArrays.forEach(element => Object.assign({}, element))

    return wordsByMonthArrayOfArrays;
}

async function drawLineChart() {

    const dataset = await loadAndTransform()

    // console.log(dataset);

    const yAccessor = d => d[1]
    const xAccessor = d => d[0]

    // console.log(xAccessor(dataset[0]))
    // console.log(yAccessor(dataset[0]))

}

drawLineChart()