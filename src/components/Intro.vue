<template>
  <div>
    <img
      src="img/title_basket.svg"
      width="80%"
      style="position: absolute; top: 0; left: 50%; transform: translateX(-50%)"
    />
  </div>

  <MatterAnimation :basketSvg="'img/baseline.svg'" :images="images" />
  <!-- <div class="title">
    <img alt="grocery signery" src="img/title.svg" width="50%" />
    <img alt="stores" src="img/stores.png" width="100%" />
    <div>
      <p class="skew subhead">Scenery Behind NYC Storefront Signs</p>
      <img alt="scroll down" src="img/chevron-down.svg" />
    </div>
  </div> -->

  <div style="height: 100vh; position: sticky; top: 0">
    <img
      src="img/stores.png"
      width="100%"
      style="
        position: absolute;
        transform: translate(-50%, 0%);
        bottom: 0;
        left: 50%;
        z-index: 1;
      "
    />
  </div>
  <div class="scroll">
    <p class="textbox">
      If you live in the city, going to the grocery store is a part of life,
      whether you enjoy it or not. <br /><br />
      Exploring grocery stores is one of the ways to understand a place and the
      people who live there. <br /><br />
      In NYC, there are almost 10,000 grocery stores, each reflecting different
      foods, cuisines, and cultures
    </p>
    <!-- <img src="img/samples-img.png" style="transform: scale(0.8)" /> -->
    <p class="textbox">
      . <br />
      But before you ever walk in... <br />
      have you ever really looked at the
      <b>signs</b>?<br />
      They might say something more than you think<br /><br />
      Let’s take a closer look.
    </p>
    <p class="textbox">What we will explore on grocery store signs</p>
    <img
      src="img/explain-sign.png"
      width="60%"
      style="
        margin-top: -320px;
        transform: translate(-50%, 0%);
        margin-left: 50%;
        z-index: 0;
      "
    />
    <p class="textbox">
      These are the key elements of brand identity that shape how a store look,
      But beyond branding, these signs also reflect identity in the community.
    </p>
  </div>
</template>

<script>
import MatterAnimation from "./MatterAnimation.vue";
export default {
  name: "IntroSection",
  components: { MatterAnimation },
  props: {
    text: String,
  },
  data() {
    return {
      images: this.loadImages(),
    };
  },
  methods: {
    loadImages() {
      // Dynamically load all images from the img/objects folder
      const context = require.context(
        "/public/img/objects",
        false,
        /\.(png|jpe?g|svg)$/
      );
      return context.keys().map((key) => context(key));
    },
  },
};
</script>

<style scoped>
.scroll {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.title {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh;
  padding-top: 10vh;
}
</style>
