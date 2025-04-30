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
            "From over the 8,000 doing business names (count once if is chain store), broke down thousands of grocery store names into individual words—removing common ones like store, market, and deli to focus on words with more meaning. You might see some values, lifestyles. You can also see cultural clues— some names reference family, nationality, religion, or languages that reflect the surrounding community.",
          isH1: true,
        },
        {
          title: "LA",
          content:
            "From the registered doing business name in English and removing stop words. The word from other languages especially spanish play a big part. We start seeing some demopgraphic clues here",
          isH1: false,
        },
        {
          title: "NEW",
          content:
            '"New" came to the second place. even if here is New York - Only 18 store use full name of New York other might name NY, NYC or word that represent New York like Big apple."New" also came with the name of other cities in the the world or represent something new.',
          isH1: false,
        },
        {
          title: "FRESH",
          content:
            "Fresh from the farm, green, organic, natural... come with the grocery store value and trend for people in the city. Even if we have fastfood next around the corner.",
          isH1: false,
        },
        {
          title: "STOP",
          content:
            "Another group of words that could reflect lifestyle of fast walking people in this city. Just stop by or grab and go what they need from the grocey",
          isH1: false,
        },
        {
          title: "STAR",
          content:
            "Star, Super, Best, Top... We can see some competition here we want to be best in this city. another interesting thing, star is used over the moon or the sun here.",
          isH1: false,
        },
        {
          title: "HALAL",
          content:
            "Religion term or Nationality of food also reflect identity of people in this city from different culture around the world.",
          isH1: false,
        },
        {
          title: "Family",
          content:
            "Family related words are used in the stores, but mostly are men in the the family or the prefix of men like Mr., only few store name sister or daughter.",
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
            "Then, looked at the visuals. What fonts do these stores use? What colors show up again and again? each sign speaks its own visual language.",
          isH1: true,
        },
        {
          title: "Green",
          content:
            "Even if the word green poppular than other colors to represent the freshness of the fodd, when it come to color, it's not the most used color.",
          isH1: false,
        },
        {
          title: "Red and White",
          content:
            "Red and white are the most use combination of colors in the stores to grab customer attention like a stop sign on the street",
          isH1: false,
        },
        {
          title: "Decorative",
          content:
            "Even decorative font design for display, it's the least use among other font. It's quite difficult to read compare the san-serif that use everywhere, but it give a feeling of local handwritten style even if some of them are the chain store that want the customer to feel like a local one.",
          isH1: false,
        },
        {
          title: "Font combination",
          content:
            "We can see combination of san-serif with other decorative font use together A lot of stores use both San-serif and script or decorative together to make it more unique but still easy to read.",
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
