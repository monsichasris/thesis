<template>
  <div id="map" ref="mapContainer" class="map-container"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "MapBase",
  props: {
    accessToken: {
      type: String,
      required: true, // Pass your Mapbox access token as a prop
    },
    center: {
      type: Array,
      default: () => [40, -74.5], // Default center [longitude, latitude]
    },
    zoom: {
      type: Number,
      default: 10, // Default zoom level
    },
  },
  data() {
    return {
      map: null, // Mapbox map instance
    };
  },
  mounted() {
    this.initializeMap();
  },
  beforeUnmount() {
    if (this.map) this.map.remove(); // Clean up the map instance
  },
  methods: {
    initializeMap() {
      mapboxgl.accessToken = this.accessToken;

      this.map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: "mapbox://styles/monsicha/cm8qhxet2002y01qkbtph7hz6",
        center: this.center,
        zoom: this.zoom,
      });

      this.map.on("load", () => {
        console.log("Map loaded successfully!");
        console.log("Map style:", this.map.getStyle());
      });

      this.map.on("error", (e) => {
        console.error("Mapbox error:", e.error.message);
      });
    },
  },
};
</script>

<style>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
