<template>
  <div class="split-layout">
    <div class="sticky-left">
      <div class="word-container">
        <span
          v-for="word in filteredWords"
          :key="word['Name Words']"
          :class="[
            'word',
            {
              wordhighlight: (activeWords || []).some(
                (activeWord) =>
                  activeWord?.toLowerCase() ===
                  word['Name Words']?.toLowerCase()
              ),
            },
          ]"
          :style="{ fontSize: `${word['Store Count'] * 0.3}px` }"
        >
          {{ word["Name Words"] }}
        </span>
      </div>
      <ImageCluster :jsonData="jsonData" :selectedWord="selectedWord" />
      <div style="height: 100vh; position: sticky; top: 0">
        <img
          src="img/basket.svg"
          width="100%"
          style="
            position: absolute;
            transform: translate(-50%, 0%);
            bottom: 0;
            left: 50%;
            z-index: -1;
          "
        />
      </div>
    </div>

    <div class="scroll-right">
      <div class="highlight">
        <h1>TEXTUAL</h1>
        <p>
          What we see in the words when we split all names that not generic like
          store, market, deli etc. The size show how repeated the word is in the
          dataset. The bigger the word, the more common it is.
        </p>
      </div>

      <div class="highlight">
        <h2>NEW</h2>
        <p>
          Of couse it's in New York we can see the word new first, but not only
          new for new york - Form 162 stores only 18 is New York.
        </p>
        <div class="word-container">
          <span v-for="item in processedWords" :key="item.word" class="word">
            {{ item.word }} {{ item.count }}
          </span>
        </div>
      </div>

      <div class="highlight">
        <h2>FRESH</h2>
        <p>
          Even if Americans are not so much into fresh food, we can see that the
          word fresh, green, farm, organic, natural in the top of the list are
          used in the names of stores. - healthy over tasty only few names
          promote tasty or delicious
        </p>
      </div>

      <div class="highlight">
        <h2>STOP</h2>
        <p>
          Another group of word that reflect the culture of the city. Stop,
          Express. Fast and convinient compare to the word like big, grand,
          empoium
        </p>
      </div>

      <div class="highlight">
        <h2>STAR</h2>
        <p>
          Star, Super, Best, Top, Great. The words that show the quality of the
          product. The words that are used in the names of stores. And star is
          use over the moon or sun!
        </p>
      </div>

      <div class="highlight">
        <h2>Lucky</h2>
        <p>The word lucky have been use over other adj like happy</p>
      </div>

      <div class="highlight">
        <h2>Nationality</h2>
        <p>
          Beside the street name of the location a lot of store name show
          Nationality of the food or Religion related
        </p>
      </div>

      <div class="highlight">
        <h2>Mr</h2>
        <p>Bro, Brother, Bros, Bro's. Son Mr. Word represent men</p>
      </div>
    </div>
  </div>
</template>

<script>
import ImageCluster from "./ImageCluster.vue";
import scrollama from "scrollama";
import { RiTa } from "rita";

export default {
  components: { ImageCluster },
  name: "WordsSection",
  props: {
    jsonData: {
      type: Array,
      required: false, // Optional if jsonData might be null initially
    },
  },

  watch: {
    jsonData(newVal) {
      if (newVal && newVal.length > 0) {
        this.initScrollama();
      }
    },
    activeWords(newVal) {
      if (newVal && newVal.length > 0) {
        this.selectedWord = newVal[0]; // Set the first active word as the selected word
        console.log(
          "Updated selectedWord based on activeWords:",
          this.selectedWord
        );
      } else {
        this.selectedWord = null; // Clear selectedWord if no active words
      }
    },
  },
  data() {
    return {
      activeWords: [],
      scroller: null,
      selectedWord: "new",
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
          const title = element
            .querySelector("h2")
            ?.textContent?.toLowerCase()
            .trim();
          if (!title) {
            console.warn("Title is undefined or empty");
            return;
          }

          // Define custom word groups
          const wordGroups = {
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
            stop: [
              "stop",
              "express",
              "fast",
              "convenient",
              "quick",
              "go",
              "grab",
            ],
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
              "USA",
            ],
            mr: ["brothers", "bro", "brother", "bros", "son", "mr"],
          };

          this.activeWords = wordGroups[title] || [title]; // fallback to single-word array
        })
        .onStepExit(({ element, direction }) => {
          const title = element.querySelector("h2")?.textContent?.toLowerCase();
          if (title && this.activeWord === title.trim() && direction === "up") {
            this.activeWord = null;
          }
        });
    },
  },
  computed: {
    filteredWords() {
      // Extract words and their counts from main_df.json
      const wordCounts = {};
      const excludedWords = [
        "grill",
        "la",
        "el",
        "ave",
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

      console.log("Filtered words:", wordCounts);

      // Convert wordCounts to an array and filter by count
      return Object.entries(wordCounts)
        .filter(([, count]) => count > 15) // Only include words with count > 10
        .map(([word, count]) => ({
          "Name Words": word,
          "Store Count": count,
        }))
        .sort((a, b) => b["Store Count"] - a["Store Count"]); // Sort by count descending;
    },
    wordStartingWithNew() {
      return (
        this.processedWords.find((word) => word["Name Words"] === "new") || null
      );
    },
    processedWords() {
      if (!this.jsonData) return [];

      // Extract words starting with "new" from main_df.json
      const wordCounts = {};

      this.jsonData?.forEach((item) => {
        if (item.words) {
          const newIndex = item.words.findIndex((word) => word === "new");
          if (newIndex !== -1 && newIndex + 1 < item.words.length) {
            const nextWord = item.words[newIndex + 1];
            wordCounts[nextWord] = (wordCounts[nextWord] || 0) + 1;
          }
        }
      });

      // Filter words that repeat more than once
      return Object.entries(wordCounts)
        .filter(([, count]) => count > 1)
        .map(([word, count]) => ({
          word,
          count,
        }));
    },
  },
};
</script>

<style>
.word-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  align-items: self-end;
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
