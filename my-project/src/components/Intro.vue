<template>
  <div class="intro">
    <p class="textbox">{{ text }}</p>
    <!-- <p class="textbox">
      If you live in the city, going to the grocery store is a part of
      life—whether you enjoy it or not. But have you ever really looked at the
      signs? Noticed something unusual? Felt drawn to one in particular? These
      signs tell a story more than you think.
    </p>
    <p class="textbox">
      For me, exploring grocery stores is a way to understand a place, what
      people eat and how they live. In NYC, there are over 10,000 grocery
      stores, each reflecting different foods, cuisines, and cultures. What do
      they reveal about the people here?<br />
      Let’s take a closer look.
    </p> -->
  </div>
</template>

<script>
export default {
  name: "IntroSection",
  props: {
    text: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.intro {
  height: 50vh;
}
</style>
