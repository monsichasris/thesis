<template>
  <div v-show="isVisible" class="sidebar">
    <button class="close-button" @click="$emit('close')">×</button>
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <p><strong>Store Count:</strong> {{ storeCount }}</p>

    <!-- Mapbox Map -->
    <div id="mapbox-sidebar" class="mapbox-sidebar"></div>

    <!-- WordsSection -->
    <WordsSection
      :jsonData="filteredData"
      :minStoreCount="1"
      :fontSizeMultiplier="10"
    />

    <!-- VisualChart -->
    <VisualChart
      containerId="sidebar-visual-chart-fonts"
      type="fonts"
      :jsonData="filteredData"
      :width="sidebarWidth"
    />
    <VisualChart
      containerId="sidebar-visual-chart-colors"
      type="colors"
      :jsonData="filteredData"
      :width="sidebarWidth"
    />

    <!-- Demographic Data -->
    <div v-if="demographicData" class="demographic-data">
      <h4>Demographics</h4>
      <p><strong>Population:</strong> {{ demographicData.Pop }}</p>
      <p><strong>Median Age:</strong> {{ demographicData.MdAge }}</p>
      <p><strong>Under 18:</strong> {{ demographicData.PopU18 }}</p>
      <p><strong>65 and Older:</strong> {{ demographicData.Pop65pl }}</p>
      <p>
        <strong>Hispanic Population:</strong> {{ demographicData.Hsp_E }} ({{
          demographicData.Hsp_P
        }}%)
      </p>
      <p>
        <strong>White Population:</strong> {{ demographicData.Wt_E }} ({{
          demographicData.Wt_P
        }}%)
      </p>
      <p>
        <strong>Black Population:</strong> {{ demographicData.Bl_E }} ({{
          demographicData.Bl_P
        }}%)
      </p>
      <p>
        <strong>Asian Population:</strong> {{ demographicData.Asn_E }} ({{
          demographicData.Asn_P
        }}%)
      </p>
    </div>
  </div>
</template>

<script>
import WordsSection from "./WordsSection.vue";
import VisualChart from "./VisualChart.vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default {
  name: "MapSidebar",
  components: {
    WordsSection,
    VisualChart,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    filteredData: {
      type: Array,
      required: true,
    },
    demographicData: {
      type: Object,
      required: false,
    },
    geojsonData: {
      type: Object,
      required: true, // Pass GeoJSON data for polygons
    },
  },
  data() {
    return {
      map: null, // Mapbox map instance
    };
  },

  computed: {
    sidebarWidth() {
      return 400;
    },
    storeCount() {
      return this.filteredData.length;
    },
  },
  watch: {
    isVisible(newVal) {
      console.log("isVisible changed:", newVal); // Debugging
      if (newVal) {
        this.initializeMap();
      }
    },
    filteredData(newVal) {
      console.log("filteredData updated:", newVal);
      this.zoomToNeighborhood();
    },
  },

  methods: {
    initializeMap() {
      if (this.map) return; // Prevent reinitializing the map

      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;

      // Initialize the Mapbox map
      this.map = new mapboxgl.Map({
        container: "mapbox-sidebar", // ID of the map container
        style: "mapbox://styles/mapbox/light-v11", // Mapbox style
        center: [-74.006, 40.7128], // Default center (New York City)
        zoom: 20, // Default zoom level
      });

      this.map.on("load", () => {
        console.log("Map loaded");
        // Add GeoJSON data as a source
        this.map.addSource("neighborhoods", {
          type: "geojson",
          data: this.geojsonData,
        });

        // Add a layer to display the polygons
        this.map.addLayer({
          id: "neighborhoods-layer",
          type: "fill",
          source: "neighborhoods",
          paint: {
            "fill-color": "#888888",
            "fill-opacity": 0.4,
          },
        });

        // Add a border for the polygons
        this.map.addLayer({
          id: "neighborhoods-border",
          type: "line",
          source: "neighborhoods",
          paint: {
            "line-color": "#000",
            "line-width": 1,
          },
        });

        // Zoom to the selected neighborhood
        this.zoomToNeighborhood();
      });
    },
    zoomToNeighborhood() {
      if (!this.map) {
        console.error("Map instance is not initialized.");
        return;
      }

      if (!this.filteredData || this.filteredData.length === 0) {
        console.log("No filtered data available.");
        return;
      }

      const nta2020 = this.filteredData[0].NTA2020;
      console.log("Selected NTA2020:", nta2020);

      const feature = this.geojsonData.features.find(
        (f) => f.properties.NTA2020 === nta2020
      );
      console.log("Selected Feature:", feature);

      if (feature) {
        const coordinates = feature.geometry.coordinates[0]; // Assuming a Polygon
        console.log("Feature Coordinates:", coordinates);

        const bounds = coordinates.reduce(
          (bbox, coord) => {
            if (!Array.isArray(coord) || coord.length !== 2) {
              console.error("Invalid coordinate:", coord);
              return bbox;
            }
            return [
              Math.min(bbox[0], coord[0]), // Min longitude
              Math.min(bbox[1], coord[1]), // Min latitude
              Math.max(bbox[2], coord[0]), // Max longitude
              Math.max(bbox[3], coord[1]), // Max latitude
            ];
          },
          [Infinity, Infinity, -Infinity, -Infinity]
        );
        if (bounds.includes(Infinity) || bounds.includes(-Infinity)) {
          console.error("Invalid bounds calculated:", bounds);
          return;
        }

        this.map.fitBounds(bounds, { padding: 20 });

        // Add store locations
        this.addStoreLocations();
      } else {
        console.log("Feature not found for NTA2020:", nta2020);
      }
    },
    addStoreLocations() {
      if (!this.map) {
        console.error("Map instance is not initialized.");
        return;
      }

      if (!this.filteredData || this.filteredData.length === 0) {
        console.log("No filtered data available for stores.");
        return;
      }

      // Create GeoJSON features for store locations
      const storeFeatures = this.filteredData.map((store) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [store.lon, store.lat], // Longitude and Latitude
        },
        properties: {
          id: store.id, // Store ID
          borough: store.borough, // Borough for image folder
          name: store.names || "Unknown Store", // Store name
        },
      }));

      // Update or add the store-locations source
      if (this.map.getSource("store-locations")) {
        this.map.getSource("store-locations").setData({
          type: "FeatureCollection",
          features: storeFeatures,
        });
      } else {
        this.map.addSource("store-locations", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: storeFeatures,
          },
        });

        // Add a layer to display store locations as dots
        this.map.addLayer({
          id: "store-locations-layer",
          type: "circle",
          source: "store-locations",
          paint: {
            "circle-radius": 4,
            "circle-color": "#000",
          },
        });

        let popup = null; // Store the popup instance
        let popupTimeout = null; // Store the timeout ID

        // Add interactivity for store dots
        this.map.on("mouseenter", "store-locations-layer", (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { id, borough, name } = e.features[0].properties;

          // Construct the image path
          const imagePath = `/street_view_images/${borough}/${id}.jpg`;

          // Clear any existing timeout to prevent premature popup removal
          if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
          }

          // Display a popup with the image
          popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `
          <div style="text-align: center;">
            <strong>${name}</strong>
            <br />
            <img src="${imagePath}" alt="${name}" style="width: 200px; height: auto;" />
          </div>
        `
            )
            .addTo(this.map);
        });

        this.map.on("mouseleave", "store-locations-layer", () => {
          // Set a timeout to remove the popup
          popupTimeout = setTimeout(() => {
            if (popup) {
              popup.remove();
              popup = null;
            }
          }, 1000);
        });
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 2000;
  overflow-y: auto;
}

.sidebar h3 {
  margin-top: 0;
}

.mapbox-sidebar {
  width: 100%;
  height: 300px; /* Adjust height as needed */
  margin-bottom: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
