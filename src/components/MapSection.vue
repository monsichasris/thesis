<template>
  <div>
    <h1>Map</h1>
    <div>
      <h3>Filter by Fonts</h3>
      <div>
        <button
          v-for="font in fonts"
          :key="font"
          @click="highlightByFont(font)"
        >
          {{ font }}
        </button>
      </div>
      <h3>Filter by Colors</h3>
      <div>
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
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "MapSection",
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
        .on("mouseover", function () {
          d3.select(this).attr("fill", "#fdae61"); // Highlight on hover
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#ccc"); // Reset fill on mouseout
        });
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
