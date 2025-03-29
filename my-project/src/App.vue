<template>
  <img alt="title" src="./assets/title.png" width="100%" />
  <Intro
    text="If you live in the city, going to the grocery store is a part of
      life—whether you enjoy it or not. But have you ever really looked at the
      signs? Noticed something unusual? Felt drawn to one in particular? These
      signs tell a story more than you think."
  />
  <img src="./assets/basket.svg" />
</template>

<script>
import Intro from "./components/Intro.vue";

export default {
  name: "App",
  components: {
    Intro,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
.textbox {
  font-size: 16px;
  line-height: 1.5;
  margin: 10% auto;
  width: 400px;
}
</style>
