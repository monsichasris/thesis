<template>
  <p class="textbox">
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore beatae
    obcaecati recusandae sapiente sunt dolorum, illum praesentium quisquam
    voluptas nihil voluptate officia aut nobis veniam libero dolorem rerum? Ab,
    animi.
  </p>
  <div class="map-section">
    <div id="map-controller">
      <h3>Filter by Fonts</h3>
      <div class="filter-buttons">
        <button
          v-for="font in fonts"
          :key="font"
          @click="highlightByFont(font)"
          :class="{ selected: selectedFilter === font }"
        >
          {{ font }}
        </button>
      </div>

      <h3>Filter by Colors</h3>
      <div class="filter-buttons">
        <button
          v-for="color in colors"
          :key="color"
          @click="highlightByColor(color)"
          :class="{ selected: selectedFilter === color }"
        >
          {{ color }}
        </button>
      </div>
    </div>

    <div id="neighborhood-map">
      <svg ref="svg" style="width: 100%; height: 100%"></svg>
    </div>

    <!-- Sidebar Component -->
    <MapSidebar
      ref="mapSidebar"
      v-show="sidebarVisible"
      :isVisible="sidebarVisible"
      :title="sidebarTitle"
      :content="sidebarContent"
      :filteredData="filteredNeighborhoodData"
      :demographicData="filteredDemographicData"
      :geojsonData="geojsonData"
      @close="closeSidebar"
    />
  </div>
</template>

<script>
import * as d3 from "d3";
import MapSidebar from "./MapSidebar.vue";

export default {
  name: "MapSection",
  components: {
    MapSidebar,
  },
  props: {
    geojsonData: {
      type: Object,
      required: true,
    },
    jsonData: {
      type: Array,
      required: true,
    },
    demographicData: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      fonts: ["Script", "Decorative", "Serif", "Sans-serif"],
      colors: [
        "Red",
        "Blue",
        "Green",
        "Yellow",
        "Pink",
        "Purple",
        "Brown",
        "White",
        "Black",
      ],
      sidebarVisible: false,
      sidebarTitle: "",
      sidebarContent: "",
      filteredNeighborhoodData: [],
      filteredDemographicData: null,
      selectedNTA: null,
      selectedFilter: null,
    };
  },
  mounted() {
    console.log("isVisible prop in MapSidebar (on mount):", this.isVisible);
  },
  watch: {
    geojsonData: {
      handler(newData) {
        if (newData) {
          this.renderGeoJSON();
        }
      },
      immediate: true,
    },
    filteredGeoJSON: {
      handler() {
        this.renderGeoJSON();
      },
    },
    isVisible(newVal) {
      console.log("isVisible changed:", newVal);
      if (newVal) {
        this.initializeMap();
      }
    },
  },

  methods: {
    renderGeoJSON() {
      if (!this.geojsonData || !this.geojsonData.features) {
        console.error("GeoJSON data is not available or invalid.");
        return;
      }
      const svg = d3.select(this.$refs.svg);
      svg.selectAll("*").remove();

      const width = svg.node().getBoundingClientRect().width;
      const height = svg.node().getBoundingClientRect().height;

      // Define the projection and path generator
      const projection = d3
        .geoMercator()
        .fitSize([width, height], this.geojsonData);
      const path = d3.geoPath().projection(projection);

      // Render the GeoJSON features
      svg
        .selectAll("path")
        .data(this.geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#ccc")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5) // Default stroke width
        .attr("data-nta", (d) => d.properties.NTA2020)
        .attr("cursor", "pointer")
        .on("mouseover", (event) => {
          d3.select(event.currentTarget).attr("stroke-width", 2);
        })
        .on("mouseout", (event) => {
          if (
            d3.select(event.currentTarget).attr("data-nta") !== this.selectedNTA
          ) {
            d3.select(event.currentTarget).attr("stroke-width", 0.5);
          }
        })
        .on("click", (event, d) => {
          this.showSidebar(
            d.properties.NTA2020,
            d.properties.neighborhood,
            "Additional information about this neighborhood."
          );
        });
    },
    renderFilteredCircles(filteredData) {
      const svg = d3.select(this.$refs.svg);
      const projection = d3
        .geoMercator()
        .fitSize(
          [
            svg.node().getBoundingClientRect().width,
            svg.node().getBoundingClientRect().height,
          ],
          this.geojsonData
        );

      // Remove existing circles
      svg.selectAll("circle").remove();

      // Add filtered circles
      svg
        .selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([d.lon, d.lat])[0])
        .attr("cy", (d) => projection([d.lon, d.lat])[1])
        .attr("r", 2)
        .attr("fill", "black");
    },
    showSidebar(nta2020, neighborhood, additionalInfo) {
      const svg = d3.select(this.$refs.svg);

      // Reset the stroke-width of the previously selected polygon
      svg
        .selectAll("path")
        .filter((d) => d.properties.NTA2020 === this.selectedNTA)
        .attr("stroke-width", 0.5);

      // Highlight the newly selected polygon
      svg
        .selectAll("path")
        .filter((d) => d.properties.NTA2020 === nta2020)
        .attr("stroke-width", 2);

      // Update the selected neighborhood
      this.selectedNTA = nta2020;

      // Find the neighborhood name from jsonData
      const neighborhoodData = this.jsonData.find(
        (item) => item.NTA2020 === nta2020
      );

      const neighborhoodName = neighborhoodData
        ? neighborhoodData.neighborhood
        : "Unknown Neighborhood";

      const boroughName = neighborhoodData
        ? neighborhoodData.borough
        : "Unknown Borough";

      // Filter data for the selected neighborhood
      this.filteredNeighborhoodData = this.jsonData.filter(
        (item) => item.NTA2020 === nta2020
      );

      // Filter demographic data for the selected neighborhood
      this.filteredDemographicData = this.demographicData
        ? this.demographicData.find((item) => item.GeoID === nta2020)
        : null;

      // Set the sidebar content
      this.sidebarTitle = `${neighborhoodName}`;
      this.sidebarContent = `${boroughName} <br> ${additionalInfo}`;
      this.sidebarVisible = true;
      this.$refs.mapSidebar.zoomToNeighborhood();
    },
    closeSidebar() {
      this.sidebarVisible = false;
      this.selectedNTA = null; // Reset the selected neighborhood
      this.renderGeoJSON();

      console.log("sidebarVisible:", this.sidebarVisible);
    },
    highlightByFont(font) {
      if (!this.jsonData || !this.geojsonData) return;
      this.selectedFilter = font;
      // const matchingNTA = this.jsonData
      //   .filter((item) => {
      //     return item.fonts && item.fonts.includes(font);
      //   })
      //   .map((item) => item.NTA2020);

      // this.highlightPolygons(matchingNTA, "#fdae61");

      // Filter data by font
      const filteredData = this.jsonData.filter(
        (item) => item.fonts && item.fonts.includes(font)
      );

      // Render filtered circles
      this.renderFilteredCircles(filteredData);
    },
    highlightByColor(color) {
      if (!this.jsonData || !this.geojsonData) return;
      this.selectedFilter = color;

      const matchingNTA = this.jsonData
        .filter((item) => {
          return item.colors && item.colors.includes(color);
        })
        .map((item) => item.NTA2020);

      this.highlightPolygons(matchingNTA, color);

      // Filter data by color
      const filteredData = this.jsonData.filter(
        (item) => item.colors && item.colors.includes(color)
      );

      // Render filtered circles
      this.renderFilteredCircles(filteredData);
    },
    highlightPolygons(matchingNTA, highlightColor) {
      const svg = d3.select(this.$refs.svg);
      const normalizedMatchingNTA = matchingNTA.map((nta) => nta.toLowerCase());

      // Reset all polygons to default color
      svg.selectAll("path").attr("fill", "#ccc");

      // Highlight matching polygons
      svg
        .selectAll("path")
        .filter((d) => {
          const nta2020 = d.properties.NTA2020?.toLowerCase();
          return normalizedMatchingNTA.includes(nta2020);
        })
        .attr("fill", highlightColor);
    },
  },
};
</script>

<style scoped>
.map-section {
  position: relative; /* Set the parent container to relative */
  width: 100%; /* Ensure it spans the full width */
  height: 100%; /* Ensure it spans the full height */
}

#map-controller {
  position: absolute; /* Make it absolute */
  width: 240px;
  top: 20px; /* Adjust the vertical position */
  left: 20px; /* Adjust the horizontal position */
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Add a semi-transparent background */
  border: 1px solid #ccc; /* Add a border */
  border-radius: 10px; /* Add rounded corners */
  padding: 15px; /* Add padding inside the box */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
  z-index: 1000; /* Ensure it appears above other elements */
}

.mapbox-sidebar {
  width: 100%;
  height: 300px; /* Adjust height as needed */
  margin-bottom: 20px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin-bottom: 10px;
}

button {
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
  padding: 10px;
}

button:hover {
  background-color: #e0e0e0;
}

button:active {
  background-color: #d0d0d0;
}

button.selected {
  background-color: #f0f0f0;
  color: black;
  border: 2px solid #000;
  font-weight: bold;
}

#neighborhood-map {
  width: 100%;
  height: 800px;
}

svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
