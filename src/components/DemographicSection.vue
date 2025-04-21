<template>
  <div v-if="demographicData && demographicData.length" class="split-layout">
    <div class="sticky-left">
      <h1>Demographics</h1>
      <div id="stacked-demo-chart"></div>
    </div>
    <div class="scroll-right">
      <div class="highlight">
        <h2>Neighborhood Demographics</h2>
        <p>
          This chart visualizes the percentage of different racial populations
          in each neighborhood. Each bar represents a neighborhood, and the
          segments within the bar represent the racial composition.
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading demographic data...</p>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "DemographicSection",
  props: {
    demographicData: {
      type: Array,
      required: true,
    },
  },
  watch: {
    demographicData: {
      handler(newData) {
        console.log("Demographic Data in DemographicSection.vue:", newData);
        if (newData && newData.length) {
          this.$nextTick(() => {
            // Ensure the DOM is ready
            const container = d3.select("#stacked-demo-chart");
            if (container.node()) {
              this.renderChart();
            } else {
              console.error("Stacked demo chart container not found.");
            }
          });
        }
      },
      immediate: true, // Trigger the watcher immediately if data is already available
    },
  },
  methods: {
    renderChart() {
      if (!this.demographicData || !this.demographicData.length) {
        console.error("Demographic data is not available or invalid.");
        return;
      }

      const container = d3.select("#stacked-demo-chart");
      if (!container.node()) {
        console.error("Stacked demo chart container not found.");
        return;
      }

      const data = this.demographicData.map((d) => ({
        NTAName: d.NTAName,
        Hispanic: +d.Hsp_P,
        White: +d.Wt_P,
        Black: +d.Bl_P,
        Asian: +d.Asn_P,
        Multiracial: +d.Rc2pl_P,
        Other: +d.Oths_P,
      }));

      // Set up dimensions
      const margin = { top: 20, right: 30, bottom: 50, left: 150 };
      const width = 1000 - margin.left - margin.right;
      const height = 800 - margin.top - margin.bottom;

      // Create SVG container
      const svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define the subgroups (races)
      const subgroups = [
        "Hispanic",
        "White",
        "Black",
        "Asian",
        "Multiracial",
        "Other",
      ];

      // Define the neighborhoods (x-axis categories)
      const neighborhoods = data.map((d) => d.NTAName);

      // Define the color scale
      const color = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range([
          "#fdae61",
          "#abd9e9",
          "#66bd63",
          "#d73027",
          "#fee08b",
          "#d9d9d9",
        ]);

      // Stack the data
      const stackedData = d3.stack().keys(subgroups)(data);

      // Define the x-scale (percentage)
      const x = d3.scaleLinear().domain([0, 100]).range([0, width]);

      // Define the y-scale (neighborhoods)
      const y = d3
        .scaleBand()
        .domain(neighborhoods)
        .range([0, height])
        .padding(0.1);

      // Add the x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(5)
            .tickFormat((d) => `${d}%`)
        )
        .selectAll("text")
        .style("text-anchor", "middle");

      // Add the y-axis
      svg
        .append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("text-anchor", "end");

      // Create groups for each bar segment
      const barGroups = svg
        .append("g") // Create a dedicated group for the bars
        .selectAll(".bar-group")
        .data(stackedData)
        .join("g")
        .attr("class", "bar-group")
        .attr("fill", (d) => color(d.key));

      // Draw the bars
      barGroups
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("y", (d) => y(d.data.NTAName))
        .attr("x", (d) => x(d[0]))
        .attr("width", (d) => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth());
    },
  },
};
</script>

<style scoped>
#stacked-demo-chart {
  width: 100%;
  height: 800px;
}
</style>
