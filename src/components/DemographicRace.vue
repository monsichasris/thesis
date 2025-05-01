<template>
  <div>
    <div class="textbox">
      If we look into the demographic in each neighborhood, some words, fonts,
      and colors appear more often in different communities.
    </div>
    <div class="demographic-group" id="demo-race">
      <h2>Race</h2>
      <div class="textbox">
        These are grouped by the percentage of race in each neighborhood that
        has more than 50% of the population.
      </div>
      <div class="demographic-column">
        <div class="demographic-item">
          <h3>Hispanic</h3>
          <WordsSection
            :jsonData="getFilteredData('Hsp_P')"
            :minStoreCount="20"
            :fontSizeMultiplier="1.2"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-hp"
            type="fonts"
            :jsonData="getFilteredData('Hsp_P')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-hp"
            type="colors"
            :jsonData="getFilteredData('Hsp_P')"
            :width="sidebarWidth"
          />
        </div>
        <div class="demographic-item">
          <h3>Black</h3>
          <WordsSection
            :jsonData="getFilteredData('Bl_P')"
            :minStoreCount="10"
            :fontSizeMultiplier="1.2"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-bl"
            type="fonts"
            :jsonData="getFilteredData('Bl_P')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-bl"
            type="colors"
            :jsonData="getFilteredData('Bl_P')"
            :width="sidebarWidth"
          />
        </div>
        <div class="demographic-item">
          <h3>White</h3>
          <WordsSection
            :jsonData="getFilteredData('Wt_P')"
            :minStoreCount="10"
            :fontSizeMultiplier="1.2"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-wt"
            type="fonts"
            :jsonData="getFilteredData('Wt_P')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-wt"
            type="colors"
            :jsonData="getFilteredData('Wt_P')"
            :width="sidebarWidth"
          />
        </div>
        <div class="demographic-item">
          <h3>Asian</h3>
          <WordsSection
            :jsonData="getFilteredData('Asn_P')"
            :minStoreCount="2"
            :fontSizeMultiplier="2.2"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-as"
            type="fonts"
            :jsonData="getFilteredData('Asn_P')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-as"
            type="colors"
            :jsonData="getFilteredData('Asn_P')"
            :width="sidebarWidth"
          />
        </div>
      </div>
    </div>
    <div class="demographic-group" id="demo-age">
      <h2>Age</h2>
      <div class="textbox">
        These are grouped by the percentage of age in each neighborhood that has
        more than 50% of the population.
      </div>
      <div class="demographic-column">
        <div class="demographic-item">
          <h3>Under 18</h3>
          <WordsSection
            :jsonData="getFilteredData('PopU18')"
            :minStoreCount="20"
            :fontSizeMultiplier="0.5"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-u18"
            type="fonts"
            :jsonData="getFilteredData('PopU18')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-u18"
            type="colors"
            :jsonData="getFilteredData('PopU18')"
            :width="sidebarWidth"
          />
        </div>
        <div class="demographic-item">
          <h3>65 and Older</h3>
          <WordsSection
            :jsonData="getFilteredData('Pop65pl')"
            :minStoreCount="10"
            :fontSizeMultiplier="0.5"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-65pl"
            type="fonts"
            :jsonData="getFilteredData('Pop65pl')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-65pl"
            type="colors"
            :jsonData="getFilteredData('Pop65pl')"
            :width="sidebarWidth"
          />
        </div>
      </div>
    </div>
    <div class="demographic-group" id="demo-income">
      <h2>Income</h2>
      <div class="textbox">
        These are grouped by the percentage of income in each neighborhood that
        has more than 50% of the population.
      </div>
      <div class="demographic-column">
        <div class="demographic-item">
          <h3>Under 30k</h3>
          <WordsSection
            :jsonData="getFilteredData('under_30k')"
            :minStoreCount="2"
            :fontSizeMultiplier="2"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-u30k"
            type="fonts"
            :jsonData="getFilteredData('under_30k')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-u30k"
            type="colors"
            :jsonData="getFilteredData('under_30k')"
            :width="sidebarWidth"
          />
        </div>
        <div class="demographic-item">
          <h3>30k to 44k</h3>
          <WordsSection
            :jsonData="getFilteredData('30k_to_44k')"
            :minStoreCount="10"
            :fontSizeMultiplier="1.2"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-44k"
            type="fonts"
            :jsonData="getFilteredData('30k_to_44k')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-44k"
            type="colors"
            :jsonData="getFilteredData('30k_to_44k')"
            :width="sidebarWidth"
          />
        </div>
        <div class="demographic-item">
          <h3>45k to 64k</h3>
          <WordsSection
            :jsonData="getFilteredData('45k_to_64k')"
            :minStoreCount="20"
            :fontSizeMultiplier="1.2"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-64k"
            type="fonts"
            :jsonData="getFilteredData('45k_to_64k')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-64k"
            type="colors"
            :jsonData="getFilteredData('45k_to_64k')"
            :width="sidebarWidth"
          />
        </div>
        <div class="demographic-item">
          <h3>65k to 99k</h3>
          <WordsSection
            :jsonData="getFilteredData('65k_to_99k')"
            :minStoreCount="25"
            :fontSizeMultiplier="0.8"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-99k"
            type="fonts"
            :jsonData="getFilteredData('65k_to_99k')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-99k"
            type="colors"
            :jsonData="getFilteredData('65k_to_99k')"
            :width="sidebarWidth"
          />
        </div>
        <div class="demographic-item">
          <h3>100k or more</h3>
          <WordsSection
            :jsonData="getFilteredData('100k_or_more')"
            :minStoreCount="15"
            :fontSizeMultiplier="1.2"
          />
          <VisualChart
            containerId="stacked-bar-chart-fonts-100kpl"
            type="fonts"
            :jsonData="getFilteredData('100k_or_more')"
            :width="sidebarWidth"
          />

          <VisualChart
            containerId="stacked-bar-chart-colors-100kpl"
            type="colors"
            :jsonData="getFilteredData('100k_or_more')"
            :width="sidebarWidth"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WordsSection from "./WordsSection.vue";
import VisualChart from "./VisualChart.vue";

export default {
  name: "DemographicRace",
  components: { WordsSection, VisualChart },
  props: {
    containerId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
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
  },
  computed: {
    sidebarWidth() {
      return 240;
    },
  },

  methods: {
    getFilteredData(column) {
      if (!this.demographicData || !this.jsonData) {
        console.warn("demographicData or jsonData is not available.");
        return [];
      }

      // Logic for race columns (percentage > 50%)
      if (["Hsp_P", "Bl_P", "Wt_P", "Asn_P"].includes(column)) {
        const filteredNeighborhoods = this.demographicData
          .filter((row) => parseFloat(row[column]) > 50) // Race percentage > 50%
          .map((row) => row.GeoID);

        // Filter jsonData to include only matching neighborhoods
        return this.jsonData.filter((item) =>
          filteredNeighborhoods.includes(item.NTA2020)
        );
      }

      // Logic for population columns with population > 10,000
      if (["PopU18", "Pop65pl"].includes(column)) {
        const filteredNeighborhoods = this.demographicData
          .filter((row) => parseFloat(row[column]) > 10000) // Population > 10,000
          .map((row) => row.GeoID);

        // Filter jsonData to include only matching neighborhoods
        return this.jsonData.filter((item) =>
          filteredNeighborhoods.includes(item.NTA2020)
        );
      }

      // Logic for income groups (under_30k, 30k_to_44k, etc.)
      const incomeGroups = {
        "100k_or_more": (value) => value >= 100000,
        "65k_to_99k": (value) => value >= 65000 && value < 100000,
        "45k_to_64k": (value) => value >= 45000 && value < 65000,
        "30k_to_44k": (value) => value >= 30000 && value < 45000,
        under_30k: (value) => value < 30000,
      };

      if (incomeGroups[column]) {
        const filterCondition = incomeGroups[column];

        const filteredNeighborhoods = this.demographicData
          .filter((row) => filterCondition(parseFloat(row["MdHHIncE"])))
          .map((row) => row.GeoID);

        return this.jsonData.filter((item) =>
          filteredNeighborhoods.includes(item.NTA2020)
        );
      }
      // Default: return an empty array if the column is not recognized
      console.warn(`Column "${column}" is not recognized.`);
      return [];
    },
  },
};
</script>

<style scoped>
.demographic-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.demographic-column {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  gap: 24px;
  margin: auto;
}
.demographic-item {
  width: 20%;
}
.textbox {
  margin: 80px auto;
}
</style>
