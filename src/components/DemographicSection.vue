<template>
  <div v-if="demographicData && demographicData.length" class="split-layout">
    <div class="sticky-left">
      <h1>Demographics</h1>
      <div id="color-legend"></div>
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
      <div class="highlight">
        <h2>Pink</h2>
        <p>Where is the pink stores?</p>
      </div>
      <div class="highlight">
        <h2>Purple</h2>
        <p>Where is the pink stores?</p>
      </div>
      <div class="highlight">
        <h2>Script</h2>
        <p>Where are these type locate?</p>
      </div>
      <div class="highlight">
        <h2>Decorative</h2>
        <p>Where are these type locate?</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading demographic data...</p>
  </div>
</template>

<script>
import * as d3 from "d3";
import scrollama from "scrollama";

export default {
  name: "DemographicSection",
  props: {
    demographicData: {
      type: Array,
      required: true,
    },
    jsonData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      scroller: null,
    };
  },
  watch: {
    demographicData: {
      handler(newData) {
        if (newData && newData.length) {
          this.$nextTick(() => {
            // Ensure the DOM is ready
            const container = d3.select("#stacked-demo-chart");
            if (container.node()) {
              this.renderChart();
              this.initializeScrollama();
            } else {
              console.error("Stacked demo chart container not found.");
            }
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    renderChart() {
      if (!this.demographicData || !this.demographicData.length) {
        console.error("Demographic data is not available or invalid.");
        return;
      }

      const container = d3.select("#stacked-demo-chart");
      container.selectAll("*").remove(); // Clear the container

      const data = this.demographicData.map((d) => ({
        GeoID: d.GeoID,
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
        .attr("class", (d) => `bar-${d.data.GeoID}`)
        .attr("y", (d) => y(d.data.NTAName))
        .attr("x", (d) => x(d[0]))
        .attr("width", (d) => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth());

      // Create the legend container
      const legendContainer = d3.select("#color-legend");
      legendContainer.selectAll("*").remove();

      const legend = legendContainer
        .append("svg")
        .attr("width", subgroups.length * 100)
        .attr("height", 30);

      // Add legend items
      legend
        .selectAll("g")
        .data(subgroups)
        .join("g")
        .attr("transform", (d, i) => `translate(${i * 100}, 0)`)
        .each(function (d) {
          const g = d3.select(this);
          g.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(d));

          g.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text(d)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");
        });
    },
    initializeScrollama() {
      this.scroller = scrollama();
      this.scroller
        .setup({
          step: ".highlight", // Target the highlight sections
          offset: 0.8, // Trigger when the section is 80% in view
          debug: false,
        })
        .onStepEnter(({ element }) => {
          const activeValue = element
            .querySelector("h2")
            ?.textContent?.trim()
            .toLowerCase();
          console.log("Active value:", activeValue); // Debugging
          this.highlightBar(activeValue);
        })
        .onStepExit(({ element, direction }) => {
          const title = element.querySelector("h2")?.textContent?.toLowerCase();
          if (title && this.activeWord === title.trim() && direction === "up") {
            this.activeWord = null;
          }
        });
    },
    highlightBar(activeValue) {
      console.log("Highlighting bars for:", activeValue); // Debugging
      const matchingGeoIDs = this.jsonData
        .filter((item) => {
          const isColor =
            Array.isArray(item.colors) &&
            item.colors.some(
              (c) => c.toLowerCase() === activeValue.toLowerCase()
            );
          const isFont =
            Array.isArray(item.fonts) &&
            item.fonts.some(
              (f) => f.toLowerCase() === activeValue.toLowerCase()
            );
          return isColor || isFont;
        })
        .map((item) => item.NTA2020);

      d3.select("#stacked-demo-chart").selectAll("rect").attr("opacity", 0.3); // Dim all bars

      // Highlight matching bars
      matchingGeoIDs.forEach((geoID) => {
        d3.select("#stacked-demo-chart")
          .selectAll(`.bar-${geoID}`)
          .attr("opacity", 1);
      });
    },
    resetHighlighting() {
      d3.select("#stacked-demo-chart").selectAll("rect").attr("opacity", 1); // Reset all bars to full opacity
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
