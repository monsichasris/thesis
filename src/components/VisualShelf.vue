<template>
  <div class="chart-container">
    <div :id="containerId" class="stacked-bar-chart"></div>

    <div class="chart-label">
      {{ type === "fonts" ? "Fonts" : "Colors" }}
    </div>

    <div class="chart-label-shadow">
      {{ type === "fonts" ? "Fonts" : "Colors" }}
    </div>

    <img class="shelf-image" src="img/shelf.svg" />
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "VisualShelf",
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
      default: () => window.innerWidth * 0.8,
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
      const container = d3.select(`#${this.containerId}`);
      if (container.empty()) {
        console.error("Container not found:", this.containerId);
        return;
      }
      container.selectAll("*").remove();

      // Create a tooltip element
      const tooltip = d3
        .select(`#${this.containerId}`)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "black")
        .style("color", "white")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.2)")
        .style("font-family", "Skew VF")
        .style("font-style", "normal")
        .style("font-weight", 700)
        .style("font-size", "24px")
        .style("z-index", 10)
        .style("pointer-events", "none")
        .style("opacity", 0);

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
        barWidth = Math.max(barWidth - 4, 1);

        let imagePath = null;
        if (this.type === "fonts") {
          imagePath = this.getFontImagePath(d.name); // Get the image path based on the font type
        }

        svg
          .append("rect")
          .attr("x", x(cumulative) + 2) // Add space between bars
          .attr("y", 0)
          .attr("width", barWidth) // Adjust width to account for spacing
          .attr("height", height - 4)
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
            if (this.type === "fonts" && imagePath) {
              tooltip.style("opacity", 1) // Show the tooltip
                .html(`
                  <img src="${imagePath}" alt="${d.name}" style="height: 24px;"/><br>${d.value}
                `); // Set tooltip content with the image
            } else if (this.type === "colors") {
              tooltip.style("opacity", 1) // Show the tooltip
                .html(`
                  <b>${d.name}</b>: ${d.value}
                `); // Set tooltip content without the image
            }
          })
          .on("mousemove", (event) => {
            const containerRect = container.node().getBoundingClientRect();
            tooltip
              .style("left", `${event.clientX - containerRect.left + 2}px`)
              .style("top", `${event.clientY - containerRect.top + 2}px`);
          })
          .on("mouseout", () => {
            tooltip.style("opacity", 0);
          });

        // Append an image for font types
        if (this.type === "fonts" && imagePath) {
          const remInPixels = parseFloat(
            getComputedStyle(document.documentElement).fontSize
          ); // Get 1rem in pixels
          if (barWidth >= remInPixels) {
            // Only append image if bar width is greater than or equal to 1rem
            svg
              .append("image")
              .attr("xlink:href", imagePath)
              .attr("x", x(cumulative) + 16)
              .attr("y", 8)
              .attr("height", 40);
          }
        }

        cumulative += d.value;
      });
    },

    getFontImagePath(fontType) {
      const fontImages = {
        "Sans-serif": "img/sans-serif.svg",
        Serif: "img/serif.svg",
        Script: "img/script.svg",
        Decorative: "img/decorative.svg",
      };

      return fontImages[fontType] || "img/default.svg"; // Fallback to a default image if the font type is not found
    },
  },
};
</script>

<style scoped>
.stacked-bar-chart {
  position: relative;
  width: 100%;
  z-index: 2;
}

.chart-label,
.chart-label-shadow {
  position: absolute;
  bottom: 0;
  text-align: center;
  font-family: "Skew VF";
  font-style: normal;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
}

.chart-label {
  z-index: 3;
  color: white;
}

.chart-label-shadow {
  z-index: 2;
  color: black;
  -webkit-text-stroke-width: 8px;
  -webkit-text-stroke-color: black;
  stroke-linejoin: round;
}

.chart-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.shelf-image {
  position: relative;
  width: 100%; /* Make the shelf image span the full width */
  margin-top: -4%; /* Adjust vertical positioning */
  z-index: 1; /* Place it behind other elements */
  min-height: 8px;
}

.tooltip {
  position: absolute;
  background-color: black;
  color: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  pointer-events: none;
  opacity: 0; /* Initially hidden */
  transition: opacity 0.2s ease-in-out;
  z-index: 10;
  font-family: "Skew VF";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
}
</style>
