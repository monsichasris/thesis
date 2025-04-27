<template>
  <div v-if="isVisible" class="sidebar">
    <button class="close-button" @click="closeSidebar">×</button>
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <p><strong>Store Count:</strong> {{ storeCount }}</p>

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
  },
  computed: {
    sidebarWidth() {
      return 400;
    },
    storeCount() {
      return this.filteredData.length;
    },
  },
  methods: {
    closeSidebar() {
      this.$emit("close");
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
