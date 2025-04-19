<template>
  <div class="split-layout">
    <!-- left section: words -->
    <div class="sticky-left">
      <h1>TEXTUAL</h1>
      <p>
        What we see in the words when we split all names that not generic like
        store, market, deli etc.
      </p>
      <p>
        The size show how repeated the word is in the dataset. The bigger the
        word, the more common it is.
      </p>
      <div class="word-container">
        <span
          v-for="word in filteredWords"
          :key="word['Name Words']"
          :class="[
            'word',
            {
              wordhighlight: (activeWords || []).includes(
                word['Name Words'].toLowerCase()
              ),
            },
          ]"
          :style="{ fontSize: `${word['Store Count'] * 0.6}px` }"
        >
          {{ word["Name Words"] }}
        </span>
      </div>
    </div>

    <!-- right section: text -->
    <div class="scroll-right">
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
import scrollama from "scrollama";
export default {
  name: "WordsSection",
  props: {
    jsonData: {
      type: Array,
      required: false, // Optional if jsonData might be null initially
    },
  },
  data() {
    return {
      activeWords: [],
      scroller: null,
    };
  },
  watch: {
    jsonData(newVal) {
      if (newVal && newVal.length > 0) {
        this.initScrollama();
      }
    },
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
      // Exclude words with specific "Group Name" values and filter by "Store Count"
      const excludedGroups = [
        "generic",
        "alphabet",
        "direction",
        "number",
        "digit",
        "latin word",
      ];
      return (
        this.jsonData?.filter(
          (word) =>
            word["Store Count"] > 10 && // Only include words with "Store Count" > 10
            !excludedGroups.includes(word["Group Name"]) // Exclude specific "Group Name" values
        ) || []
      );
    },
    wordStartingWithNew() {
      return (
        this.processedWords.find((word) => word["Name Words"] === "new") || null
      );
    },
    processedWords() {
      if (!this.jsonData) return [];

      // Find the entry where "Name Words" is "new"
      const newEntry = this.jsonData.find(
        (word) => word["Name Words"] === "new"
      );
      if (!newEntry || !newEntry["Store Names"]) return [];

      const wordCounts = {};

      // Process each store name in the "Store Names" list
      newEntry["Store Names"].forEach((storeName) => {
        const words = storeName.split(" "); // Split the store name into words
        const newIndex = words.findIndex(
          (word) => word.toLowerCase() === "new"
        ); // Find "new"
        if (newIndex !== -1 && newIndex + 1 < words.length) {
          const nextWord = words[newIndex + 1].toLowerCase(); // Get the word after "new"
          wordCounts[nextWord] = (wordCounts[nextWord] || 0) + 1; // Count occurrences
        }
      });

      // Filter words that repeat more than 10 times
      return Object.entries(wordCounts)
        .filter(([_, count]) => count > 1) // eslint-disable-line no-unused-vars
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
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  align-items: self-start;
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
