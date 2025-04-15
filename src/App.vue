<template>
  <section><Intro /></section>
  <section><WordsSection :jsonData="jsonData" /></section>
  <!-- <section><NameCluster :csvData="csvData" /></section> -->
  <!-- <section>
    <MapBase
      :accessToken="mapboxAccessToken"
      :center="[40.7128, -74.006]"
      :zoom="12"
    />
  </section> -->

  <section>Thank you</section>
  <footer></footer>
</template>

<script>
import Intro from "./components/Intro.vue";
import WordsSection from "./components/WordsSection.vue";
// import NameCluster from "./components/NameCluster.vue";
// import MapBase from "./components/Map.vue";
// import "mapbox-gl/dist/mapbox-gl.css";

export default {
  name: "App",
  components: {
    Intro,
    WordsSection,
    // NameCluster,
    // MapBase,
  },
  data() {
    return {
      csvData: null,
      jsonData: null,
      // mapboxAccessToken:
      //   "pk.eyJ1IjoibW9uc2ljaGEiLCJhIjoiY2t1Z2Z2MXV1MjNtYzJucXBjYmwxNnpkNSJ9.e2G2z3OlPked0RO2kHnWlw",
    };
  },
  async mounted() {
    this.csvData = await this.loadCSV();
    this.jsonData = await this.loadJSON();
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
        const response = await fetch("word_summary.json");
        if (!response.ok) {
          throw new Error("Failed to fetch words.json");
        }
        const data = await response.json();
        console.log("Loaded JSON data:", data);
        return data;
      } catch (error) {
        console.error("Error loading JSON:", error);
        return null;
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
  font-size: 80px;
}
</style>
