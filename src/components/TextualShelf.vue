<template>
  <div class="word-container">
    <div
      class="word-container-inner"
      :style="{
        height: containerHeight,
        overflowY: containerHeight !== 'auto' ? 'auto' : 'visible',
      }"
    >
      <span
        v-for="word in filteredWords"
        :key="word['Name Words']"
        :class="[
          'word',
          {
            wordhighlight: (activeWords || []).some(
              (activeWord) =>
                activeWord?.toLowerCase() === word['Name Words']?.toLowerCase()
            ),
          },
        ]"
        :style="{
          fontSize: `${word['Store Count'] * fontSizeMultiplier}px`,
          zIndex: 1,
        }"
        @mouseover="showTooltip(word['Store Count'], $event)"
        @mousemove="moveTooltip($event)"
        @mouseleave="hideTooltip"
      >
        {{ word["Name Words"] }}
      </span>
    </div>
    <div
      v-if="tooltipVisible"
      class="tooltip"
      :style="{
        top: `${tooltipPosition.y}px`,
        left: `${tooltipPosition.x}px`,
        position: 'fixed',
      }"
    >
      {{ tooltipContent }}
    </div>
    <img src="img/shelf.svg" width="100%" style="margin-top: -4%; z-index: 0" />
  </div>
</template>

<script>
import { RiTa } from "rita";

export default {
  name: "TextualShelf",
  props: {
    jsonData: {
      type: Array,
      required: true,
    },
    activeTitle: {
      type: [String, Array],
      required: false, // Make it optional
      default: null,
    },
    fontSizeMultiplier: {
      type: Number,
      required: false,
      default: 0.5,
    },
    minStoreCount: {
      type: Number,
      required: false,
      default: 10,
    },
    containerHeight: {
      type: [String, Number],
      required: false,
      default: "auto",
    },
  },
  data() {
    return {
      tooltipVisible: false,
      tooltipContent: "",
      tooltipPosition: { x: 0, y: 0 },
    };
  },
  methods: {
    showTooltip(content, event) {
      this.tooltipContent = `${content}`;
      this.tooltipVisible = true;
      this.moveTooltip(event); // Update position immediately
    },
    moveTooltip(event) {
      this.tooltipPosition = {
        x: event.clientX + 10, // Add some offset to avoid overlapping
        y: event.clientY + 10,
      };
    },
    hideTooltip() {
      this.tooltipVisible = false;
    },
  },
  computed: {
    filteredWords() {
      const wordCounts = {};
      const excludedWords = [
        "grill",
        "ave",
        "blvd",
        "road",
        "st",
        "street",
        "avenue",
        "wholesome",
        "minimarket",
        "minimart",
        "market",
        "markets",
        "st",
        "street",
        "deligrocery",
        "mrkt",
        "mkt",
        "grcy",
        "deligrcy",
        "fruit",
        "fruits",
        "vegetable",
        "vegetables",
        "meat",
        "seafood",
        "candy",
        "smoke",
        "tabaco",
        "juice",
        "bagel",
        "bagels",
        "cafe",
        "cstore",
        "carniceria", // butcher shop in Spanish
      ];

      this.jsonData?.forEach((item) => {
        if (item.words) {
          const isChain = item.chain;
          const uniqueWords = new Set(item.words); // Use a Set to ensure unique words for chains

          uniqueWords.forEach((word) => {
            if (
              !RiTa.isStopWord(word) &&
              !excludedWords.includes(word.toLowerCase()) &&
              !(word.length === 1 && isNaN(word)) && // Exclude single alphabets
              !isChain // Exclude chain stores
            ) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
          });
        }
      });

      return Object.entries(wordCounts)
        .filter(([, count]) => count >= this.minStoreCount)
        .map(([word, count]) => ({
          "Name Words": word,
          "Store Count": count,
        }))
        .sort((a, b) => b["Store Count"] - a["Store Count"]);
    },
    activeWords() {
      if (!this.activeTitle) {
        return [];
      }

      // Normalize activeTitle to an array
      const activeTitles = Array.isArray(this.activeTitle)
        ? this.activeTitle
        : [this.activeTitle];

      const wordGroups = {
        la: [
          "la",
          "el",
          "los",
          "las",
          "de",
          "del",
          "san",
          "mi",
          "al",
          "glatt",
          "hermanos",
          "bodega",
        ],
        new: ["new", "york", "ny", "nyc", "big", "apple"],
        fresh: [
          "fresh",
          "green",
          "organic",
          "natural",
          "farm",
          "farms",
          "farmer",
          "farmers",
          "healthy",
          "health",
          "farmer",
          "farmers",
          "garden",
        ],
        stop: [
          "stop",
          "express",
          "fast",
          "convenient",
          "quick",
          "go",
          "grab",
          "spot",
          "quick",
          "ez",
          "easy",
          "onestop",
          "mobil",
          "nostand",
        ],
        star: [
          "star",
          "super",
          "best",
          "top",
          "great",
          "finest",
          "moon",
          "luna",
          "sun",
          "sunny",
          "sunrise",
          "sunset",
        ],
        lucky: ["lucky", "happy", "famous"],
        halal: [
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
          "asian",
          "european",
          "jamaica",
          "usa",
        ],
        family: [
          "family",
          "families",
          "familia",
          "brothers",
          "bro",
          "brother",
          "bros",
          "son",
          "hermanos",
          "mr",
          "friend",
          "friends",
        ],
      };

      // Check if activeTitle matches a key in wordGroups
      const groupWords = wordGroups[this.activeTitle?.toLowerCase()];
      if (groupWords) {
        return groupWords;
      }

      // Otherwise, return the normalized activeTitles
      return activeTitles.map((title) => title.toLowerCase());
    },
    selectedWord() {
      return this.activeTitle;
    },
  },
};
</script>

<style scoped>
.word-container,
.word-container-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  align-items: flex-end;
}

.word {
  display: inline-block;
  margin: 0.1rem;
  color: black;
  background-color: white;
  text-transform: uppercase;
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
  line-height: 100%;
  padding: 0.1em 0.2em;
}

.word:hover {
  font-weight: bold;
  border: 2px solid black;
}

.tooltip {
  background-color: black;
  color: white;
  text-align: center;
  padding: 0.4em 0.6em;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none; /* Prevent tooltip from interfering with mouse events */
  transition: opacity 0.2s ease-in-out;
  font-family: "Skew VF";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
}

.wordhighlight {
  background-color: yellow;
  font-weight: bold;
  border: 2px solid black;
}
</style>
