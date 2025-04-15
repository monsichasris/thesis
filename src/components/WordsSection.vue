<template>
  <h1>NAMES</h1>
  <p>
    What we see in the words when we split all names that not generic like
    store, market, deli etc.
  </p>
  <p>
    The size show how repeated the word is in the dataset. The bigger the word,
    the more common it is.
  </p>
  <div class="word-container">
    <span
      v-for="word in filteredWords"
      :key="word['Name Words']"
      :style="{ fontSize: `${word['Store Count'] * 0.6}px` }"
      class="word"
    >
      {{ word["Name Words"] }}
    </span>
  </div>
  <h2>NEW</h2>
  <p>
    Of couse it's in New York we can see the word new first, but not only new
    for new york - Form 162 stores only 18 is New York.
  </p>
  <div class="word-container">
    <ul>
      <li v-for="item in processedWords" :key="item.word">
        {{ item.word }}: {{ item.count }}
      </li>
    </ul>
  </div>

  <h2>FRESH</h2>
  <p>
    Even if Americans are not so much into fresh food, we can see that the word
    fresh, green, farm, organic, natural in the top of the list are used in the
    names of stores. - healthy over tasty only few names promote tasty or
    delicious
  </p>

  <h2>STOP</h2>
  <p>
    Another group of word that reflect the culture of the city. Stop, Express.
    Fast and convinient compare to the word like big, grand, empoium
  </p>

  <h2>STAR</h2>
  <p>
    Star, Super, Best, Top, Great. The words that show the quality of the
    product. The words that are used in the names of stores. And star is use
    over the moon or sun!
  </p>

  <h2>Lucky</h2>
  <p>The word lucky have been use over other adj like happy</p>

  <h2>Nationality/Religion</h2>

  <h2>Mr. Bro</h2>
</template>

<script>
export default {
  name: "WordsSection",
  props: {
    jsonData: {
      type: Array,
      required: false, // Optional if jsonData might be null initially
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
  width: 80%;
  padding: 80px 0;
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
</style>
