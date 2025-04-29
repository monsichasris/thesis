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
          content:
            "From the 8,000 names (count once if is chain store), broke down thousands of grocery store names into individual words—removing common ones like store, market, and deli to focus on words with more meaning. You might see some values, lifestyles. You can also see cultural clues— some names reference family, nationality, religion, or languages that reflect the surrounding community.",
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
      this.activeTitle = newTitle.toLowerCase();

      // Set selectedWord based on the activeTitle
      if (this.isVisualOrAfter) {
        if (newTitle.toLowerCase() === "visual") {
          this.selectedWord = "default-font";
        } else if (newTitle.toLowerCase() === "green") {
          this.selectedWord = "Green";
        } else if (newTitle.toLowerCase() === "script") {
          this.selectedWord = "Script";
        } else {
          this.selectedWord = null;
        }
      } else {
        this.selectedWord = newTitle;
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

.key-elements {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;
}

#stacked-bar-chart-fonts,
#stacked-bar-chart-colors {
  width: 100%;
}
</style>
