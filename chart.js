async function drawLineChart() {
    const dataset = await d3.json("data.json")
    console.table(dataset[0])
}
drawLineChart()