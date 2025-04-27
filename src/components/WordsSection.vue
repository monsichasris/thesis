<template>
  <div class="word-container">
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
      :style="{ fontSize: `${word['Store Count'] * fontSizeMultiplier}px` }"
    >
      {{ word["Name Words"] }}
    </span>
  </div>
</template>

<script>
import { RiTa } from "rita";

export default {
  name: "WordsSection",
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
  },
  computed: {
    filteredWords() {
      const wordCounts = {};
      const excludedWords = [
        "grill",
        "ave",
        "avenue",
        "minimarket",
        "st",
        "street",
        "deligrocery",
        "mrkt",
        "mtk",
        "grcy",
      ];

      this.jsonData?.forEach((item) => {
        if (item.words) {
          const isChain = item.chain; // Check if the store is a chain
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
        return []; // Return an empty array if activeTitle is not provided
      }

      // Normalize activeTitle to an array
      const activeTitles = Array.isArray(this.activeTitle)
        ? this.activeTitle
        : [this.activeTitle];

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

      // Check if activeTitle matches a key in wordGroups
      const groupWords = wordGroups[this.activeTitle?.toLowerCase()];
      if (groupWords) {
        return groupWords; // Return the group of words if it exists
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
.word-container {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  align-items: self-end;
  border-bottom: 4px solid black;
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
  cursor: pointer;
}

.wordhighlight {
  background-color: yellow;
  font-weight: bold;
  border: 2px solid black;
}
</style>
