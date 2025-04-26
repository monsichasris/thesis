<!-- filepath: /Users/monsichasris/Documents/MS/msdv/thesis/src/components/StackedBarChart.vue -->
<template>
  <div :id="containerId" class="stacked-bar-chart"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "VisualChart",
  props: {
    containerId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    jsonData: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.createStackedBarChart();
  },
  methods: {
    createStackedBarChart() {
      console.log(
        `Creating chart for ${this.type} in container ${this.containerId}`
      );

      // Clear any existing chart
      d3.select(`#${this.containerId}`).selectAll("*").remove();

      // Aggregate data for the specified type
      const aggregatedData = this.jsonData.reduce((acc, item) => {
        if (item[this.type]) {
          item[this.type].forEach((value) => {
            acc[value] = (acc[value] || 0) + 1;
          });
        }
        return acc;
      }, {});

      const chartData = Object.entries(aggregatedData).map(([key, value]) => ({
        name: key,
        value,
      }));
      console.log("Chart data:", chartData);

      const width = 800;
      const height = 50;
      const margin = { top: 10, right: 10, bottom: 10, left: 50 };

      const svg = d3
        .select(`#${this.containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleLinear()
        .domain([0, d3.sum(chartData, (d) => d.value)])
        .range([0, width]);

      // Render the stacked bar
      let cumulative = 0;
      chartData.forEach((d) => {
        const barWidth = x(d.value);

        // Append the rectangle (bar)
        svg
          .append("rect")
          .attr("x", x(cumulative))
          .attr("y", 0)
          .attr("width", barWidth)
          .attr("height", height - 10)
          .attr(
            "fill",
            this.type === "colors" ? d.name?.toLowerCase() : "white" // Use color name for "colors" type, otherwise use gray
          )
          .attr("stroke", this.type !== "colors" ? "#000" : "none") // Add border if not "colors"
          .attr("stroke-width", this.type !== "colors" ? 1 : 0);

        // Append the text (name/key) if the type is not "colors"
        if (this.type !== "colors") {
          svg
            .append("text")
            .attr("x", x(cumulative) + barWidth / 2) // Center the text in the bar
            .attr("y", (height - 10) / 2) // Vertically center the text
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d.name)
            .style("fill", "black")
            .style("font-size", "12px")
            .style("pointer-events", "none"); // Prevent text from interfering with mouse events
        }

        cumulative += d.value;
      });
    },
  },
};
</script>

<style scoped>
.stacked-bar-chart {
  width: 100%;
}
</style>
