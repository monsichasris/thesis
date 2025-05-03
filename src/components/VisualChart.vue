<template>
  <div :id="containerId" class="stacked-bar-chart"></div>
  <img src="img/shelf.svg" width="100%" style="margin-top: -4%; z-index: -1" />
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
    activeTitle: {
      type: String,
      required: false, // Make it optional
      default: null,
    },
    width: {
      type: Number,
      default: 800,
    },
  },
  watch: {
    jsonData: {
      handler(newData) {
        this.createStackedBarChart(newData);
      },
      immediate: true,
    },
    activeTitle: {
      immediate: true,
      handler() {
        this.createStackedBarChart();
      },
    },
  },
  mounted() {
    this.createStackedBarChart();
  },

  methods: {
    createStackedBarChart() {
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

      const chartData = Object.entries(aggregatedData)
        .map(([key, value]) => ({
          name: key,
          value,
        }))
        .sort((a, b) => b.value - a.value);

      const width = this.width;
      const height = 50;
      const margin = { top: 10, right: 10, bottom: 10, left: 0 };

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

        svg
          .append("rect")
          .attr("x", x(cumulative))
          .attr("y", 0)
          .attr("width", barWidth)
          .attr("height", height - 10)
          .attr(
            "fill",
            this.type === "colors"
              ? d.name?.toLowerCase()
              : d.name?.toLowerCase() === this.activeTitle
              ? "yellow" // Highlight matching bar
              : "white" // Default color for non-matching bars
          )
          .style("z-index", 100) // Set z-index for the SVG element
          .attr(
            "stroke",
            d.name?.toLowerCase() === this.activeTitle?.toLowerCase()
              ? "#000"
              : "#ccc"
          )
          .attr(
            "stroke-width",
            d.name?.toLowerCase() === this.activeTitle?.toLowerCase() ? 2 : 1
          );

        // Append the text (name/key) if the type is not "colors"
        if (this.type !== "colors") {
          svg
            .append("text")
            .attr("x", x(cumulative) + barWidth / 2)
            .attr("y", (height - 10) / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d.name)
            .style(
              "fill",
              d.name?.toLowerCase() === this.activeTitle?.toLowerCase()
                ? "red"
                : "black"
            )
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
  position: relative;
  width: 100%;
  z-index: 100;
}
</style>
