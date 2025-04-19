<template>
  <div style="display: flex; flex-direction: column; height: 100vh">
    <div style="flex-grow: 1">
      <p>Thank you!</p>
    </div>
    <div>
      <img src="img/stores.png" width="100%" style="margin: auto" />
    </div>
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
div {
  height: 100vh;
}
</style>
