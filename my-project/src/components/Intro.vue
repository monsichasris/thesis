<template>
  <div style="height: 100vh; position: sticky; top: 0">
    <img
      src="img/basket.svg"
      style="
        position: absolute;
        transform: translate(-50%, 0%);
        bottom: 0;
        left: 50%;
        z-index: -1;
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
    <p class="textbox">
      For me, exploring grocery stores is a way to understand a place, what
      people eat and how they live. In NYC, there are over 10,000 grocery
      stores, each reflecting different foods, cuisines, and cultures. What do
      they reveal about the people here?<br />
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
      "
    />
    <p class="textbox">
      These are the key elements of brand identity that shape how a store
      presents itself. But beyond branding, do these signs also reflect the
      identities of the people and cultures they serve?
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scroll {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
</style>
