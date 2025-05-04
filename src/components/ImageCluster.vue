<template>
  <div class="image-cluster">
    <svg ref="svg" class="image-svg"></svg>
    <div ref="tooltip" class="tooltip"></div>
  </div>
  <img
    src="img/basket.svg"
    width="80%"
    style="
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: -1;
    "
  />
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ImageCluster",
  props: {
    jsonData: {
      type: [String, Array],
      required: true,
    },
    selectedWord: {
      type: Array,
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
      return this.jsonData.filter((store) => {
        // Ensure selectedWord is always an array
        const selectedWords = Array.isArray(this.selectedWord)
          ? this.selectedWord
          : [this.selectedWord];

        // Match conditions
        const matchesWord = this.selectedWord
          ? selectedWords.every((word) => store.words?.includes(word))
          : false; // Match any word in the selectedWord array

        const matchesColor = this.selectedWord
          ? selectedWords.every((word) => store.colors?.includes(word))
          : false; // Match any color in the selectedWord array

        const matchesFont = this.selectedWord
          ? selectedWords.every((word) => store.fonts?.includes(word))
          : false; // Match any font in the selectedWord array

        const matchesNeighborhood = this.selectedNeighborhood
          ? store.neighborhood === this.selectedNeighborhood
          : true; // Neighborhood is optional

        const hasSign = store.has_sign === "Yes";

        // Only return stores that match the selectedWord in any category and have a sign
        return (
          hasSign &&
          selectedWords.length > 0 &&
          (matchesWord || matchesColor || matchesFont) &&
          matchesNeighborhood
        );
      });
    },
  },
  mounted() {
    console.log("jsonData in ImageCluster:", this.jsonData);
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

      const tooltip = d3.select(this.$refs.tooltip);

      const nodes = this.filteredStores.map((store) => ({
        id: store.id,
        name: store.names,
        neighborhood: store.neighborhood,
        borough: store.borough,
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
            .attr("loading", "lazy")
            .attr("cursor", "pointer")
            .on("mouseover", (event, d) => {
              tooltip
                .style("display", "block")
                .style("left", `${event.clientX + 4}px`)
                .style("top", `${event.clientY + 4}px`)
                .html(
                  `<strong>${d.name}</strong><br>Neighborhood: ${d.neighborhood}<br>Borough: ${d.borough}`
                );

              d3.select(event.target).attr("width", 200).attr("height", 120);
            })
            .on("mouseout", function () {
              tooltip.style("display", "none");

              d3.select(this) // Reset the image size
                .attr("width", 80)
                .attr("height", 40);
            })
            .on("mousemove", (event) => {
              tooltip
                .style("left", `${event.clientX + 4}px`)
                .style("top", `${event.clientY + 4}px`);
            });
        });
    },
  },
};
</script>

<style scoped>
.tooltip {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  font-size: 12px;
  z-index: 10;
  text-align: left;
}
.image-cluster {
  margin-top: 24px;
  width: 100%;
}

.image-svg {
  width: auto;
  height: auto;
  margin: 0 auto;
}
</style>
