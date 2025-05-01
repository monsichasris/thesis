<template>
  <div ref="matterContainer" class="matter-container"></div>
</template>

<script>
import Matter from "matter-js";

export default {
  name: "MatterAnimation",
  props: {
    basketSvg: {
      type: String,
      required: true, // Pass the SVG path for the basket
    },
    images: {
      type: Array,
      required: true, // Pass an array of image paths for the objects
    },
  },
  mounted() {
    this.initMatter();
  },
  methods: {
    initMatter() {
      const {
        Engine,
        Render,
        Runner,
        Bodies,
        Composite,
        Composites,
        Common,
        Body,
      } = Matter;

      // Get the full screen dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Create engine and world
      const engine = Engine.create();
      const world = engine.world;

      // Create renderer
      const render = Render.create({
        element: this.$refs.matterContainer,
        engine: engine,
        options: {
          width: width, // Full screen width
          height: height, // Full screen height
          wireframes: false, // Use actual images instead of wireframes
          background: "transparent",
        },
      });

      Render.run(render);

      // Create runner
      const runner = Runner.create();
      Runner.run(runner, engine);

      // Add walls to approximate the SVG path
      const leftWall = Bodies.rectangle(
        280,
        height / 1.2,
        1,
        height, // Length of the wall,
        {
          isStatic: true,
          angle: Math.atan2(height / 2 - 0, width / 3 - height * 2), // Calculate the angle of the left wall
          render: {
            fillStyle: "#000", // Optional: color for the wall
          },
        }
      );

      const rightWall = Bodies.rectangle(width - 280, height / 1.2, 1, height, {
        isStatic: true,
        angle: Math.atan2(0 - height / 2, width / 3 - height * 2), // Calculate the angle of the right wall
        render: {
          fillStyle: "#000", // Optional: color for the wall
        },
      });

      const bottomWall = Bodies.rectangle(width / 2, height, width, 50, {
        isStatic: true,
        render: {
          fillStyle: "#000", // Optional: color for the wall
        },
      });

      Composite.add(world, [leftWall, rightWall, bottomWall]);

      // Use all images in order
      const allImages = [...this.images];

      // Keep track of the current image index
      let imageIndex = 0;

      // Add falling objects in the middle of the screen using Composites.stack
      const stack = Composites.stack(
        width / 2 - 40,
        -600,
        1,
        allImages.length,
        0,
        60,
        (x, y) => {
          // Get the current image and increment the index
          const texture = allImages[imageIndex];
          imageIndex = (imageIndex + 1) % allImages.length; // Cycle through the array

          return Bodies.rectangle(x, y, 50, 50, {
            restitution: 0.5, // Bounciness
            friction: 0.2, // Friction
            render: {
              sprite: {
                texture: texture, // Use the current image
                xScale: 0.5,
                yScale: 0.5,
              },
            },
          });
        }
      );

      // Add the stack to the world
      Composite.add(world, stack);

      // Apply random horizontal forces to scatter objects
      stack.bodies.forEach((body) => {
        const randomForce = Common.random(-0.02, 0.02); // Random horizontal force
        Body.applyForce(
          body,
          { x: body.position.x, y: body.position.y },
          { x: randomForce, y: 0 }
        );
      });

      // Handle window resize
      window.addEventListener("resize", () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        render.options.width = newWidth;
        render.options.height = newHeight;

        // Update wall positions and sizes
        Matter.Body.setPosition(leftWall, { x: 100, y: newHeight / 2 });
        Matter.Body.setPosition(rightWall, {
          x: newWidth - 100,
          y: newHeight / 2,
        });
        Matter.Body.setPosition(bottomWall, {
          x: newWidth / 2,
          y: newHeight - 10,
        });
      });

      // Handle window resize
      window.addEventListener("resize", () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        render.options.width = newWidth;
        render.options.height = newHeight;

        // Update wall positions and sizes
        Matter.Body.setPosition(leftWall, { x: 100, y: newHeight / 2 });
        Matter.Body.setPosition(rightWall, {
          x: newWidth - 100,
          y: newHeight / 2,
        });
        Matter.Body.setPosition(bottomWall, {
          x: newWidth / 2,
          y: newHeight - 20,
        });
      });
      // Add mouse control
      const mouse = Matter.Mouse.create(render.canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.5, // How "stiff" the dragging is
          render: {
            visible: false, // Set to true if you want to see the mouse constraint
          },
        },
      });

      // Add the mouse constraint to the world
      Composite.add(world, mouseConstraint);

      // Keep the mouse in sync with rendering
      render.mouse = mouse;
    },
  },
};
</script>

<style scoped>
.matter-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
