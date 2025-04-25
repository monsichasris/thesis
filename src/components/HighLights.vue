<template>
  <div class="highlights-container">
    <div
      class="highlight"
      v-for="highlight in highlights"
      :key="highlight.title"
    >
      <h2>{{ highlight.title }}</h2>
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
  mounted() {
    this.initScrollama();
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
          const title = element
            .querySelector("h2")
            ?.textContent?.toLowerCase()
            .trim();
          if (!title) {
            console.warn("Title is undefined or empty");
            return;
          }

          // Emit an event to the parent component with the active title
          this.$emit("update-active-word", title);
        });
    },
  },
};
</script>

<style scoped>
.highlights-container {
  position: absolute;
  overflow-y: scroll;
  height: 100vh;
  width: 30vw;
  padding: 1rem;
  padding-top: 50%;
  background: transparent;
  z-index: 2;
  top: 0;
  right: 0;
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
