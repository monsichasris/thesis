<template>
  <div>
    <h1>Groups of DBA Names</h1>
    <button @click="setView('words')">Shared Words View</button>
    <button @click="setView('counties')">Counties View</button>

    <div v-if="groups.length && currentView === 'words'">
      <svg ref="bubbleChart" width="800" height="600"></svg>
    </div>
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
      countyGroups: [],
      currentView: "counties", // Default view
    };
  },
  watch: {
    currentView(newView) {
      console.log("Current view changed to:", newView); // Debugging
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
      console.log("Groups updated:", newGroups); // Debugging
      if (newGroups.length && this.currentView === "words") {
        this.$nextTick(() => {
          this.createBubbleChart();
        });
      }
    },
    countyGroups(newCountyGroups) {
      console.log("countyGroups updated:", newCountyGroups); // Debugging
      if (newCountyGroups.length && this.currentView === "counties") {
        this.$nextTick(() => {
          this.createCountyBubbleChart();
        });
      }
    },
  },
  methods: {
    setView(view) {
      console.log("Switching view to:", view); // Debugging
      this.currentView = view;
    },
    async processCSV(csvText) {
      console.log("processCSV called with data:", csvText);
      if (!csvText) {
        console.error("Empty or invalid CSV data");
        return;
      }

      const rows = csvText.split(/\r?\n/).map((row) => row.split(","));
      const header = rows[0];
      const dbaIndex = header.indexOf("DBA Name");
      const countyIndex = header.indexOf("County");

      // if (dbaIndex === -1) {
      //   console.error("DBA Name column not found");
      //   return;
      // }

      const wordMap = {}; // Map to store names by words
      const countyMap = {}; // Map to store names by county

      for (let i = 1; i < rows.length; i++) {
        const name = rows[i][dbaIndex]?.trim();
        const county = rows[i][countyIndex]?.trim();

        if (name && county) {
          console.log(`Processing name: ${name}, County: ${county}`); // Debugging

          // Group by words
          const words = name.split(/[\s&]+/).map((word) => word.toLowerCase());
          for (const word of words) {
            const isNumber = !isNaN(word); // Check if the word is a number
            const key = isNumber ? "numbers" : word; // Use "numbers" as the key for all numeric words

            if (!wordMap[key]) {
              wordMap[key] = [];
            }
            wordMap[key].push(name);
          }

          // Group by county
          if (!countyMap[county]) {
            countyMap[county] = [];
          }
          countyMap[county].push(name);
        }
      }
      // console.log("Word Map:", wordMap); // Debugging
      // console.log("County Map:", countyMap); // Debugging

      // Group names by shared words
      const groups = [];
      const processedNames = new Set();

      for (const [word, names] of Object.entries(wordMap)) {
        const group = {
          names: [],
          sharedWord: word,
        };

        for (const name of names) {
          if (!processedNames.has(name)) {
            group.names.push(name);
            processedNames.add(name);
          }
        }

        if (group.names.length > 1) {
          groups.push(group);
        }
      }

      // Group names by county
      const countyGroups = Object.entries(countyMap).map(([county, names]) => ({
        county,
        names,
        size: names.length,
      }));
      console.log("Final Groups:", groups); // Debugging
      console.log("Final County Groups:", countyGroups); // Debugging

      this.groups = [...groups]; // For shared words
      this.countyGroups = [...countyGroups]; // For counties
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
          size: group.size,
          children: group.names.map((name) => ({
            name,
            size: 1, // Each name gets a size of 1
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
        .text((d) => (d.children ? d.data.name : d.data.name)); // Show county or name
    },
  },
};
</script>
