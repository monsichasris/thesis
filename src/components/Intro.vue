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
      style="
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 1;
      "
    />
  </div>

  <MatterAnimation :images="images" />

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
      If you live in the city,<br />
      going to the
      <img src="img/gifcery.gif" alt="grocery" style="height: 40px" /> store is
      a part of life,<br />
      whether you enjoy it or not.
    </p>
    <p class="textbox">
      Exploring grocery stores is one of the ways<br />
      to understand a place and the people who live there.
    </p>
    <img src="img/people.png" style="margin-top: -80px" width="100%" />
    <p class="textbox">
      In NYC, there are almost 10,000 grocery stores, each reflecting different
      foods, cuisines, and cultures
    </p>
    <p class="textbox">
      But before you ever walk in... <br />
      have you ever really looked at the
      <b>signs</b>?<br />
      They might seem small—but they say a lot.<br /><br />
    </p>
    <p class="textbox">
      We will explore grocery store signs using store names and locations from
      New York State, along with images from Google Street View, focusing on...
    </p>
    <img
      src="img/explain-sign.svg"
      width="50%"
      style="
        margin-top: -20vh;
        transform: translate(-50%, 0%);
        margin-left: 50%;
        z-index: 0;
      "
    />
    <p class="textbox" style="margin: 50vh auto">
      These are the key elements of brand identity that shape how a store look,
      But beyond branding, these signs also reflect identity in the
      community.<br /><br />
      <!-- Let’s take a closer look. -->
    </p>
    <img
      src="img/title.svg"
      width="50%"
      style="
        margin-top: -80px;
        transform: translate(-50%, 0%);
        margin-left: 50%;
        z-index: 0;
      "
    />
    <p class="textbox" style="margin: 5vh auto 50vh auto">
      The scenery behind NYC storefront signs <br />
      <!-- by<br />
      <a href="https://monsicha.info/">Monsicha Srisuantang</a> -->
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
      container: this.$refs.lottieContainer,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/img/chevron-down.json",
    });

    // Add click event listener to the Lottie container
    this.$refs.lottieContainer.addEventListener("click", this.scrollDown);
  },
  methods: {
    loadImages() {
      // Dynamically load all images from folder
      const context = require.context(
        "/public/img/objects",
        false,
        /\.(png|jpe?g|svg)$/
      );
      return context.keys().map((key) => context(key));
    },
    scrollDown() {
      window.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
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
  cursor: pointer;
}

.textbox {
  margin: 30vh auto;
}
</style>
