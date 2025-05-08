<template>
  <div style="display: flex; flex-direction: column">
    <div class="textbox">
      Each neighborhood has its own unique identity, shaped by the people who
      live there. We can see it reflected in everyday objects, like grocery
      stores. It’s another way to experience the city through the signs we often
      pass by. <br /><br />Let's go check out in your neighborhood!
    </div>
    <div class="image-container">
      <img src="img/cashier.svg" class="cashier" />
      <img src="img/checkout.png" class="checkout" ref="checkoutImage" />
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
  mounted() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add the animation class when the element is visible
            this.$refs.checkoutImage.classList.add("animate");
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 50% of the element is visible
      }
    );

    // Observe the checkout image
    observer.observe(this.$refs.checkoutImage);
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
  width: 100%;
  height: auto;
  overflow: hidden;
}

.cashier {
  width: 100%;
  height: auto;
}

.checkout {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 51%;
}

.checkout.animate {
  animation: moveToLeft 20s ease-in-out forwards; /* Add animation when visible */
}

/* Keyframe animation to move the checkout image to the left */
@keyframes moveToLeft {
  0% {
    left: 50%;
    transform: translateX(-50%);
  }
  20% {
    left: 40%;
    transform: translateX(-40%);
  }
  25% {
    left: 40%;
    transform: translateX(-40%); /* Pause for 1 second */
  }
  40% {
    left: 30%;
    transform: translateX(-30%);
  }
  45% {
    left: 30%;
    transform: translateX(-30%); /* Pause for 1 second */
  }
  60% {
    left: 20%;
    transform: translateX(-20%);
  }
  65% {
    left: 20%;
    transform: translateX(-20%); /* Pause for 1 second */
  }
  80% {
    left: 10%;
    transform: translateX(-10%);
  }
  85% {
    left: 10%;
    transform: translateX(-10%); /* Pause for 1 second */
  }
  100% {
    left: 0%;
    transform: translateX(0);
  }
}
</style>
