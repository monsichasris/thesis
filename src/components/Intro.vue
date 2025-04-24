<template>
  <!-- temporary img - animate later -->
  <div>
    <img src="img/title_img.png" width="80%" />
  </div>
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
      If you live in the city, going to the grocery store is a part of
      life—whether you enjoy it or not. But have you ever really looked at the
      signs? Noticed something unusual? Felt drawn to one in particular? These
      signs tell a story more than you think.
    </p>
    <!-- <img src="img/samples-img.png" style="transform: scale(0.8)" /> -->
    <p class="textbox">
      For me, exploring grocery stores is a way to understand a place, what
      people eat and how they live. In NYC, there are almost 10,000 grocery
      stores, each reflecting different foods, cuisines, and cultures. <br />
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
      These are the key elements of brand identity that shape how a store, But
      beyond branding, do these signs also reflect the anything else?
    </p>
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
