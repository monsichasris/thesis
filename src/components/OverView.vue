<template>
  <div class="overview-layout">
    <!-- Key Elements at the top -->
    <div class="key-elements">
      <WordsSection :jsonData="jsonData" :activeWords="activeWords" />
      <!-- <div id="stacked-bar-chart-fonts"></div>
      <div id="stacked-bar-chart-colors"></div> -->
      <ImageCluster :jsonData="jsonData" :selectedWord="selectedWord" />
    </div>

    <!-- Highlights Section -->
    <HighLights
      :highlights="highlights"
      @update-active-word="handleActiveWord"
    />
  </div>
</template>

<script>
import WordsSection from "./WordsSection.vue";
import ImageCluster from "./ImageCluster.vue";
import HighLights from "./HighLights.vue";
import { RiTa } from "rita";
import * as d3 from "d3";

export default {
  name: "OverView",
  components: { WordsSection, ImageCluster, HighLights },
  props: {
    jsonData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeWords: [],
      selectedWord: "new",
      highlights: [
        { title: "TEXTUAL", content: "What we see in the words..." },
        { title: "NEW", content: "Of course it's in New York..." },
        { title: "FRESH", content: "Even if Americans are not..." },
        { title: "STOP", content: "Another group of words..." },
        { title: "STAR", content: "Star, Super, Best, Top..." },
        { title: "Lucky", content: "The word lucky has been used..." },
        { title: "Nationality", content: "Besides the street name..." },
        { title: "Mr", content: "Bro, Brother, Bros, Son, Mr..." },
      ],
    };
  },

  computed: {
    filteredWords() {
      const wordCounts = {};
      const excludedWords = ["grill", "la", "el", "ave", "st", "street"];

      this.jsonData?.forEach((item) => {
        if (item.words) {
          const isChain = item.chain; // Check if the store is a chain
          const uniqueWords = new Set(item.words); // Use a Set to ensure unique words for chains

          uniqueWords.forEach((word) => {
            // Exclude stop words using RiTa
            if (
              !RiTa.isStopWord(word) &&
              !excludedWords.includes(word) &&
              !(word.length === 1 && isNaN(word)) // Exclude single alphabets
            ) {
              if (isChain) {
                // Count the word only once if it's a chain
                if (!wordCounts[word]) {
                  wordCounts[word] = 1;
                }
              } else {
                // Count normally for non-chain stores
                wordCounts[word] = (wordCounts[word] || 0) + 1;
              }
            }
          });
        }
      });

      return Object.entries(wordCounts)
        .filter(([, count]) => count > 15) // Only include words with count > 10
        .map(([word, count]) => ({
          "Name Words": word,
          "Store Count": count,
        }))
        .sort((a, b) => b["Store Count"] - a["Store Count"]); // Sort by count descending;
    },
  },
  mounted() {
    console.log("Highlights in HighLights component:", this.highlights);
    this.createStackedBarChart("stacked-bar-chart-fonts", "fonts");
    this.createStackedBarChart("stacked-bar-chart-colors", "colors");
  },
  methods: {
    createStackedBarChart(containerId, type) {
      // Clear any existing chart
      d3.select(`#${containerId}`).selectAll("*").remove();

      // Aggregate data for the specified type
      const aggregatedData = this.jsonData.reduce((acc, item) => {
        if (item[type]) {
          item[type].forEach((value) => {
            acc[value] = (acc[value] || 0) + 1;
          });
        }
        return acc;
      }, {});

      const chartData = Object.entries(aggregatedData).map(([key, value]) => ({
        name: key,
        value,
      }));

      // Set up dimensions
      const width = 800;
      const height = 50;
      const margin = { top: 10, right: 10, bottom: 10, left: 50 };

      // Create SVG container
      const svg = d3
        .select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create a scale for the total width
      const x = d3
        .scaleLinear()
        .domain([0, d3.sum(chartData, (d) => d.value)])
        .range([0, width]);

      // Render the stacked bar
      let cumulative = 0;
      chartData.forEach((d) => {
        svg
          .append("rect")
          .attr("x", x(cumulative))
          .attr("y", 0)
          .attr("width", x(d.value))
          .attr("height", height - 10)
          .attr(
            "fill",
            type === "colors"
              ? d.name.toLowerCase()
              : d3.schemeCategory10[chartData.indexOf(d) % 10]
          );
        cumulative += d.value;
      });
    },
    handleActiveWord(title) {
      const wordGroups = {
        new: ["new", "york"],
        fresh: [
          "fresh",
          "green",
          "organic",
          "natural",
          "farm",
          "healthy",
          "health",
          "farmer",
          "farmers",
          "garden",
        ],
        stop: ["stop", "express", "fast", "convenient", "quick", "go", "grab"],
        star: ["star", "super", "best", "top", "great"],
        lucky: ["lucky", "happy", "famous"],
        nationality: [
          "halal",
          "kosher",
          "islamic",
          "jewish",
          "chinese",
          "korean",
          "italian",
          "american",
          "latin",
          "mexican",
          "mexicana",
          "caribbean",
          "indian",
          "international",
          "african",
          "usa",
        ],
        mr: ["brothers", "bro", "brother", "bros", "son", "mr"],
      };

      this.activeWords = wordGroups[title] || [title]; // Fallback to single-word array
      this.selectedWord = title;
      console.log("Active words updated:", this.activeWords);
      console.log("Selected word updated:", this.selectedWord);
    },
  },
};
</script>

<style scoped>
.overview-layout {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

/* Sticky key elements */
.key-elements {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;
}

/* .highlights-container {
  flex: 1;
  overflow-y: scroll;
  padding: 1rem;
}

.highlight {
  margin-bottom: 2rem;
} */

.image-cluster {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
