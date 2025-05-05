<template>
  <div v-show="isVisible" class="sidebar">
    <button class="close-button" @click="$emit('close')">×</button>

    <!-- Mapbox Map -->
    <div id="mapbox-sidebar" class="mapbox-sidebar"></div>

    <div class="sidebar-content">
      <div class="sidebar-header">
        <div class="sidebar-header-title">
          <h2>{{ title }}</h2>
          <p>{{ content }}</p>
        </div>
        <p>
          <span class="skew">{{ storeCount }}</span> stores
        </p>
      </div>

      <div class="shelf">
        <!-- TextualShelf -->
        <TextualShelf
          :jsonData="filteredData"
          :minStoreCount="1"
          :fontSizeMultiplier="10"
          :containerHeight="'200px'"
        />

        <!-- VisualShelf -->
        <VisualShelf
          containerId="sidebar-visual-chart-fonts"
          type="fonts"
          :jsonData="filteredData"
          :width="sidebarWidth - 20"
        />
        <VisualShelf
          containerId="sidebar-visual-chart-colors"
          type="colors"
          :jsonData="filteredData"
          :width="sidebarWidth - 20"
        />
      </div>

      <!-- Demographic Data -->
      <div v-if="demographicData" class="demographic-data">
        <h3>Demographics</h3>
        <div class="demographic-data-list">
          <strong>Population:</strong> <span>{{ demographicData.Pop }}</span>
        </div>
        <h3>Age</h3>
        <div class="demographic-data-list">
          <strong>Gen Z</strong> <span>{{ demographicData.PopZ }}</span>
        </div>
        <div class="demographic-data-list">
          <strong>Gen Y</strong> <span>{{ demographicData.PopY }}</span>
        </div>
        <div class="demographic-data-list">
          <strong>Gen X</strong> <span>{{ demographicData.PopX }}</span>
        </div>
        <div class="demographic-data-list">
          <strong>Baby Boomers</strong>
          <span>{{ demographicData.PopBB }}</span>
        </div>
        <h3>Race</h3>
        <div class="demographic-data-list">
          <strong>Hispanic</strong>
          <span
            >{{ demographicData.Hsp_E }} ({{ demographicData.Hsp_P }}%)</span
          >
        </div>
        <div class="demographic-data-list">
          <strong>White</strong>
          <span>{{ demographicData.Wt_E }} ({{ demographicData.Wt_P }}%)</span>
        </div>
        <div class="demographic-data-list">
          <strong>Black</strong>
          <span>{{ demographicData.Bl_E }} ({{ demographicData.Bl_P }}%)</span>
        </div>
        <div class="demographic-data-list">
          <strong>Asian</strong>
          <span
            >{{ demographicData.Asn_E }} ({{ demographicData.Asn_P }}%)</span
          >
        </div>
        <div class="demographic-data-list">
          <strong>Medium Household Income:</strong>
          <span>{{ demographicData.MdHHIncE }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextualShelf from "./TextualShelf.vue";
import VisualShelf from "./VisualShelf.vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default {
  name: "MapSidebar",
  components: {
    TextualShelf,
    VisualShelf,
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
      required: true,
    },
  },
  data() {
    return {
      map: null,
    };
  },

  computed: {
    sidebarWidth() {
      return 600;
    },
    storeCount() {
      return this.filteredData.length;
    },
  },
  watch: {
    isVisible(newVal) {
      console.log("isVisible changed:", newVal);
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

      this.map = new mapboxgl.Map({
        container: "mapbox-sidebar",
        style: "mapbox://styles/mapbox/light-v11",
        center: [-74.006, 40.7128], // Default center NYC
        zoom: 20,
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
          coordinates: [store.lon, store.lat],
        },
        properties: {
          id: store.id,
          borough: store.borough,
          name: store.names || "Unknown Store",
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

        let popup = null;
        let popupTimeout = null;

        // Add interactivity for store dots
        this.map.on("mouseenter", "store-locations-layer", (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { id, borough, name } = e.features[0].properties;

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
  width: 40vw;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
  align-content: left;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: flex-start;
}

.sidebar-header-title {
  display: flex;
  flex-direction: column;
  align-items: left;
  align-content: left;
  text-align: left;
}

.sidebar h3 {
  margin: 0;
  text-transform: uppercase;
}
.sidebar p {
  margin: 0;
  align-items: left;
}

.mapbox-sidebar {
  box-sizing: border-box;
  flex: 0 0 auto;
  width: 100%;
  height: 320px;
}

.sidebar-content {
  padding: 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: left;
  align-content: left;
}

.shelf {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 0;
  width: 100%;
}

.demographic-data {
  text-align: left;
}

.demographic-data-list {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 100;
}
</style>
