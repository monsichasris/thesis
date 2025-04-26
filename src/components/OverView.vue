<template>
  <div class="overview-layout">
    <!-- Highlights Section -->
    <HighLights
      :highlights="highlights"
      @update-active-word="handleActiveWord"
    />
    <!-- Key Elements at the top -->
    <div class="key-elements">
      <WordsSection
        v-if="!isVisualOrAfter"
        :jsonData="jsonData"
        :activeTitle="activeTitle"
      />

      <!-- Show Chart if the activeTitle is "VISUAL" -->
      <div v-else>
        <VisualChart
          containerId="stacked-bar-chart-fonts"
          type="fonts"
          :jsonData="jsonData"
          :activeTitle="activeTitle"
        />
        <VisualChart
          containerId="stacked-bar-chart-colors"
          type="colors"
          :jsonData="jsonData"
          :activeTitle="activeTitle"
        />
      </div>
      <ImageCluster :jsonData="jsonData" :selectedWord="selectedWord" />
    </div>
  </div>
</template>

<script>
import WordsSection from "./WordsSection.vue";
import ImageCluster from "./ImageCluster.vue";
import HighLights from "./HighLights.vue";
import VisualChart from "./VisualChart.vue";

export default {
  name: "OverView",
  components: { WordsSection, ImageCluster, HighLights, VisualChart },
  props: {
    jsonData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeTitle: null,
      selectedWord: "new",
      highlights: [
        {
          title: "TEXTUAL",
          content: "What we see in the words...",
          isH1: true,
        },
        { title: "NEW", content: "Of course it's in New York...", isH1: false },
        {
          title: "FRESH",
          content: "Even if Americans are not...",
          isH1: false,
        },
        { title: "STOP", content: "Another group of words...", isH1: false },
        { title: "STAR", content: "Star, Super, Best, Top...", isH1: false },
        {
          title: "Lucky",
          content: "The word lucky has been used...",
          isH1: false,
        },
        { title: "Mr", content: "Bro, Brother, Bros, Son, Mr...", isH1: false },
        {
          title: "Nationality",
          content: "Besides the street name...",
          isH1: false,
        },
        {
          title: "VISUAL",
          content: "What we see in the colors...",
          isH1: true,
        },
        {
          title: "Green",
          content: "The colors used in the stores...",
          isH1: false,
        },
        {
          title: "Script",
          content: "The fonts used in the stores...",
          isH1: false,
        },
        {
          title: "Complimentary",
          content: "The complimentary colors...",
          isH1: false,
        },
      ],
    };
  },
  watch: {
    activeTitle(newTitle) {
      if (newTitle === "visual") {
        console.log("Switched to visual mode");
      }
    },
  },
  methods: {
    handleActiveWord(newTitle) {
      this.activeTitle = newTitle.toLowerCase(); // Normalize the title to lowercase

      // Set selectedWord based on the activeTitle
      if (this.isVisualOrAfter) {
        if (newTitle.toLowerCase() === "visual") {
          this.selectedWord = "default-font"; // Replace with a default font value
        } else if (newTitle.toLowerCase() === "green") {
          this.selectedWord = "Green"; // Replace with a default color value
        } else if (newTitle.toLowerCase() === "script") {
          this.selectedWord = "Script"; // Replace with a default font value
        } else {
          this.selectedWord = null; // Reset if no specific value is needed
        }
      } else {
        this.selectedWord = newTitle; // Use the word as the selectedWord
      }

      console.log(`Active title updated to: ${this.activeTitle}`);
      console.log(`Selected word updated to: ${this.selectedWord}`);
    },
  },
  computed: {
    isVisualOrAfter() {
      const visualIndex = this.highlights.findIndex(
        (highlight) => highlight.title.toLowerCase() === "visual"
      );
      const activeIndex = this.highlights.findIndex(
        (highlight) => highlight.title.toLowerCase() === this.activeTitle
      );
      return activeIndex >= visualIndex; // True if activeTitle is "visual" or later
    },
  },
};
</script>

<style scoped>
.overview-layout {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Sticky key elements */
.key-elements {
  position: sticky;
  top: 0; /* Stick to the top of the viewport */
  height: 100vh; /* Full viewport height */
  overflow-y: auto; /* Allow scrolling within the key elements */
  padding: 1rem;
}

#stacked-bar-chart-fonts,
#stacked-bar-chart-colors {
  width: 100%;
}
</style>
