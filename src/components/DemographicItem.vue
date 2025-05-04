<template>
  <div class="demographic-item">
    <h3>{{ title }}</h3>
    <TextualShelf
      :jsonData="jsonData"
      :minStoreCount="minStoreCount"
      :fontSizeMultiplier="fontSizeMultiplier"
      :containerHeight="containerHeight"
    />
    <VisualShelf
      :containerId="`${containerId}-fonts`"
      type="fonts"
      :jsonData="jsonData"
      :width="chartWidth"
    />
    <VisualShelf
      :containerId="`${containerId}-colors`"
      type="colors"
      :jsonData="jsonData"
      :width="chartWidth"
    />
  </div>
</template>

<script>
import TextualShelf from "./TextualShelf.vue";
import VisualShelf from "./VisualShelf.vue";

export default {
  name: "DemographicItem",
  components: { TextualShelf, VisualShelf },
  props: {
    title: {
      type: String,
      required: true,
    },
    jsonData: {
      type: Array,
      required: true,
    },
    containerId: {
      type: String,
      required: true,
    },
    minStoreCount: {
      type: Number,
      required: false,
      default: 10,
    },
    fontSizeMultiplier: {
      type: Number,
      required: false,
      default: 1,
    },
    containerHeight: {
      type: String,
      required: false,
      default: "320px",
    },
    chartWidth: {
      type: Number,
      required: false,
      default: 240,
    },
  },
};
</script>

<style scoped>
.demographic-item {
  position: relative;
  overflow: visible;
  width: 20%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
