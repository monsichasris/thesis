<template>
  <div class="image-cluster">
    <svg ref="svg" class="image-svg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ImageCluster",
  props: {
    jsonData: {
      type: Array,
      required: true,
    },
    selectedWord: {
      type: String,
      default: null,
    },
    selectedColor: {
      type: String,
      default: null,
    },
    selectedFont: {
      type: String,
      default: null,
    },
    selectedNeighborhood: {
      type: String,
      default: null,
    },
  },
  computed: {
    filteredStores() {
      const stores = this.jsonData.filter((store) => {
        const matchesWord = this.selectedWord
          ? store.words?.includes(this.selectedWord)
          : true;
        const matchesColor = this.selectedColor
          ? store.colors?.includes(this.selectedColor)
          : true;
        const matchesFont = this.selectedFont
          ? store.fonts?.includes(this.selectedFont)
          : true;
        const matchesNeighborhood = this.selectedNeighborhood
          ? store.neighborhood === this.selectedNeighborhood
          : true;

        return (
          matchesWord && matchesColor && matchesFont && matchesNeighborhood
        );
      });

      console.log("Filtered stores in ImageCluster:", stores); // Debugging log
      return stores;
    },
  },
  mounted() {
    console.log("selectedWord in ImageCluster:", this.selectedWord);
    this.createForceSimulation();
  },
  watch: {
    selectedWord(newVal) {
      console.log("selectedWord changed in ImageCluster:", newVal);
      this.createForceSimulation();
    },
  },
  methods: {
    getImagePath(store) {
      return `/street_view_images/${store.borough}/${store.id}.jpg`;
    },
    createForceSimulation() {
      const width = this.$refs.svg.parentElement.offsetWidth;
      const height = 600;

      const svg = d3
        .select(this.$refs.svg)
        .attr("width", width)
        .attr("height", height);

      const nodes = this.filteredStores.map((store) => ({
        id: store.id,
        image: this.getImagePath(store),
        x: Math.random() * width,
        y: Math.random() * height,
      }));

      // Store the simulation as a property of the component
      this.simulation = d3
        .forceSimulation(nodes.slice(0, 100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody().strength(10))
        .force("collision", d3.forceCollide().radius(20))
        .on("tick", () => {
          svg
            .selectAll("image")
            .data(nodes)
            .join("image")
            .attr("xlink:href", (d) => d.image)
            .attr("x", (d) => d.x - 20)
            .attr("y", (d) => d.y - 20)
            .attr("width", 80)
            .attr("height", 40)
            .attr("loading", "lazy");
        });
    },
  },
};
</script>

<style scoped>
.image-cluster {
  padding: 1rem;
}

.image-svg {
  display: block;
  margin: 0 auto;
}
</style>
