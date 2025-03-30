<template>
  <img alt="title" src="./assets/title.png" width="100%" />

  <section>
    <div style="height: 100vh; position: sticky; top: 0">
      <img
        src="./assets/basket.svg"
        style="
          position: absolute;
          transform: translate(-50%, 0%);
          bottom: 0;
          left: 50%;
        "
      />
    </div>

    <Intro />

    <img
      src="./assets/explain-sign.png"
      width="60%"
      style="margin-top: -320px; margin-bottom: 400px"
    />
  </section>

  <section id="cluster">
    <NameCluster :csvData="csvData" />
  </section>

  <section class="viz" id="map">Map</section>
  <section>Thank you</section>
  <footer></footer>
</template>

<script>
// let { RiTa } = require("rita");
// import * as d3 from "d3";
import Intro from "./components/Intro.vue";
import NameCluster from "./components/NameCluster.vue";

export default {
  name: "App",
  components: {
    Intro,
    NameCluster,
  },
  data() {
    return {
      csvData: null,
    };
  },
  async mounted() {
    this.csvData = await this.loadCSV();
    console.log("Loaded CSV Data:", this.csvData); // Debugging
  },
  methods: {
    async loadCSV() {
      try {
        const response = await fetch("/Retail_Food_Store.csv");
        const text = await response.text();
        return text;
      } catch (error) {
        console.error("Error loading CSV:", error);
        return null;
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 0;
}

.viz {
  height: 100vh;
  background-color: #f0f0f0;
}

.textbox {
  font-size: 16px;
  line-height: 1.5;
  margin: 200px auto 400px auto;
  width: 400px;
}
</style>
