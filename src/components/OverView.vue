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
            "From over 8,000 business names (counting each chain store only once), thousands of grocery store names were broken down into individual words—removing common ones like 'store,' 'market,' and 'deli' to focus on words with more meaning. You might notice values and lifestyles reflected in these names. Additionally, cultural clues emerge—some names reference family, nationality, religion, or languages that reflect the surrounding community.",
          isH1: true,
        },
        {
          title: "LA",
          content:
            "From the registered business names in English, after removing stop words, words from other languages—especially Spanish—play a significant role. Here, we start to see some demographic clues.",
          isH1: false,
        },
        {
          title: "NEW",
          content:
            "'New' came in second place. Even though this is New York, only 18 stores use the full name 'New York.' Others might use abbreviations like 'NY,' 'NYC,' or words that represent New York, such as 'Big Apple.' 'New' is also used in the names of other cities around the world or to represent something new in this city.",
          isH1: false,
        },
        {
          title: "FRESH",
          content:
            "'Fresh from the farm,' 'green,' 'organic,' 'natural'—these words reflect grocery store values and trends for urban consumers. Even with fast food just around the corner, these words emphasize a healthier lifestyle.",
          isH1: false,
        },
        {
          title: "STOP",
          content:
            "Another group of words reflects the fast-paced lifestyle of city dwellers. Words like 'stop by' or 'grab and go' suggest convenience and efficiency for people picking up groceries quickly.",
          isH1: false,
        },
        {
          title: "STAR",
          content:
            "'Star,' 'Super,' 'Best,' 'Top'—these words suggest competition, with stores aiming to be the best in the city. Interestingly, 'star' is used more often than celestial terms like 'moon' or 'sun.'",
          isH1: false,
        },
        {
          title: "HALAL",
          content:
            "Religious terms or references to the nationality of food reflect the cultural identities of people in this city, showcasing its diversity.",
          isH1: false,
        },
        {
          title: "Family",
          content:
            "Family-related words are used in store names, but they mostly reference men in the family or male prefixes like 'Mr.' Only a few stores use names like 'sister' or 'daughter.'",
          isH1: false,
        },
        // {
        //   title: "Lucky",
        //   content: "The word lucky has been used...",
        //   isH1: false,
        // },

        {
          title: "VISUAL",
          content:
            "Next, we looked at the visuals. What fonts do these stores use? What colors appear repeatedly? Each sign speaks its own visual language.",
          isH1: true,
        },
        {
          title: "Green",
          content:
            "Even though the word 'green' is popular for representing freshness, when it comes to actual colors, green is not the most used color.",
          isH1: false,
        },
        {
          title: "Red and White",
          content:
            "Red and white are the most commonly used color combinations in store signage. They grab customer attention, much like a stop sign on the street.",
          isH1: false,
        },
        {
          title: "Decorative",
          content:
            "Decorative fonts, designed for display, are the least used among all font types. While they are harder to read compared to the widely used sans-serif fonts, they give a local, handwritten feel—even for chain stores that aim to appear more personal and community-focused.",
          isH1: false,
        },
        {
          title: "Font combination",
          content:
            "We often see a combination of sans-serif fonts with other decorative fonts. Many stores use both sans-serif and script or decorative fonts together to create a unique yet readable design.",
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
        } else if (newTitle.toLowerCase() === "pink") {
          this.selectedWord = "Pink";
        } else if (newTitle.toLowerCase() === "script") {
          this.selectedWord = "Script";
        } else if (newTitle.toLowerCase() === "decorative") {
          this.selectedWord = "Decorative";
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
  height: 100%;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.key-elements {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: hidden;
  padding: 40px;
}

#stacked-bar-chart-fonts,
#stacked-bar-chart-colors {
  width: 100%;
}
</style>
