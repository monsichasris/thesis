<template>
  <div class="split-layout">
    <div class="sticky-left">
      <h1>Neighborhood</h1>
      <div id="neighborhood-map" style="width: 100%; height: 600px">
        <svg ref="svg" style="width: 100%; height: 100%"></svg>
      </div>
    </div>
    <div class="scroll-right">
      <div class="highlight">
        <h2>Neighborhoods</h2>
        <p>
          The map visualizes the neighborhoods in which the stores are located.
          Each neighborhood is represented by a different color, making it easy
          to identify areas with a high concentration of stores.
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
        <h2>Brown</h2>
        <p>Where is the pink stores?</p>
      </div>
      <div class="highlight">
        <h2>Serif</h2>
        <p>Where are the neighborhoods with Serif fonts?</p>
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
</template>

<script>
import * as d3 from "d3";
import scrollama from "scrollama";

export default {
  name: "NeighborhoodSection",
  props: {
    geojsonData: {
      type: Object,
      required: true,
    },
    jsonData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      scroller: null, // Scrollama instance
      neighborhoodColors: {}, // Mapping of neighborhoods to colors
    };
  },
  watch: {
    geojsonData: {
      handler(newData) {
        if (newData) {
          this.renderGeoJSON();
        }
      },
      immediate: true, // Trigger the watcher immediately on mount
    },
  },
  mounted() {
    this.initializeScrollama();
  },
  methods: {
    initializeScrollama() {
      // Initialize Scrollama
      this.scroller = scrollama();
      this.scroller
        .setup({
          step: ".highlight", // Target the highlight sections
          offset: 0.8, // Trigger when the section is halfway in view
          debug: false,
        })
        .onStepEnter(({ element }) => {
          const activeValue = element
            .querySelector("h2")
            ?.textContent?.trim()
            .toLowerCase();
          console.log("Active value:", activeValue); // Debugging
          this.highlightNeighborhoods(activeValue);
        })
        .onStepExit(({ element, direction }) => {
          const title = element.querySelector("h2")?.textContent?.toLowerCase();
          if (title && this.activeWord === title.trim() && direction === "up") {
            this.activeWord = null;
          }
        });
    },
    renderGeoJSON() {
      if (!this.geojsonData || !this.geojsonData.features) {
        console.error("GeoJSON data is not available or invalid.");
        return;
      }
      if (!this.jsonData || !Array.isArray(this.jsonData)) {
        console.error("JSON data is not available or invalid.");
        return;
      }

      const svg = d3.select(this.$refs.svg);

      // Set up dimensions
      const width = svg.node().clientWidth;
      const height = svg.node().clientHeight;

      // Set up a projection (e.g., Mercator)
      const projection = d3
        .geoMercator()
        .fitSize([width, height], this.geojsonData);

      // Set up a path generator
      const path = d3.geoPath().projection(projection);

      // Render the GeoJSON shapes
      svg
        .selectAll("path")
        .data(this.geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr(
          "class",
          (d) =>
            `neighborhood-${d.properties.NTAName.replace(
              /\s+/g,
              "-"
            ).toLowerCase()}`
        );
    },
    highlightNeighborhoods(activeValue) {
      console.log("Highlighting:", activeValue); // Debugging

      // Check if the active value is a color or a font
      const matchingNeighborhoods = this.jsonData
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
          return isColor || isFont; // Match either color or font
        })
        .map((item) => item.neighborhood);

      console.log("Matching Neighborhoods:", matchingNeighborhoods); // Debugging

      // Update the fill color of the polygons
      d3.select(this.$refs.svg)
        .selectAll("path")
        .attr("fill", (d) => {
          const ntaName = d.properties.NTAName; // Get the NTAName from neighborhoods.json
          return matchingNeighborhoods.includes(ntaName)
            ? "blue" // Highlight matching neighborhoods with a specific color
            : "white"; // Reset others to white
        });
    },
    resetHighlighting() {
      d3.select(this.$refs.svg).selectAll("path").attr("fill", "white");
    },
  },
};
</script>

<style scoped>
#neighborhood-map {
  width: 100%;
  height: 600px;
}

svg {
  display: block;
}
</style>
