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
  position: absolute;
  top: 0;
  right: 0;
  width: 24vw;
  padding: 40px;
  padding-top: 50%;
  padding-bottom: 50%;
  background: transparent;
  z-index: 10;
  pointer-events: none;
}

.highlight {
  margin-bottom: 60vh;
  padding: 40px;
  background-color: #ffffff;
  pointer-events: auto;
  line-height: 150%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.highlight h1 {
  font-family: "Skew VF";
  font-style: normal;
  font-size: 4rem;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
  border-top: #000 dashed 1px;
  border-bottom: #000 dashed 1px;
}

.highlight h2 {
  margin-top: 0;
  line-height: normal;
  font-size: 2rem;
  text-transform: uppercase;
  color: #000;
}

.highlight p {
  margin: 0.5rem 0;
  padding-top: 1rem;
  font-size: 1rem;
  color: #000;
  border-top: #000 dashed 1px;
}
</style>
