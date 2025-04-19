<template>
  <div class="split-layout">
    <!-- left section: visual -->
    <div class="sticky-left">
      <h1>Visual</h1>
    </div>

    <!-- right section: text -->
    <div class="scroll-right">
      <div>
        <h2>Typography</h2>
      </div>
      <div>
        <h2>Colors</h2>
      </div>
      <div>
        <h2>Complimentary</h2>
      </div>
    </div>
  </div>
</template>

<script>
// import scrollama from "scrollama";
export default {
  name: "VisualSection",
  props: {
    jsonData: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      scroller: null,
    };
  },
};
</script>

<style scoped></style>
