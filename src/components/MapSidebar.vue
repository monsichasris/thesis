<template>
  <div v-if="isVisible" class="sidebar">
    <button class="close-button" @click="closeSidebar">×</button>
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>

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
  },
  computed: {
    sidebarWidth() {
      return 300; // Match the width of the sidebar (in pixels)
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
  width: 320px;
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
