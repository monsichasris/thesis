<template>
  <div>
    <h1>Groups of DBA Names with Similar Meanings</h1>
    <div v-if="Object.keys(groups).length">
      <div v-for="(group, index) in groups" :key="index" class="group">
        <h2>Group {{ index + 1 }}</h2>
        <h3>Shared Synonyms: {{ group.sharedSynonyms.join(", ") }}</h3>
        <p>Names: {{ group.names.join(", ") }}</p>
      </div>
    </div>
    <p v-else>No groups found</p>
  </div>
</template>

<script>
export default {
  name: "NameCluster",
  props: ["csvData"], // Accept csvData as a prop
  data() {
    return {
      groups: {},
    };
  },
  watch: {
    csvData(newData) {
      if (newData) this.processCSV(newData);
    },
  },
  methods: {
    async fetchSynonyms(word) {
      try {
        const response = await fetch(
          `https://api.datamuse.com/words?ml=${word}`
        );
        const data = await response.json();
        return data.map((item) => item.word);
      } catch (error) {
        console.error(`Error fetching synonyms for "${word}":`, error);
        return [];
      }
    },

    async processCSV(csvText) {
      if (!csvText) {
        console.error("Empty or invalid CSV data");
        return;
      }
      const rows = csvText.split(/\r?\n/).map((row) => row.split(","));
      const header = rows[0];
      const dbaIndex = header.indexOf("DBA Name");

      if (dbaIndex === -1) {
        console.error("DBA Name column not found");
        return;
      }

      const synonymsMap = {}; // Map to store synonyms for each name
      for (let i = 1; i < rows.length; i++) {
        const name = rows[i][dbaIndex]?.trim();
        if (name) {
          // console.log(`Processing name: ${name}`); // Debugging
          let words = name.split(" ");
          let synonymsList = [];

          for (let word of words) {
            const syns = await this.fetchSynonyms(word);
            // console.log(`Synonyms for "${word}":`, syns); // Debugging
            synonymsList = [...synonymsList, ...syns];
          }

          synonymsMap[name] = [...new Set(synonymsList)]; // Remove duplicates
        }
      }

      console.log("Synonyms Map:", synonymsMap); // Debugging

      // Group names by shared synonyms
      const groups = [];
      const processedNames = new Set();

      for (const [name, synonyms] of Object.entries(synonymsMap)) {
        if (processedNames.has(name)) continue;

        const group = {
          names: [name],
          sharedSynonyms: new Set(synonyms),
        };

        for (const [otherName, otherSynonyms] of Object.entries(synonymsMap)) {
          if (name === otherName || processedNames.has(otherName)) continue;

          const shared = synonyms.filter((syn) => otherSynonyms.includes(syn));
          if (shared.length > 0) {
            group.names.push(otherName);
            group.sharedSynonyms = new Set([
              ...group.sharedSynonyms,
              ...shared,
            ]);
            processedNames.add(otherName);
          }
        }
        group.sharedSynonyms = Array.from(group.sharedSynonyms); // Convert Set to Array
        groups.push(group);
        processedNames.add(name);
      }
      console.log("Final Groups:", groups); // Debugging
      this.groups = groups;
    },
  },
};
</script>
