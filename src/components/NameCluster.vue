<template>
  <div>
    <h1>Groups</h1>

    <!-- Dropdown for Grouping Options -->
    <label for="groupBy">Group By:</label>
    <select id="groupBy" v-model="state.groupBy.selected" @change="updateChart">
      <option
        v-for="option in state.groupBy.menu"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>
    </select>

    <!-- Neighborhood Chart -->
    <div
      v-if="countyGroups.length && currentView === 'counties'"
      ref="wordCloudContainer"
      class="word-cloud-grid"
    ></div>

    <!-- Modal for Neighborhood Names -->
    <div v-if="selectedNeighborhood" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ selectedNeighborhood.county }}</h2>
        <ul>
          <li v-for="name in selectedNeighborhood.names" :key="name">
            {{ name }}
          </li>
        </ul>
        <button @click="closeModal">Close</button>
      </div>
    </div>

    <p v-else>No groups found</p>
  </div>
</template>

<script>
import * as d3 from "d3";
import cloud from "d3-cloud";
import { RiTa } from "rita";
// import { Vibrant } from "node-vibrant/node";
import { Vibrant } from "node-vibrant/browser";
// import { Vibrant } from "node-vibrant/worker";

export default {
  name: "NameCluster",
  props: ["csvData"], // Accept csvData as a prop
  data() {
    return {
      groups: [],
      countyGroups: [],
      currentView: "counties",
      state: {
        data: [], // Chart data
        groupBy: {
          menu: ["name", "font", "colors"], // Grouping options
          selected: "name", // Default grouping option
        },
      },
      synonymCache: {},
      selectedNeighborhood: null,
    };
  },
  watch: {
    currentView(newView) {
      if (newView === "counties" && this.countyGroups.length) {
        this.$nextTick(() => {
          this.createCountyBubbleChart();
        });
      }
    },
    csvData(newData) {
      if (newData) this.processCSV(newData); // Process CSV when data changes
    },
    countyGroups(newCountyGroups) {
      if (newCountyGroups.length && this.currentView === "counties") {
        this.$nextTick(() => {
          this.createCountyBubbleChart();
        });
      }
    },
  },
  methods: {
    setView(view) {
      this.currentView = view;
    },
    updateChart() {
      console.log("Grouping by:", this.state.groupBy.selected); // Debugging
      if (this.state.groupBy.selected === "name") {
        this.prepareDataByName();
      } else if (this.state.groupBy.selected === "font") {
        this.prepareDataByFont();
      } else if (this.state.groupBy.selected === "colors") {
        this.prepareDataByColors();
      }
    },
    async fetchSynonyms(word) {
      if (this.synonymCache[word]) {
        return this.synonymCache[word];
      }
      try {
        const response = await fetch(
          `https://api.datamuse.com/words?rel_spc=${word}`
        );
        const data = await response.json();
        const synonyms = data.map((item) => item.word);
        this.synonymCache[word] = synonyms; // Cache the result
        return synonyms;
      } catch (error) {
        console.error(`Error fetching synonyms for "${word}":`, error);
        return [];
      }
    },
    async processSharedWords(name, map) {
      const words = RiTa.tokenize(name.toLowerCase());
      const excludedWords = [
        "grocery",
        "groceries",
        "deli",
        "gourmet",
        "supermarket",
        "market",
        "marketplace",
        "food",
        "minimart",
        "mini",
        "mart",
        "store",
        "shop",
      ];

      for (const word of words) {
        // Skip if the word is a stop word or in the excludedWords array
        if (RiTa.isStopWord(word) || excludedWords.includes(word)) {
          continue;
        }

        // Fetch synonyms for the word
        const synonyms = await this.fetchSynonyms(word);

        // Use the original word as the key and include synonyms in the group
        const key = word; // Keep the original word as the key

        if (!map[key]) {
          map[key] = { names: [], synonyms: [] };
        }

        // Add the name to the group
        map[key].names.push(name);

        // Add synonyms to the group (avoid duplicates)
        map[key].synonyms = [...new Set([...map[key].synonyms, ...synonyms])];
      }
    },
    async processCSV(csvText) {
      // console.log("processCSV called with data:", csvText);
      if (!csvText) {
        console.error("Empty or invalid CSV data");
        return;
      }

      const rows = csvText.split(/\r?\n/).map((row) => row.split(","));
      const header = rows[0];
      const dbaIndex = header.indexOf("Normalized DBA Name");
      const neighborhoodIndex = header.indexOf("Neighborhood");
      const countyIndex = header.indexOf("County"); // Use County for images
      const chainStoreIndex = header.indexOf("Is Chain Store");
      const licenseIndex = header.indexOf("License Number");

      const wordMap = {}; // Map to store names by words
      const countyMap = {}; // Map to store names by county
      const seenChainStores = new Set(); // Set to track unique chain stores
      const colorMap = {}; // Map to store colors by county and license

      for (let i = 1; i < rows.length; i++) {
        const name = rows[i][dbaIndex]?.trim();
        const neighborhood = rows[i][neighborhoodIndex]?.trim(); // Use Neighborhood for grouping
        const county = rows[i][countyIndex]?.trim(); // Use County for images
        const license = rows[i][licenseIndex]?.trim();
        const isChainStore =
          rows[i][chainStoreIndex]?.trim().toLowerCase() === "yes";

        // If it's a chain store and already counted, skip it
        if (isChainStore && seenChainStores.has(name)) continue;

        // Mark chain store as seen
        if (isChainStore) seenChainStores.add(name);

        if (name && neighborhood && county && license) {
          // Populate wordMap for shared words
          await this.processSharedWords(name, wordMap);

          // Populate countyMap for counties
          if (!countyMap[neighborhood]) {
            countyMap[neighborhood] = {};
          }
          await this.processSharedWords(name, countyMap[neighborhood]);

          // Extract colors from the image
          const imagePath = `/street_view_images/${county}/${license}.jpg`;
          console.log("Processing image:", imagePath);
          const colors = await this.extractColors(imagePath);

          if (!colorMap[county]) {
            colorMap[county] = {};
          }
          colorMap[county][license] = colors;
        }
      }

      // Populate groups
      const groups = Object.entries(wordMap).map(([word, data]) => ({
        sharedWord: word,
        names: data.names,
        synonyms: data.synonyms,
      }));

      // Populate countyGroups
      const countyGroups = Object.entries(countyMap).map(
        ([neighborhood, words]) => ({
          county: neighborhood, // Group by Neighborhood
          children: Object.entries(words).map(([word, data]) => ({
            sharedWord: word,
            size: data.names.length,
            names: data.names,
            synonyms: data.synonyms,
          })),
        })
      );

      // console.log("Final Groups:", groups);
      console.log("Final County Groups:", countyGroups);
      console.log("Final Color Map:", colorMap);

      this.groups = [...groups];
      this.countyGroups = [...countyGroups];
      this.colorMap = colorMap;
    },
    async extractColors(imagePath) {
      try {
        const palette = await Vibrant.from(imagePath).getPalette();
        return Object.values(palette)
          .filter((swatch) => swatch) // Filter out null swatches
          .map((swatch) => swatch.getHex()); // Get hex color values
      } catch (error) {
        console.error(`Error extracting colors from ${imagePath}:`, error);
        return []; // Return an empty array if there's an error
      }
    },
    async testExtractColors() {
      const testImagePath = "./street_view_images/KINGS/610009.jpg";
      console.log("Testing image path:", testImagePath);
      const colors = await this.extractColors(testImagePath);
      console.log("Extracted colors:", colors);
    },
    mounted() {
      this.testExtractColors();
    },
    showNeighborhoodNames(neighborhood) {
      console.log("Neighborhood clicked:", neighborhood.county);

      const uniqueNames = [...new Set(neighborhood.names)];

      // Ensure synonyms are extracted correctly
      const synonyms = neighborhood.words
        ? neighborhood.words.flatMap((word) => word.text)
        : [];

      // Display the names in a dedicated section
      this.selectedNeighborhood = {
        county: neighborhood.county,
        names: uniqueNames,
        synonyms: synonyms,
      };
    },
    closeModal() {
      this.selectedNeighborhood = null;
    },
    prepareDataByName() {
      console.log("Preparing data grouped by name...");
      this.state.data = this.groups.map((group) => ({
        name: group.sharedWord,
        size: group.names.length,
      }));
      console.log("Data grouped by name:", this.state.data);
      this.createBubbleChart();
    },
    prepareDataByFont() {
      // Example: Prepare data grouped by font (dummy data for now)
      this.state.data = [
        { name: "Arial", size: 10 },
        { name: "Helvetica", size: 15 },
        { name: "Times New Roman", size: 20 },
      ];
      console.log("Data grouped by font:", this.state.data); // Debugging
      this.createBubbleChart();
    },
    prepareDataByColors() {
      this.state.data = this.countyGroups.map((group) => ({
        county: group.county,
        colors: group.children.flatMap(
          (child) => this.colorMap[group.county][child.sharedWord] || []
        ),
      }));
      console.log("Data grouped by colors:", this.state.data);
      this.createColorChart();
    },
    createCountyBubbleChart() {
      const container = d3.select(this.$refs.wordCloudContainer);
      container.selectAll("*").remove(); // Clear previous word clouds

      // Prepare data for each neighborhood
      const neighborhoods = this.countyGroups.map((group) => ({
        county: group.county,
        words: group.children.map((child) => ({
          text: child.sharedWord,
          size: child.size * 10, // Scale size for better visualization
        })),
        names: group.children.flatMap((child) => child.names),
      }));

      // Set up grid layout
      const cellWidth = Math.floor(
        (this.$refs.wordCloudContainer.clientWidth - 16) / 5
      );
      const cellHeight = cellWidth;
      // Create an SVG for each neighborhood
      neighborhoods.forEach((neighborhood) => {
        const svg = container
          .append("svg")
          .attr("width", cellWidth)
          .attr("height", cellHeight)
          .style("border", "1px solid #ccc")
          .style("margin", "0")
          .on("click", () => {
            this.showNeighborhoodNames(neighborhood); // Call the method to display names
          });

        // Add neighborhood name at the top of the cell
        svg
          .append("text")
          .attr("x", cellWidth / 2) // Center the text horizontally
          .attr("y", 20) // Position the text at the top
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("font-weight", "bold")
          .text(neighborhood.county);

        // Generate word cloud for the neighborhood
        const layout = cloud()
          .size([cellWidth, cellHeight])
          .words(neighborhood.words)
          .padding(5)
          .rotate(() => (Math.random() > 0.5 ? 0 : 90)) // Random rotation
          .fontSize((d) => d.size)
          .on("end", (words) => {
            svg
              .append("g")
              .attr(
                "transform",
                `translate(${cellWidth / 2}, ${cellHeight / 2})`
              )
              .selectAll("text")
              .data(words)
              .enter()
              .append("text")
              .style("font-size", (d) => `${d.size}px`)
              .style("fill", "#000")
              .attr("text-anchor", "middle")
              .attr(
                "transform",
                (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`
              )
              .text((d) => d.text);
          });

        layout.start();
      });
    },
    createColorChart() {
      const container = d3.select(this.$refs.wordCloudContainer);
      container.selectAll("*").remove(); // Clear previous charts

      this.state.data.forEach((neighborhood) => {
        const div = container
          .append("div")
          .style("margin", "10px")
          .style("border", "1px solid #ccc")
          .style("padding", "10px");

        div.append("h3").text(neighborhood.county);

        const colorContainer = div
          .append("div")
          .style("display", "flex")
          .style("flex-wrap", "wrap")
          .style("gap", "10px");

        neighborhood.colors.forEach((color) => {
          colorContainer
            .append("div")
            .style("width", "50px")
            .style("height", "50px")
            .style("background-color", color)
            .style("border", "1px solid #000");
        });
      });
    },
  },
};
</script>

<style>
.word-cloud-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box; /* Include padding and border in the width calculation */
  overflow: hidden; /* Prevent overflow */
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 80%;
  overflow-y: auto; /* Scroll if content is too long */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-top: 0;
  font-size: 20px;
  font-weight: bold;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.modal-content li {
  margin: 5px 0;
  font-size: 14px;
}

.modal-content button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #0056b3;
}
</style>
