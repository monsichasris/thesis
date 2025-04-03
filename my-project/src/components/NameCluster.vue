<template>
  <div>
    <h1>Groups of DBA Names</h1>

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

    <!-- Toggle Buttons -->
    <button @click="setView('words')">Shared Words View</button>
    <button @click="setView('counties')">Counties View</button>

    <!-- Shared Words Chart -->
    <div v-if="groups.length && currentView === 'words'">
      <svg ref="bubbleChart" width="800" height="600"></svg>
    </div>

    <!-- Counties Chart -->
    <div v-if="countyGroups.length && currentView === 'counties'">
      <svg ref="bubbleChart" width="800" height="600"></svg>
    </div>

    <p v-else>No groups found</p>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "NameCluster",
  props: ["csvData"], // Accept csvData as a prop
  data() {
    return {
      groups: [], // Store groups of names with shared words
      countyGroups: [], // Store groups of names by county
      currentView: "words", // Default view
      state: {
        data: [], // Chart data
        groupBy: {
          menu: ["name", "font", "colors"], // Grouping options
          selected: "name", // Default grouping option
        },
      },
    };
  },
  watch: {
    currentView(newView) {
      this.$nextTick(() => {
        if (newView === "words" && this.groups.length) {
          this.createBubbleChart();
        } else if (newView === "counties" && this.countyGroups.length) {
          this.createCountyBubbleChart();
        }
      });
    },
    csvData(newData) {
      if (newData) this.processCSV(newData); // Process CSV when data changes
    },
    groups(newGroups) {
      if (newGroups.length && this.currentView === "words") {
        this.$nextTick(() => {
          this.createBubbleChart();
        });
      }
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
    async processCSV(csvText) {
      // console.log("processCSV called with data:", csvText);
      if (!csvText) {
        console.error("Empty or invalid CSV data");
        return;
      }

      const rows = csvText.split(/\r?\n/).map((row) => row.split(","));
      const header = rows[0];
      const dbaIndex = header.indexOf("DBA Name");
      const countyIndex = header.indexOf("County");

      const wordMap = {}; // Map to store names by words
      const countyMap = {}; // Map to store names by county

      for (let i = 1; i < rows.length; i++) {
        const name = rows[i][dbaIndex]?.trim();
        const county = rows[i][countyIndex]?.trim();

        if (name && county) {
          const words = name.split(/[\s&]+/).map((word) => word.toLowerCase());

          // Populate wordMap for shared words
          for (const word of words) {
            const isNumber = !isNaN(word); // Check if the word is a number
            const key = isNumber ? "numbers" : word; // Use "numbers" as the key for all numeric words

            if (!wordMap[key]) {
              wordMap[key] = [];
            }
            wordMap[key].push(name);
          }

          // Populate countyMap for counties
          if (!countyMap[county]) {
            countyMap[county] = [];
          }
          countyMap[county].push(name);
        }
      }

      // Populate groups
      const groups = Object.entries(wordMap).map(([word, names]) => ({
        sharedWord: word,
        names,
      }));

      // Populate countyGroups
      const countyGroups = Object.entries(countyMap).map(([county, names]) => ({
        county,
        children: Object.entries(
          names.reduce((acc, name) => {
            const words = name
              .split(/[\s&]+/)
              .map((word) => word.toLowerCase());
            words.forEach((word) => {
              const key = !isNaN(word) ? "numbers" : word;
              if (!acc[key]) acc[key] = [];
              acc[key].push(name);
            });
            return acc;
          }, {})
        ).map(([word, names]) => ({
          sharedWord: word,
          size: names.length,
          names,
        })),
      }));

      console.log("Final Groups:", groups);
      console.log("Final County Groups:", countyGroups);

      this.groups = [...groups];
      this.countyGroups = [...countyGroups];
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
      // Example: Prepare data grouped by colors (dummy data for now)
      this.state.data = [
        { name: "Red", size: 5 },
        { name: "Blue", size: 8 },
        { name: "Green", size: 12 },
      ];
      console.log("Data grouped by colors:", this.state.data); // Debugging
      this.createBubbleChart();
    },
    createBubbleChart() {
      const svg = d3.select(this.$refs.bubbleChart);
      svg.selectAll("*").remove(); // Clear previous chart

      const width = +svg.attr("width");
      const height = +svg.attr("height");

      // Prepare data for the bubble chart
      const data = this.groups.map((group, index) => ({
        id: index,
        name: group.sharedWord,
        size: group.names.length,
        names: group.names,
      }));
      console.log("Bubble Chart Data:", data); // Debugging

      const pack = d3.pack().size([width, height]).padding(5);

      const root = d3.hierarchy({ children: data }).sum((d) => d.size);

      const nodes = pack(root).leaves();

      const bubbles = svg
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Draw circles
      bubbles
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1);

      // Add text labels
      bubbles
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .style("font-size", (d) => Math.min(d.r / 3, 12) + "px")
        .text((d) => d.data.name);
    },
    createCountyBubbleChart() {
      const svg = d3.select(this.$refs.bubbleChart);
      svg.selectAll("*").remove(); // Clear previous chart

      const width = +svg.attr("width");
      const height = +svg.attr("height");

      // Prepare hierarchical data
      const hierarchyData = {
        children: this.countyGroups.map((group) => ({
          name: group.county,
          children: group.children.map((child) => ({
            name: child.sharedWord,
            size: child.size, // Size based on the number of names in the group
          })),
        })),
      };

      console.log("Hierarchy Data for County Bubble Chart:", hierarchyData); // Debugging

      const pack = d3.pack().size([width, height]).padding(5);

      const root = d3
        .hierarchy(hierarchyData)
        .sum((d) => d.size)
        .sort((a, b) => b.value - a.value); // Sort by size

      const nodes = pack(root).descendants();

      const bubbles = svg
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Draw circles
      bubbles
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill", (d) => (d.children ? "#ccc" : "#fff")); // Parent nodes (counties) get a different color
      // .attr("stroke", "#000")
      // .attr("stroke-width", 1);

      // Add text labels
      bubbles
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .style("font-size", (d) => Math.min(d.r / 3, 12) + "px")
        .text((d) => d.data.name); // Show county or name
    },
  },
};
</script>
