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
      v-if="sidebarVisible"
      :isVisible="sidebarVisible"
      :title="sidebarTitle"
      :content="sidebarContent"
      :filteredData="filteredNeighborhoodData"
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
    };
  },
  mounted() {
    if (this.geojsonData && this.geojsonData.features) {
      this.renderGeoJSON();
    } else {
      console.error("GeoJSON data is not available or invalid.");
    }
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
  },

  methods: {
    renderGeoJSON() {
      if (!this.geojsonData || !this.geojsonData.features) {
        console.error("GeoJSON data is not available or invalid.");
        return;
      }
      const svg = d3.select(this.$refs.svg);
      if (!svg.node()) {
        console.error("SVG element is not available.");
        return;
      }
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
        .attr("fill", "#ccc") // Default fill color
        .attr("stroke", "#333") // Border color
        .attr("stroke-width", 0.5)
        .attr("cursor", "pointer")
        .on("mouseover", function () {
          d3.select(this).attr("stroke-width", 2);
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", 0.5);
        })
        .on("click", (event, d) => {
          this.showSidebar(
            d.properties.NTA2020,
            d.properties.neighborhood,
            "Additional information about this neighborhood."
          );
        });
    },
    showSidebar(nta2020, neighborhood, additionalInfo) {
      // Find the neighborhood name from jsonData
      const neighborhoodData = this.jsonData.find(
        (item) => item.NTA2020 === nta2020
      );

      const neighborhoodName = neighborhoodData
        ? neighborhoodData.neighborhood // Replace 'name' with the actual key for the neighborhood name in your JSON
        : "Unknown Neighborhood";

      const boroughName = neighborhoodData
        ? neighborhoodData.borough // Replace 'borough' with the actual key for the borough name in your JSON
        : "Unknown Borough";

      // Filter data for the selected neighborhood
      this.filteredNeighborhoodData = this.jsonData.filter(
        (item) => item.NTA2020 === nta2020
      );

      // Set the sidebar content
      this.sidebarTitle = `${neighborhoodName}`;
      this.sidebarContent = `${boroughName} <br> ${additionalInfo}`;
      this.sidebarVisible = true;
    },
    closeSidebar() {
      this.sidebarVisible = false;
    },
    highlightByFont(font) {
      if (!this.jsonData || !this.geojsonData) return;
      const matchingNTA = this.jsonData
        .filter((item) => {
          return item.fonts && item.fonts.includes(font);
        })
        .map((item) => item.NTA2020);

      this.highlightPolygons(matchingNTA, "#fdae61");
    },
    highlightByColor(color) {
      if (!this.jsonData || !this.geojsonData) return;
      const matchingNTA = this.jsonData
        .filter((item) => {
          return item.colors && item.colors.includes(color);
        })
        .map((item) => item.NTA2020);

      this.highlightPolygons(matchingNTA, color);
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

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin-bottom: 10px;
}

button {
  background-color: #f0f0f0;
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

#neighborhood-map {
  width: 100%;
  height: 600px;
}

svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
