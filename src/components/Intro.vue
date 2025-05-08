<template>
  <div>
    <div
      style="
        position: absolute;
        top: 0;
        left: 50%;
        top: 30%;
        transform: translateX(-50%);
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 24px;
      "
    >
      <img src="img/title.svg" width="100%" style="" />
      <div class="lottie-container" ref="lottieContainer"></div>
    </div>
    <img
      src="img/title_basket.svg"
      height="100%"
      style="position: absolute; top: 0; left: 50%; transform: translateX(-50%)"
    />
  </div>

  <MatterAnimation :basketSvg="'img/baseline.svg'" :images="images" />

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
      whether you enjoy it or not.
    </p>
    <p class="textbox">
      Exploring grocery stores is one of the ways to understand a place and the
      people who live there.
    </p>
    <img src="img/people.png" width="100%" />
    <p class="textbox">
      In NYC, there are almost 10,000 grocery stores, each reflecting different
      foods, cuisines, and cultures
    </p>
    <p class="textbox">
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
import lottie from "lottie-web";
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
  mounted() {
    lottie.loadAnimation({
      container: this.$refs.lottieContainer, // The container where the animation will be rendered
      renderer: "svg", // Render as SVG
      loop: true, // Loop the animation
      autoplay: true, // Start playing automatically
      path: "/img/chevron-down.json", // Path to your Lottie JSON file
    });
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

.lottie-container {
  width: 64px;
  height: 64px;
  margin: 0 auto;
}

.textbox {
  margin: 400px auto;
}
</style>
