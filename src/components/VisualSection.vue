<template>
  <div class="split-layout">
    <!-- left section: visual -->
    <div class="sticky-left">
      <h1>Visual</h1>
      <div>
        <h2>Colors and Fonts Chart</h2>
        <div id="stacked-bar-chart"></div>
      </div>
    </div>

    <!-- right section: text -->
    <div class="scroll-right">
      <div class="highlight">
        <h2>Typography</h2>
      </div>
      <div class="highlight">
        <h2>Colors</h2>
      </div>
      <div class="highlight">
        <h2>Complimentary</h2>
      </div>
    </div>
  </div>
</template>

<script>
// import scrollama from "scrollama";
import * as d3 from "d3";
export default {
  name: "VisualSection",
  props: {
    jsonData: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    if (this.jsonData && this.jsonData.length > 0) {
      this.createStackedBarChart();
    }
  },
  watch: {
    jsonData: {
      handler(newData) {
        if (newData && newData.length > 0) {
          this.createStackedBarChart();
        }
      },
      immediate: true, // Trigger the watcher immediately on mount
    },
  },
  methods: {
    createStackedBarChart() {
      // Clear any existing chart
      d3.select("#stacked-bar-chart").selectAll("*").remove();

      // Aggregate data for colors and fonts
      const aggregatedData = this.jsonData.reduce(
        (acc, item) => {
          if (item.colors) {
            item.colors.forEach((color) => {
              acc.colors[color] = (acc.colors[color] || 0) + 1;
            });
          }
          if (item.fonts) {
            item.fonts.forEach((font) => {
              acc.fonts[font] = (acc.fonts[font] || 0) + 1;
            });
          }
          return acc;
        },
        { colors: {}, fonts: {} }
      );

      const colorsData = Object.entries(aggregatedData.colors).map(
        ([key, value]) => ({ category: "Colors", name: key, value })
      );
      const fontsData = Object.entries(aggregatedData.fonts).map(
        ([key, value]) => ({ category: "Fonts", name: key, value })
      );

      const chartData = [...colorsData, ...fontsData];

      // Set up dimensions
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create SVG container
      const svg = d3
        .select("#stacked-bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create scales
      const x = d3
        .scaleBand()
        .domain(chartData.map((d) => d.name))
        .range([0, width])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(chartData, (d) => d.value)])
        .nice()
        .range([height, 0]);

      const colorScale = d3
        .scaleOrdinal()
        .domain(["Colors", "Fonts"])
        .range(["#69b3a2", "#404080"]);

      // Add axes
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.append("g").call(d3.axisLeft(y));

      // Add bars
      svg
        .selectAll(".bar")
        .data(chartData)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .attr("fill", (d) => colorScale(d.category));

      // Add legend
      const legend = svg
        .selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      legend
        .append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", colorScale);

      legend
        .append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("text-anchor", "end")
        .text((d) => d);
    },
  },
};
</script>

<style scoped>
#stacked-bar-chart {
  width: 100%;
  height: 100%;
}

text {
  font-size: 12px;
}
</style>
