<template>
  <div style="display: flex; flex-direction: column; height: 100vh">
    <div class="textbox">
      Each neighborhood has its own identity, shaped by the people who live
      there. You can see it in the grocery stores they visit, the food they eat,
      the design of their storefronts featured in this project, and the everyday
      details of life. Grocery store signs are just one piece of the
      puzzle—there are more stories waiting to be discovered out there.
    </div>
    <img src="img/cashier.png" width="100%" style="margin: auto" />
  </div>
  <div class="foot">
    <a>Monsicha Srisuantang</a>
    <a>MS Data Visualization, Parsons School of Design, The New School</a>
  </div>
</template>

<script>
export default {
  name: "OutroSection",
  props: {
    text: String,
  },
};
</script>

<style scoped>
.foot {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 24px;
}
</style>
