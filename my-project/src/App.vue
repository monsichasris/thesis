<template>
  <img alt="title" src="img/title.png" width="100%" />

  <section><Intro /></section>

  <section><NameCluster :csvData="csvData" /></section>

  <section>
    <MapBase
      :accessToken="mapboxAccessToken"
      :center="[40.7128, -74.006]"
      :zoom="12"
    />
  </section>
  <section>Thank you</section>
  <footer></footer>
</template>

<script>
import Intro from "./components/Intro.vue";
import NameCluster from "./components/NameCluster.vue";
import MapBase from "./components/Map.vue";
import "mapbox-gl/dist/mapbox-gl.css";

export default {
  name: "App",
  components: {
    Intro,
    NameCluster,
    MapBase,
  },
  data() {
    return {
      csvData: null,
      mapboxAccessToken:
        "pk.eyJ1IjoibW9uc2ljaGEiLCJhIjoiY2t1Z2Z2MXV1MjNtYzJucXBjYmwxNnpkNSJ9.e2G2z3OlPked0RO2kHnWlw",
    };
  },
  async mounted() {
    this.csvData = await this.loadCSV();
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

.textbox {
  font-size: 16px;
  line-height: 1.5;
  margin: 200px auto 400px auto;
  width: 400px;
  background-color: white;
}
</style>
