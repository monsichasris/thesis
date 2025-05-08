<template>
  <div style="display: flex; flex-direction: column">
    <div class="textbox">
      Each neighborhood has its own identity, shaped by the people who live
      there. You can see it in the grocery stores they visit, the food they eat,
      the design of their storefronts featured in this project, and the everyday
      details of life. Grocery store signs are just one piece of the
      puzzle—there are more stories waiting to be discovered out there.
    </div>
    <div class="image-container">
      <img src="img/cashier.svg" class="cashier" />
      <img src="img/checkout.png" class="checkout" />
    </div>
  </div>
  <!-- <div class="foot">
    <a>Monsicha Srisuantang</a>
    <a>MS Data Visualization, Parsons School of Design, The New School</a>
  </div> -->
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
.textbox {
  margin-top: 20vh;
}

.image-container {
  position: relative;
  width: 100%; /* Adjust as needed */
  height: auto; /* Maintain aspect ratio */
  overflow: hidden;
}

.cashier {
  width: 100%; /* Full width for the cashier image */
  height: auto;
}

.checkout {
  position: absolute;
  bottom: 0; /* Align to the bottom of the container */
  left: 50%; /* Start at the center */
  transform: translateX(-50%); /* Center horizontally */
  height: 51%;
  animation: moveToLeft 20s ease-in-out forwards; /* Add animation */
}
/* Keyframe animation to move the checkout image to the left */
@keyframes moveToLeft {
  0% {
    left: 0%; /* Start at the center */
    transform: translateX(-50%);
  }
  100% {
    left: 0%; /* Move to the left */
    transform: translateX(0);
  }
}
</style>
