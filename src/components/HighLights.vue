<template>
  <div class="highlights-container">
    <div
      class="highlight"
      v-for="highlight in highlights"
      :key="highlight.title"
    >
      <!-- Render <h1> or <h2> based on the isH1 property -->
      <h1 v-if="highlight.isH1">{{ highlight.title }}</h1>
      <h2 v-else>{{ highlight.title }}</h2>
      <p>{{ highlight.content }}</p>
    </div>
  </div>
</template>

<script>
import scrollama from "scrollama";
export default {
  name: "HighLight",
  props: {
    highlights: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      scroller: null,
    };
  },
  methods: {
    initScrollama() {
      this.scroller = scrollama();
      this.scroller
        .setup({
          step: ".highlight",
          offset: 0.8,
          debug: false,
        })
        .onStepEnter(({ element }) => {
          const titleElement = element.querySelector("h1, h2"); // Select both <h1> and <h2>
          const title = titleElement?.textContent?.toLowerCase()?.trim();
          if (!title) {
            console.warn("Title is undefined or empty");
            return;
          }

          // Emit an event to the parent component with the active title
          this.$emit("update-active-word", title);
        });
    },
    handleScroll() {
      const highlights = document.querySelector(".highlights-container");
      const keyElements = document.querySelector(".key-elements");

      const highlightsBottom = highlights.getBoundingClientRect().bottom;
      const viewportHeight = window.innerHeight;

      if (highlightsBottom <= viewportHeight) {
        // If the bottom of HighLights is visible, stop sticking
        keyElements.style.position = "absolute";
        keyElements.style.top = `${
          highlights.offsetHeight - keyElements.offsetHeight
        }px`;
      } else {
        // Otherwise, keep it sticky
        keyElements.style.position = "sticky";
        keyElements.style.top = "0";
      }
    },
  },
  mounted() {
    this.initScrollama();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.highlights-container {
  position: absolute; /* Overlay on the left */
  top: 0;
  right: 0;
  width: 30vw; /* Take up 30% of the viewport width */
  height: 100vh; /* Full viewport height */
  overflow-y: scroll; /* Allow scrolling within the highlights */
  padding: 1rem;
  padding-top: 50%;
  background: transparent;
  z-index: 10; /* Ensure it overlays other elements */
}

.highlight {
  margin-bottom: 60vh;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.highlight h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.highlight p {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  color: #666;
}
</style>
