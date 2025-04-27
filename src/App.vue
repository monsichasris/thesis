<template>
  <link rel="stylesheet" href="https://use.typekit.net/zik1lgr.css" />
  <section><Intro /></section>
  <!-- <section><WordsSection :jsonData="jsonData" /></section>
  <section><VisualSection :jsonData="jsonData" /></section>
  <section>
    <DemographicSection
      :demographicData="demographicData"
      :jsonData="jsonData"
    />
  </section>
  <MapSection :jsonData="jsonData" :geojsonData="geojsonData" /> -->
  <section><OverView :jsonData="jsonData" /></section>
  <section>
    <DemographicRace :jsonData="jsonData" :demographicData="demographicData" />
  </section>
  <section><Outro /></section>
  <footer></footer>
</template>

<script>
import * as d3 from "d3";
import Intro from "./components/Intro.vue";
import OverView from "./components/OverView.vue";
import DemographicRace from "./components/DemographicRace.vue";
// import DemographicSection from "./components/DemographicSection.vue";
// import MapSection from "./components/MapSection.vue";
import Outro from "./components/Outro.vue";

export default {
  name: "App",
  components: {
    Intro,
    OverView,
    DemographicRace,
    // WordsSection,
    // VisualSection,
    // DemographicSection,
    // MapSection,
    Outro,
  },
  data() {
    return {
      jsonData: [],
      // geojsonData: [],
      demographicData: [],
    };
  },
  async mounted() {
    this.jsonData = await this.loadJSON();
    // this.geojsonData = await this.loadGeoJSON();
    this.demographicData = await this.loadDemographicData();
  },
  methods: {
    async loadJSON() {
      try {
        const response = await fetch("/main_df.json");
        if (!response.ok) {
          throw new Error("Failed to fetch words.json");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error loading JSON:", error);
        return null;
      }
    },
    async loadGeoJSON() {
      try {
        const response = await fetch("/neighborhoods.json");
        if (!response.ok) {
          throw new Error("Failed to fetch neighborhoods.json");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
        return null;
      }
    },
    async loadDemographicData() {
      try {
        const response = await fetch("/demographic.csv");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch demographic.csv: ${response.statusText}`
          );
        }
        const text = await response.text();
        const data = d3.csvParse(text);
        return data;
      } catch (error) {
        console.error("Error loading demographic data:", error);
        return [];
      }
    },
  },
};
</script>

<style>
#app {
  font-family: "obviously", sans-serif;
  font-weight: 400;
  font-style: normal;
  src: url("https://use.typekit.net/zik1lgr.css") format("woff2");

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  background-color: #eee;
}

.textbox {
  font-size: 24px;
  line-height: 1.5;
  text-align: left;
  margin: 200px auto 400px auto;
  width: 60%;
  background-color: #eee;
}

h1 {
  font-size: 56px;
  margin: 0;
}

.subhead {
  font-size: 40px;
}

.skew {
  font-family: "skew-variable", sans-serif;
  font-variation-settings: "wght" 300;
}
</style>
