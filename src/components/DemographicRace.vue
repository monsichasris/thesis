<template>
  <div>
    <p class="textbox">
      If we look into the demographic in each neighborhood by race, some
      elements are interesting.
      <br />
      These are grouped by the percentage of race in each neighborhood that has
      more than 50% of the population.
    </p>

    <h2>Hispanic</h2>
    <WordsSection
      :jsonData="getFilteredData('Hsp_P')"
      :minStoreCount="20"
      :fontSizeMultiplier="1.2"
    />

    <h2>Black</h2>
    <WordsSection
      :jsonData="getFilteredData('Bl_P')"
      :minStoreCount="12"
      :fontSizeMultiplier="1.2"
    />

    <h2>White</h2>
    <WordsSection
      :jsonData="getFilteredData('Wt_P')"
      :minStoreCount="12"
      :fontSizeMultiplier="1.2"
    />

    <h2>Asian</h2>
    <WordsSection
      :jsonData="getFilteredData('Asn_P')"
      :minStoreCount="3"
      :fontSizeMultiplier="2.2"
    />
  </div>
  <p class="textbox">
    what about the visual? the fonts style in these group of neighborhood
  </p>
  <h2>Hispanic</h2>
  <VisualChart
    containerId="stacked-bar-chart-fonts"
    type="fonts"
    :jsonData="getFilteredData('Hsp_P')"
  />

  <h2>Black</h2>
  <VisualChart
    containerId="stacked-bar-chart-fonts"
    type="fonts"
    :jsonData="getFilteredData('Bl_P')"
  />

  <h2>White</h2>
  <VisualChart
    containerId="stacked-bar-chart-fonts"
    type="fonts"
    :jsonData="getFilteredData('Wt_P')"
  />

  <h2>Asian</h2>
  <VisualChart
    containerId="stacked-bar-chart-fonts"
    type="fonts"
    :jsonData="getFilteredData('Asn_P')"
  />
</template>

<script>
import WordsSection from "./WordsSection.vue";
import VisualChart from "./VisualChart.vue";

export default {
  name: "DemographicRace",
  components: { WordsSection, VisualChart },
  props: {
    demographicData: {
      type: Array,
      required: true,
      default: () => [],
    },
    jsonData: {
      type: Array,
      required: true,
      default: () => [],
    },
    containerId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },

  methods: {
    getFilteredData(raceColumn) {
      if (!this.demographicData || !this.jsonData) {
        console.warn("demographicData or jsonData is not available.");
        return [];
      }

      // Filter neighborhoods where the race percentage > 50%
      const filteredNeighborhoods = this.demographicData
        .filter((row) => parseFloat(row[raceColumn]) > 50)
        .map((row) => row.GeoID);

      // Filter jsonData to include only matching neighborhoods
      return this.jsonData.filter((item) =>
        filteredNeighborhoods.includes(item.NTA2020)
      );
    },
  },
};
</script>

<style scoped>
.textbox {
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.5;
}
</style>
