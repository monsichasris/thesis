<template>
  <div class="break-section">
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div class="textbox">
        Now, all elements come together. Time to explore the signery through the
        map!
      </div>
      <div class="lottie-container" ref="lottieContainer"></div>
    </div>
    <img
      style="
        position: absolute;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
      src="https://qbssawkoheaimaffnrbd.supabase.co/storage/v1/object/public/png-images//break.png"
    />
  </div>
  <div class="map-section">
    <div id="map-controller">
      <div id="map-controller-title">
        <h2>Neighborhood Map</h2>
      </div>
      <span>☞ Click on the neighborhoods to view the details</span>

      <div class="map-filter">
        <div class="chart-label">Fonts</div>
        <div class="chart-label-shadow">Fonts</div>
        <div class="filter-buttons">
          <button
            style="width: 120px"
            v-for="font in fonts"
            :key="font"
            @click="highlightByFont(font)"
            :class="{ selected: selectedFont === font }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              max-width="20"
              style="vertical-align: middle; margin-right: 8px"
            >
              <path
                :d="getShapeForFont(font)"
                fill="white"
                stroke="black"
                stroke-width="1"
              />
            </svg>
            <span style="width: 100%">{{ font }}</span>
          </button>
        </div>
        <img src="img/shelf.svg" width="100%" style="margin-top: -2%" />
      </div>

      <div class="map-filter">
        <div class="chart-label">Colors</div>
        <div class="chart-label-shadow">Colors</div>
        <div class="filter-buttons">
          <button
            style="width: 88px"
            v-for="color in colors"
            :key="color"
            @click="highlightByColor(color)"
            :class="{ selected: selectedColor === color }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="20"
              height="20"
              style="vertical-align: middle; margin-right: 8px"
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                :fill="getColorForName(color)"
                stroke="black"
                stroke-width="1"
              />
            </svg>
            <span style="width: 100%">{{ color }}</span>
          </button>
        </div>
        <img src="img/shelf.svg" width="100%" style="margin-top: -2%" />
      </div>

      <div class="map-filter">
        <div class="chart-label">Demographic</div>
        <div class="chart-label-shadow">Demographic</div>

        <!-- Dropdown for Medium Household Income -->
        <div class="filter-group">
          <label for="income-filter">Income:</label>
          <select
            id="income-filter"
            v-model="selectedIncome"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="100k_or_more">100k or More</option>
            <option value="60k_to_99k">60k to 99k</option>
            <option value="30k_to_59k">30k to 59k</option>
            <option value="under_30k">Under 30k</option>
          </select>
        </div>

        <!-- Dropdown for Race -->
        <div class="filter-group">
          <label for="race-filter">Race:</label>
          <select
            id="race-filter"
            v-model="selectedRace"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="Hsp_P">Hispanic</option>
            <option value="Wt_P">White</option>
            <option value="Bl_P">Black</option>
            <option value="Asn_P">Asian</option>
          </select>
        </div>

        <!-- Dropdown for Generation -->
        <div class="filter-group">
          <label for="generation-filter">Generation:</label>
          <select
            id="generation-filter"
            v-model="selectedGeneration"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="PopZ">Gen Z</option>
            <option value="PopY">Gen Y</option>
            <option value="PopX">Gen X</option>
            <option value="PopBB">Baby Boomers</option>
          </select>
        </div>
        <img src="img/shelf.svg" width="100%" style="margin-top: -2%" />
      </div>

      <button
        @click="resetFilters"
        style="
          background-color: transparent;
          width: fit-content;
          text-align: center;
          border: solid 1px #000;
        "
      >
        Reset Filters
      </button>
    </div>

    <div ref="tooltip" class="tooltip" style="display: none"></div>

    <div class="map-container">
      <div id="neighborhood-map" :class="{ 'with-sidebar': sidebarVisible }">
        <svg ref="svg" style="width: 800px; height: 800px"></svg>
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
  </div>
</template>

<script>
import * as d3 from "d3";
import MapSidebar from "./MapSidebar.vue";
// import lottie from "lottie-web";
/* global lottie */
export default {
  name: "MapSection",
  components: {
    MapSidebar,
  },
  inject: ["colorMapping"],
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
      fonts: ["Sans-serif", "Serif", "Script", "Decorative"],
      colors: [
        "Red",
        "Orange",
        "Yellow",
        "Pink",
        "Purple",
        "Green",
        "Blue",
        "Brown",
        "Gray",
        "Black",
        "White",
      ],
      sidebarVisible: false,
      sidebarTitle: "",
      sidebarContent: "",
      filteredNeighborhoodData: [],
      filteredDemographicData: null,
      selectedNTA: null,
      selectedFilter: null,
      selectedFont: null,
      selectedColor: null,
      selectedIncome: "",
      selectedRace: "",
      selectedGeneration: "",
    };
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
    sidebarVisible(newVal) {
      console.log("Sidebar visibility changed:", newVal);
      this.$nextTick(() => {
        this.renderGeoJSON(); // Re-render the GeoJSON to fit the new dimensions
      });
    },
  },
  mounted() {
    lottie.loadAnimation({
      container: this.$refs.lottieContainer,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://lottie.host/467ef57e-4846-40da-b692-24e222879fb6/LGSvEOUExP.json",
    });
  },

  methods: {
    getColorForName(name) {
      if (!name) {
        console.warn("Invalid color name:", name);
        return "#CCCCCC";
      }

      const color = this.colorMapping[name.toLowerCase()] || "#CCCCCC";
      return color;
    },

    getShapeForFont(font) {
      const shapes = {
        Script:
          "M12.2676 0L12.3659 1.06079C12.8993 6.81267 17.4549 11.3683 23.2068 11.9016L24.2676 12L23.2068 12.0984C17.4549 12.6317 12.8993 17.1873 12.3659 22.9392L12.2676 24L12.1692 22.9392C11.6359 17.1873 7.08025 12.6317 1.32837 12.0984L0.267578 12L1.32837 11.9016C7.08025 11.3683 11.6359 6.81267 12.1692 1.06079L12.2676 0Z",
        Decorative:
          "M10.6732 2.86997C11.2381 0.543343 14.547 0.543343 15.1119 2.86997L15.6893 5.24805L17.7792 3.97478C19.8238 2.72905 22.1635 5.06879 20.9178 7.11341L19.6445 9.20325L22.0226 9.78065C24.3492 10.3456 24.3492 13.6544 22.0226 14.2193L19.6445 14.7967L20.9178 16.8866C22.1635 18.9312 19.8238 21.2709 17.7792 20.0252L15.6893 18.7519L15.1119 21.13C14.547 23.4567 11.2381 23.4567 10.6732 21.13L10.0958 18.7519L8.00599 20.0252C5.96136 21.2709 3.62163 18.9312 4.86735 16.8866L6.14063 14.7967L3.76255 14.2193C1.43592 13.6544 1.43592 10.3456 3.76255 9.78065L6.14063 9.20325L4.86735 7.11341C3.62163 5.06879 5.96137 2.72905 8.00599 3.97478L10.0958 5.24805L10.6732 2.86997Z",
        Serif:
          "M23.7676 2C20.0161 3.5202 17.3333 7.56315 17.3333 12.3125C17.3333 17.0616 20.0157 21.1046 23.7668 22.625H2.01831C5.76939 21.1046 8.4519 17.0615 8.4519 12.3125C8.45189 7.56319 5.76899 3.52024 2.01758 2H23.7676Z",
        "Sans-serif": "M3.01758 2.25H22.5176V21.75H3.01758V2.25Z",
      };

      return shapes[font] || "M 0,0 A 10,10 0 1,1 0.1,0 Z";
    },

    renderGeoJSON() {
      if (!this.geojsonData || !this.geojsonData.features) {
        console.error("GeoJSON data is not available or invalid.");
        return;
      }
      const svg = d3.select(this.$refs.svg);
      svg.selectAll(".geojson-path").remove();

      // Get actual SVG dimensions from the DOM element
      const svgNode = svg.node();
      const width = svgNode.clientWidth || 800;
      const height = svgNode.clientHeight || 800;

      const projection = d3
        .geoMercator()
        .fitSize([width, height], this.geojsonData);
      const path = d3.geoPath().projection(projection);

      // Create paths with debugging
      const paths = svg
        .selectAll(".geojson-path")
        .data(this.geojsonData.features)
        .enter()
        .append("path")
        .attr("class", "geojson-path")
        .attr("d", path)
        .attr("fill", "#aaa")
        .attr("stroke", "#eee")
        .attr("stroke-width", 1)
        .attr("data-nta", (d) => d.properties.NTA2020)
        .attr("cursor", "pointer");

      paths
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget)
            .attr("stroke-width", 4)
            .attr("fill", "#777");
          this.handleTooltip(event, d);
        })
        .on("mousemove", (event, d) => {
          this.handleTooltip(event, d);
        })
        .on("mouseout", (event, d) => {
          if (
            d3.select(event.currentTarget).attr("data-nta") !== this.selectedNTA
          ) {
            d3.select(event.currentTarget)
              .attr("stroke-width", 1)
              .attr("fill", "#aaa");
          }
          this.handleTooltip(event, d);
        })
        .on("click", (event, d) => {
          this.showSidebar(d.properties.NTA2020, d.properties.neighborhood);
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

      svg.selectAll(".filtered-shape").remove();
      svg
        .selectAll(".filtered-shape")
        .data(filteredData)
        .enter()
        .append("path")
        .attr("class", "filtered-shape")
        .attr("d", (d) => {
          if (!d.fonts || d.fonts.length === 0) {
            console.warn(`No fonts found for item:`, d);
            return "";
          }
          // Prioritize the selected font if it exists in the array
          const font =
            this.selectedFont && d.fonts.includes(this.selectedFont)
              ? this.selectedFont
              : d.fonts[0]; // Fallback to the first font in the array
          return this.getShapeForFont(font);
        })
        .attr("transform", (d) => {
          const [x, y] = projection([d.lon, d.lat]);
          return `translate(${x}, ${y}) scale(1)`; // Position and scale the shape
        })
        .attr("fill", (d) => {
          if (!d.colors || d.colors.length === 0) {
            console.warn(`No colors found for item:`, d);
            return "#aaaaaa"; // Default color if no colors are found
          }
          const colorName =
            this.selectedColor && d.colors.includes(this.selectedColor)
              ? this.selectedColor
              : d.colors[0]; // Fallback to the first color in the array
          const color = this.getColorForName(colorName);
          console.log(`Setting color for ${colorName}: ${color}`);
          return color;
        })
        .attr("stroke", "#eee")
        .attr("stroke-width", 0.5)
        .on("mouseover", (event, d) => {
          event.stopPropagation(); // Prevent hover event from propagating to GeoJSON paths
          this.showStoreImage(d, event); // Show the store image tooltip
        })
        .on("mouseout", (event) => {
          event.stopPropagation(); // Prevent hover event from propagating to GeoJSON paths
          this.hideStoreImage(); // Hide the store image tooltip
        });
    },
    showStoreImage(storeData, event) {
      const storeImagePath = `https://qbssawkoheaimaffnrbd.supabase.co/storage/v1/object/public/street-view-images/${storeData.borough}/${storeData.id}.jpg`;
      const tooltip = d3.select(this.$refs.tooltip);

      tooltip
        .attr("class", "store-tooltip")
        .style("display", "block")
        .html(
          `<div>
            <div style="background-color: white; border: 1px solid #000; border-bottom: none; width: fit-content; padding: 4px 8px;">Store name: <b>${storeData.names}</b></div>
            <div style="border: 1px solid #000;"><img src="${storeImagePath}" alt="${storeData.name}" /></div>
        </div>`
        )
        .style("left", `${event.clientX}px`)
        .style("top", `${event.clientY}px`);
    },
    showSidebar(nta2020) {
      const svg = d3.select(this.$refs.svg);

      // Reset the stroke-width of the previously selected polygon
      svg
        .selectAll(".geojson-path")
        .filter((d) => d.properties.NTA2020 === this.selectedNTA)
        .attr("fill", "#aaa");

      // Highlight the newly selected polygon
      svg
        .selectAll(".geojson-path")
        .filter((d) => d.properties.NTA2020 === nta2020)
        .attr("fill", "#555");

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
      this.sidebarContent = `${boroughName}`;
      this.sidebarVisible = true;
      this.$refs.mapSidebar.zoomToNeighborhood();

      // Re-render the filtered circles to ensure they are on top
      if (
        this.filteredNeighborhoodData &&
        this.filteredNeighborhoodData.length > 0
      ) {
        this.renderFilteredCircles(this.filteredNeighborhoodData);
      }
    },
    hideStoreImage() {
      const tooltip = d3.select(this.$refs.tooltip);
      tooltip.style("display", "none");
    },
    closeSidebar() {
      this.sidebarVisible = false;
      this.selectedNTA = null;
      this.renderGeoJSON();

      // Re-render the filtered circles to ensure they are on top
      if (
        this.filteredNeighborhoodData &&
        this.filteredNeighborhoodData.length > 0
      ) {
        this.renderFilteredCircles(this.filteredNeighborhoodData);
      }
    },
    handleTooltip(event, d) {
      const tooltip = d3.select(this.$refs.tooltip);
      if (event.type === "mouseover") {
        tooltip
          .attr("class", "tooltip")
          .style("display", "block")
          .html(`<strong>${d.properties.NTAName}</strong>`);
      } else if (event.type === "mousemove") {
        tooltip
          .style("left", `${event.clientX}px`)
          .style("top", `${event.clientY}px`);
      } else if (event.type === "mouseout") {
        tooltip.style("display", "none");
      }
    },
    applyFilters() {
      if (!this.jsonData || !this.geojsonData || !this.demographicData) return;

      const filteredData = this.jsonData.filter((item) => {
        const matchesFont = this.selectedFont
          ? item.fonts && item.fonts.includes(this.selectedFont)
          : true; // If no font is selected, match all
        const matchesColor = this.selectedColor
          ? item.colors && item.colors.includes(this.selectedColor)
          : true; // If no color is selected, match all

        const demographic = this.demographicData.find(
          (d) => d.GeoID === item.NTA2020
        );

        if (!demographic) return false;

        // Logic for income groups
        const incomeGroups = {
          "100k_or_more": (value) => value >= 100000,
          "60k_to_99k": (value) => value >= 60000 && value < 100000,
          "30k_to_59k": (value) => value >= 30000 && value < 60000,
          under_30k: (value) => value < 30000,
        };

        // Filter by Medium Household Income
        const matchesIncome =
          !this.selectedIncome || // If no income group is selected, match all
          (incomeGroups[this.selectedIncome] &&
            incomeGroups[this.selectedIncome](
              parseFloat(demographic.MdHHIncE)
            ));

        // Filter by Race (percentage > 50%)
        const matchesRace =
          !this.selectedRace ||
          (["Hsp_P", "Bl_P", "Wt_P", "Asn_P"].includes(this.selectedRace) &&
            parseFloat(demographic[this.selectedRace]) > 50);

        // Filter by Generation (population > 10,000)
        const matchesGeneration =
          !this.selectedGeneration ||
          (["PopZ", "PopY", "PopX", "PopBB"].includes(
            this.selectedGeneration
          ) &&
            parseFloat(demographic[this.selectedGeneration]) > 10000);

        // All conditions must be true
        return (
          matchesFont &&
          matchesColor &&
          matchesIncome &&
          matchesRace &&
          matchesGeneration
        );
      });

      console.log("Filtered Data:", filteredData);

      // Render the filtered data
      this.renderFilteredCircles(filteredData);
    },
    highlightByFont(font) {
      this.selectedFont = font; // Update the selected font
      this.applyFilters(); // Apply the combined filters
    },
    highlightByColor(color) {
      this.selectedColor = color; // Update the selected color
      this.applyFilters(); // Apply the combined filters
    },
    resetFilters() {
      this.selectedFont = null;
      this.selectedColor = null;
      this.selectedIncome = "";
      this.selectedRace = "";
      this.selectedGeneration = "";

      // Remove all existing filtered shapes
      const svg = d3.select(this.$refs.svg);
      svg.selectAll(".filtered-shape").remove();
    },
  },
};
</script>

<style scoped>
h2 {
  font-family: "Skew VF";
  font-style: normal;
  font-size: 40px;
  font-weight: 700;
  line-height: 100%;
  text-transform: uppercase;
  margin: 0;
  text-align: left;
}
p {
  text-align: left;
}
span {
  text-align: left;
  font-size: 12px;
}
.map-section {
  position: relative;
  width: 100%;
  height: 100%;
}

#map-controller {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 20vw;
  top: 40px;
  left: 40px;
  z-index: 1000;
}

.map-container {
  display: flex;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

#neighborhood-map {
  flex: 1;
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  transition: flex 0.3s ease;
}

#neighborhood-map.with-sidebar {
  flex: 0.6;
}

.map-sidebar {
  flex: 0.4;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: flex 0.3s ease;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 5;
}

.filter-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 80%;
  z-index: 5;
}

.filter-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: right;
  width: 50%;
}

.filter-group select {
  padding: 8px;
  width: 50%;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.map-filter {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chart-label,
.chart-label-shadow {
  position: absolute;
  bottom: -8px;
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

button {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 40px;
  cursor: pointer;
  font-size: 14px;
  margin: 4px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

button:hover {
  background-color: #ddd;
}

button:active {
  background-color: #ffffff;
}

button.selected {
  background-color: #f0f0f0;
  color: black;
  border: 2px solid #000;
  font-weight: bold;
}

svg {
  display: block;
  width: 100%;
  height: 100%;
}

.tooltip {
  position: absolute;
  background-color: black;
  color: white;
  border-radius: 2px;
  padding: 4px 8px;
  font-size: 12px;
  pointer-events: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.store-tooltip {
  position: absolute;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  pointer-events: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.break-section .textbox {
  width: 40%;
  z-index: 5;
  text-align: center;
}

.break-section {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 10% 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lottie-container {
  width: 64px;
  height: 64px;
  margin: 0 auto;
}
</style>
