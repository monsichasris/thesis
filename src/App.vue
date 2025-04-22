<template>
  <link rel="stylesheet" href="https://use.typekit.net/zik1lgr.css" />
  <section><Intro /></section>
  <section><WordsSection :jsonData="jsonData" /></section>
  <section><VisualSection :jsonData="jsonData" /></section>
  <section>
    <DemographicSection
      :demographicData="demographicData"
      :jsonData="jsonData"
    />
  </section>
  <section>
    <NeighborhoodSection :jsonData="jsonData" :geojsonData="geojsonData" />
  </section>
  <section><Outro /></section>
  <footer></footer>
</template>

<script>
import * as d3 from "d3";
import Intro from "./components/Intro.vue";
import WordsSection from "./components/WordsSection.vue";
import VisualSection from "./components/VisualSection.vue";
import DemographicSection from "./components/DemographicSection.vue";
import NeighborhoodSection from "./components/NeighborhoodSection.vue";
import Outro from "./components/Outro.vue";

export default {
  name: "App",
  components: {
    Intro,
    WordsSection,
    VisualSection,
    DemographicSection,
    NeighborhoodSection,
    Outro,
  },
  data() {
    return {
      csvData: null,
      jsonData: [],
      geojsonData: null,
      demographicData: [],
    };
  },
  async mounted() {
    this.csvData = await this.loadCSV();
    this.jsonData = await this.loadJSON();
    this.geojsonData = await this.loadGeoJSON();
    this.demographicData = await this.loadDemographicData();
  },
  methods: {
    async loadCSV() {
      try {
        const response = await fetch("Filtered_Grocery_Neighborhoods.csv");
        const text = await response.text();
        return text;
      } catch (error) {
        console.error("Error loading CSV:", error);
        return null;
      }
    },
    async loadJSON() {
      try {
        const response = await fetch("main_df.json");
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
  font-family: Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  background-color: #eee;
}

.textbox {
  font-size: 16px;
  line-height: 1.5;
  margin: 200px auto 400px auto;
  width: 400px;
  background-color: #eee;
}

h1 {
  font-size: 56px;
}

.subhead {
  font-size: 40px;
}

.skew {
  font-family: "skew-variable", sans-serif;
  font-variation-settings: "wght" 300;
}

.split-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sticky-left {
  position: sticky;
  top: 0;
  background: white;
  padding: 1em;
  width: 70vw;
  height: 100vh;
  overflow-y: auto;
}

.scroll-right {
  width: 30vw;
  height: 100vh;
  overflow-y: scroll;
  padding: 2rem;
}

.highlight {
  margin: 0 auto;
  padding: 20px;
  margin-bottom: 60vh;
  background-color: white;
  z-index: 1;
}
</style>
