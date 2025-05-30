<template>
  <div v-show="isVisible" class="sidebar">
    <div class="sidebar-sticky">
      <button class="close-button" @click="$emit('close')">×</button>
      <!-- Mapbox Map -->
      <div id="mapbox-sidebar" class="mapbox-sidebar"></div>

      <div class="sidebar-header">
        <div class="sidebar-header-title">
          <h2>{{ title }}</h2>
          <p>{{ content }}</p>
        </div>
        <div style="text-align: right">
          <span class="skew number">{{ storeCount }}</span
          ><br />
          <span class="text-small">stores</span>
        </div>
      </div>
    </div>

    <div class="sidebar-content">
      <div class="shelf">
        <!-- TextualShelf -->
        <TextualShelf
          :jsonData="filteredData"
          :minStoreCount="1"
          :fontSizeMultiplier="10"
          :containerHeight="containerHeight"
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
        <div class="demographic-data-group">
          <div class="demographic-data-list">
            <div>
              <span>Population:</span><br />
              <span class="text-small">Estimated</span>
            </div>
            <span class="skew number">{{ demographicData.Pop }}</span>
          </div>
          <div class="demographic-data-list">
            <div>
              <span>Income:</span><br />
              <span class="text-small">Medium Household</span>
            </div>
            <span class="skew number">{{ demographicData.MdHHIncE }}</span>
          </div>
        </div>

        <div class="demographic-data-group">
          <h3>Age</h3>
          <div class="demographic-data-list">
            <span>Gen Z</span>
            <span class="skew number">{{ demographicData.PopZ }}</span>
          </div>
          <div class="demographic-data-list">
            <span>Gen Y</span>
            <span class="skew number">{{ demographicData.PopY }}</span>
          </div>
          <div class="demographic-data-list">
            <span>Gen X</span>
            <span class="skew number">{{ demographicData.PopX }}</span>
          </div>
          <div class="demographic-data-list">
            <span>Baby Boomers</span>
            <span class="skew number">{{ demographicData.PopBB }}</span>
          </div>
        </div>

        <div class="demographic-data-group">
          <h3>Race</h3>
          <div class="demographic-data-list">
            <span>Hispanic</span>
            <span class="skew number"
              >{{ demographicData.Hsp_E }} ({{ demographicData.Hsp_P }}%)</span
            >
          </div>
          <div class="demographic-data-list">
            <span>White</span>
            <span class="skew number"
              >{{ demographicData.Wt_E }} ({{ demographicData.Wt_P }}%)</span
            >
          </div>
          <div class="demographic-data-list">
            <span>Black</span>
            <span class="skew number"
              >{{ demographicData.Bl_E }} ({{ demographicData.Bl_P }}%)</span
            >
          </div>
          <div class="demographic-data-list">
            <span>Asian</span>
            <span class="skew number"
              >{{ demographicData.Asn_E }} ({{ demographicData.Asn_P }}%)</span
            >
          </div>
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
      return 480;
    },
    storeCount() {
      return this.filteredData.length;
    },
    containerHeight() {
      const contentHeight = this.filteredData.length * 4;
      return Math.min(contentHeight, 200) + "px";
    },
  },
  watch: {
    isVisible(newVal) {
      console.log("isVisible changed:", newVal);
      if (newVal) {
        this.initializeMap();
        if (this.map) {
          this.map.resize(); // Resize the map when the sidebar becomes visible
        }
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

      // Ensure the map resizes when the window is resized
      window.addEventListener("resize", () => {
        if (this.map) {
          this.map.resize();
        }
      });

      this.map.on("load", () => {
        console.log("Map loaded");
        this.map.resize();
        // Add GeoJSON data as a source
        this.map.addSource("neighborhoods", {
          type: "geojson",
          data: this.geojsonData,
        });

        // // Add a layer to display the polygons
        // this.map.addLayer({
        //   id: "neighborhoods-layer",
        //   type: "fill",
        //   source: "neighborhoods",
        //   paint: {
        //     "fill-color": "#888888",
        //     "fill-opacity": 0.4,
        //   },
        // });

        // Add a border for the polygons
        this.map.addLayer({
          id: "neighborhoods-border",
          type: "line",
          source: "neighborhoods",
          paint: {
            "line-color": "#fff",
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

      const feature = this.geojsonData.features.find(
        (f) => f.properties.NTA2020 === nta2020
      );

      if (feature) {
        const coordinates = feature.geometry.coordinates[0];

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

        // Use Mapbox expressions to dynamically style the border
        this.map.setPaintProperty("neighborhoods-border", "line-color", [
          "case",
          ["==", ["get", "NTA2020"], nta2020],
          "#000", // Highlight color for the selected neighborhood
          "#fff", // Default color for other neighborhoods
        ]);

        this.map.setPaintProperty("neighborhoods-border", "line-width", [
          "case",
          ["==", ["get", "NTA2020"], nta2020],
          2, // Highlight width for the selected neighborhood
          1, // Default width for other neighborhoods
        ]);

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
          imagePath: `/street_view_images/${store.borough}/${store.id}.jpg`,
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

        // Add interactivity for store dots
        this.map.on("mouseenter", "store-locations-layer", (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { id, borough, name } = e.features[0].properties;

          const imagePath = `https://qbssawkoheaimaffnrbd.supabase.co/storage/v1/object/public/street-view-images/${borough}/${id}.jpg`;

          // Display a popup with the image
          popup = new mapboxgl.Popup({
            offset: 0,
            closeButton: false,
            closeOnClick: false,
          })
            .setLngLat(coordinates)
            .setHTML(
              `
          <div style="text-align: left; padding: 0;">
            <strong>${name}</strong>
            <br />
            <img src="${imagePath}" alt="${name}" style="width: 200px; height: auto;" />
          </div>
        `
            )
            .addTo(this.map);
        });

        this.map.on("mouseleave", "store-locations-layer", () => {
          // Remove the popup when the mouse leaves the store dot
          if (popup) {
            popup.remove();
            popup = null;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
h2 {
  margin: 0;
  line-height: 100%;
}
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 40vw;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
  align-content: left;
  border-left: 1px solid #ccc;
  overflow-y: auto;
}

.sidebar-sticky {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 999;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: flex-start;
  padding: 24px 40px;
}

.sidebar-header-title {
  display: flex;
  flex-direction: column;
  align-items: left;
  align-content: left;
  text-align: left;
  gap: 8px;
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

.mapboxgl-canvas {
  width: 100% !important; /* Ensure it takes the full width */
  height: 100% !important; /* Ensure it takes the full height */
}

.sidebar-content {
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: left;
  align-content: left;
}

.shelf {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.demographic-data {
  text-align: left;
  padding: 24px 0;
}

.demographic-data-group {
  border-bottom: 1px solid #ccc;
  padding: 8px 0;
  margin-bottom: 16px;
}

.demographic-data-list {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  z-index: 2000;
}

.text-small {
  font-size: 12px;
  color: #555;
}

.number {
  font-size: 20px;
  font-weight: 700;
}
</style>
