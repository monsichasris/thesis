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

      // Create a tooltip element
      const tooltip = d3
        .select(`#${this.containerId}`)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.2)")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0); // Initially hidden

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
      const height = 80;
      const svg = d3
        .select(`#${this.containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const x = d3
        .scaleLinear()
        .domain([0, d3.sum(chartData, (d) => d.value)])
        .range([0, width]);

      // Render the stacked bar
      let cumulative = 0;
      chartData.forEach((d) => {
        let barWidth = x(d.value);
        // Ensure the bar width is not negative
        barWidth = Math.max(barWidth - 4, 0);

        svg
          .append("rect")
          .attr("x", x(cumulative) + 2) // Add space between bars
          .attr("y", 0)
          .attr("width", barWidth - 4) // Adjust width to account for spacing
          .attr("height", height)
          .attr("rx", 4)
          .attr("ry", 4)
          .attr(
            "fill",
            this.type === "colors"
              ? d.name?.toLowerCase()
              : d.name?.toLowerCase() === this.activeTitle
              ? "yellow" // Highlight matching bar
              : "white" // Default color for non-matching bars
          )
          .attr(
            "stroke",
            d.name?.toLowerCase() === this.activeTitle?.toLowerCase()
              ? "#000"
              : "#ccc"
          )
          .attr(
            "stroke-width",
            d.name?.toLowerCase() === this.activeTitle?.toLowerCase() ? 2 : 1
          )
          .on("mouseover", () => {
            tooltip
              .style("opacity", 1) // Show the tooltip
              .html(`<strong>${d.name}</strong>: ${d.value}`); // Set tooltip content
          })
          .on("mousemove", (event) => {
            const container = document.querySelector(`#${this.containerId}`);
            const containerRect = container.getBoundingClientRect();
            tooltip
              .style("left", `${event.clientX - containerRect.left + 2}px`)
              .style("top", `${event.clientY - containerRect.top + 2}px`);
          })
          .on("mouseout", () => {
            tooltip.style("opacity", 0); // Hide the tooltip
          });

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

.tooltip {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  pointer-events: none;
  opacity: 0; /* Initially hidden */
  transition: opacity 0.2s ease-in-out;
  z-index: 10;
}
</style>
