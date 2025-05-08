<template>
  <div>
    <div class="break-section">
      <div class="textbox">
        When we examine the demographics of each neighborhood looking at race,
        age, and income, certain words, fonts, and colors appear more frequently
        in specific communities.
      </div>
      <img
        style="
          position: absolute;
          height: 90%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
        src="/img/paper.png"
      />
    </div>

    <div class="demographic-group" id="demo-race">
      <div class="demographic-group-header">
        <h2>Race</h2>
        <div class="textbox">
          These groups are based on neighborhoods where more than 50% of the
          population shares the same racial background.
        </div>
      </div>
      <div class="demographic-column">
        <DemographicItem
          v-for="(group, index) in raceGroups"
          :key="index"
          :title="group.title"
          :jsonData="getFilteredData(group.filterKey)"
          :containerId="group.containerId"
          :minStoreCount="group.minStoreCount"
          :fontSizeMultiplier="group.fontSizeMultiplier"
          :containerHeight="group.containerHeight"
          :chartWidth="sidebarWidth"
        />
      </div>
    </div>
    <div class="demographic-group" id="demo-age">
      <div class="demographic-group-header">
        <h2>Age</h2>
        <div class="textbox">
          These groups represent neighborhoods with an estimated population of
          over 10,000 categorized by age range (data from 2022).
        </div>
      </div>
      <div class="demographic-column">
        <DemographicItem
          v-for="(group, index) in ageGroups"
          :key="index"
          :title="group.title"
          :jsonData="getFilteredData(group.filterKey)"
          :containerId="group.containerId"
          :minStoreCount="group.minStoreCount"
          :fontSizeMultiplier="group.fontSizeMultiplier"
          :containerHeight="group.containerHeight"
          :chartWidth="sidebarWidth"
        />
      </div>
    </div>
    <div class="demographic-group" id="demo-income">
      <div class="demographic-group-header">
        <h2>Income</h2>
        <div class="textbox">
          These groups are based on the median household income in each
          neighborhood.
        </div>
      </div>
      <div class="demographic-column">
        <DemographicItem
          v-for="(group, index) in incomeGroups"
          :key="index"
          :title="group.title"
          :jsonData="getFilteredData(group.filterKey)"
          :containerId="group.containerId"
          :minStoreCount="group.minStoreCount"
          :fontSizeMultiplier="group.fontSizeMultiplier"
          :containerHeight="group.containerHeight"
          :chartWidth="sidebarWidth"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DemographicItem from "./DemographicItem.vue";

export default {
  name: "DemographicSection",
  components: { DemographicItem },
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
  },
  computed: {
    sidebarWidth() {
      return 240;
    },
    raceGroups() {
      return [
        {
          title: "Hispanic",
          filterKey: "Hsp_P",
          containerId: "stacked-bar-chart-hispanic",
          minStoreCount: 5,
          fontSizeMultiplier: 1,
          containerHeight: "320px",
        },
        {
          title: "Black",
          filterKey: "Bl_P",
          containerId: "stacked-bar-chart-black",
          minStoreCount: 5,
          fontSizeMultiplier: 1,
          containerHeight: "320px",
        },
        {
          title: "White",
          filterKey: "Wt_P",
          containerId: "stacked-bar-chart-white",
          minStoreCount: 5,
          fontSizeMultiplier: 1,
          containerHeight: "320px",
        },
        {
          title: "Asian",
          filterKey: "Asn_P",
          containerId: "stacked-bar-chart-asian",
          minStoreCount: 5,
          fontSizeMultiplier: 1,
          containerHeight: "320px",
        },
      ];
    },
    ageGroups() {
      return [
        {
          title: "Gen Z",
          filterKey: "PopZ",
          containerId: "stacked-bar-chart-genZ",
          minStoreCount: 5,
          fontSizeMultiplier: 0.5,
          containerHeight: "320px",
        },
        {
          title: "Gen Y",
          filterKey: "PopY",
          containerId: "stacked-bar-chart-genY",
          minStoreCount: 5,
          fontSizeMultiplier: 0.5,
          containerHeight: "320px",
        },
        {
          title: "Gen X",
          filterKey: "PopX",
          containerId: "stacked-bar-chart-genX",
          minStoreCount: 5,
          fontSizeMultiplier: 0.5,
          containerHeight: "320px",
        },
        {
          title: "Baby Boomer",
          filterKey: "PopBB",
          containerId: "stacked-bar-chart-boomer",
          minStoreCount: 5,
          fontSizeMultiplier: 0.5,
          containerHeight: "320px",
        },
      ];
    },
    incomeGroups() {
      return [
        {
          title: "Under 30k",
          filterKey: "under_30k",
          containerId: "stacked-bar-chart-u30k",
          minStoreCount: 5,
          fontSizeMultiplier: 1,
          containerHeight: "320px",
        },
        {
          title: "30k to 59k",
          filterKey: "30k_to_59k",
          containerId: "stacked-bar-chart-30k-59k",
          minStoreCount: 5,
          fontSizeMultiplier: 1,
          containerHeight: "320px",
        },
        {
          title: "60k to 99k",
          filterKey: "60k_to_99k",
          containerId: "stacked-bar-chart-60k-99k",
          minStoreCount: 5,
          fontSizeMultiplier: 1,
          containerHeight: "320px",
        },
        {
          title: "100k or more",
          filterKey: "100k_or_more",
          containerId: "stacked-bar-chart-100kpl",
          minStoreCount: 5,
          fontSizeMultiplier: 1,
          containerHeight: "320px",
        },
      ];
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
          .filter((row) => parseFloat(row[column]) > 50)
          .map((row) => row.GeoID);

        return this.jsonData.filter((item) =>
          filteredNeighborhoods.includes(item.NTA2020)
        );
      }

      // Logic for population columns with population > 10,000
      if (["PopZ", "PopY", "PopX", "PopBB"].includes(column)) {
        const filteredNeighborhoods = this.demographicData
          .filter((row) => parseFloat(row[column]) > 10000)
          .map((row) => row.GeoID);

        return this.jsonData.filter((item) =>
          filteredNeighborhoods.includes(item.NTA2020)
        );
      }

      // Logic for income groups
      const incomeGroups = {
        "100k_or_more": (value) => value >= 100000,
        "60k_to_99k": (value) => value >= 60000 && value < 100000,
        "30k_to_59k": (value) => value >= 30000 && value < 60000,
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
h2 {
  font-family: "Skew VF";
  font-style: normal;
  font-size: 48px;
  font-weight: 700;
  line-height: 100%;
  text-transform: uppercase;
  margin: 0;
  text-align: left;
}
.demographic-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
  gap: 16px;
}

.demographic-group-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: left;
  padding: 0 64px;
  gap: 24px;
}

.demographic-group-header h2 {
  position: relative;
  z-index: 1; /* Ensure the text is above the background */
  background-image: url("/Users/monsichasris/Documents/MS/msdv/thesis/public/img/boom.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding: 24px;
  height: 100px;
  width: 25%;
  text-align: center;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.demographic-group-header .textbox {
  margin: 0;
}

.demographic-column {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  gap: 24px;
  margin: auto;
}

.textbox {
  margin: 8px auto;
  background-color: transparent;
}

.break-section .textbox {
  width: 30%;
  z-index: 5;
}

.break-section {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
