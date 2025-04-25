<template>
  <div class="split-layout">
    <!-- left section: visual -->
    <div class="sticky-left">
      <h1>Visual</h1>
      <div>
        <h2>Colors and Fonts Chart</h2>
        <div id="stacked-bar-chart"></div>
      </div>
      <ImageCluster
        :jsonData="jsonData"
        :selectedColor="selectedColor"
        :selectedFont="selectedFont"
        :selectedNeighborhood="selectedNeighborhood"
      />
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
import ImageCluster from "./ImageCluster.vue";
// import scrollama from "scrollama";
import * as d3 from "d3";
export default {
  components: { ImageCluster },
  name: "VisualSection",
  props: {
    jsonData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      scroller: null,
      selectedColor: "red",
      selectedFont: "script",
      // selectedNeighborhood: "Greenpoint",
    };
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

      // Combine data for both categories
      const chartData = [
        { category: "Fonts", data: fontsData },
        { category: "Colors", data: colorsData },
      ];

      // Set up dimensions
      const width = 800;
      const height = 100; // Height for each stacked bar
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };

      // Create SVG container
      const svg = d3
        .select("#stacked-bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", chartData.length * height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create a scale for the total width
      const totalCounts = (data) => data.reduce((sum, d) => sum + d.value, 0);

      const x = d3.scaleLinear().range([0, width]);

      // Render each category as a stacked bar
      chartData.forEach((group, index) => {
        const groupTotal = totalCounts(group.data);
        x.domain([0, groupTotal]);

        // Add a group for each category
        const groupG = svg
          .append("g")
          .attr("transform", `translate(0, ${index * height})`);

        // Add a label for the category
        groupG
          .append("text")
          .attr("x", -margin.left)
          .attr("y", height / 2)
          .attr("dy", "0.35em")
          .style("text-anchor", "end")
          .text(group.category);

        // Add the stacked bar
        let cumulative = 0;
        group.data.forEach((d) => {
          groupG
            .append("rect")
            .attr("x", x(cumulative))
            .attr("y", 0)
            .attr("width", x(d.value))
            .attr("height", height - 10)
            .attr(
              "fill",
              group.category === "Colors"
                ? d.name?.toLowerCase()
                : d3.schemeCategory10[group.data.indexOf(d) % 10]
            ); // Use the color name for "Colors" or a color scheme for "Fonts"
          cumulative += d.value;
        });
      });
    },
  },
};
</script>

<style scoped>
template {
  min-height: 100vh;
}

#stacked-bar-chart {
  width: 100%;
  height: 100%;
}

text {
  font-size: 12px;
}
</style>
