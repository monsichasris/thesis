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
      const { Engine, Render, Runner, Bodies, Composite } = Matter;

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
        50,
        height, // Length of the wall,
        {
          isStatic: true,
          angle: Math.atan2(height / 2 - 0, width / 3 - height * 2), // Calculate the angle of the left wall
          render: {
            fillStyle: "transparent", // Optional: color for the wall
          },
        }
      );

      const rightWall = Bodies.rectangle(
        width - 280,
        height / 1.2,
        50,
        height,
        {
          isStatic: true,
          angle: Math.atan2(0 - height / 2, width / 3 - height * 2), // Calculate the angle of the right wall
          render: {
            fillStyle: "transparent", // Optional: color for the wall
          },
        }
      );

      const bottomWall = Bodies.rectangle(width / 2, height, width, 100, {
        isStatic: true,
        render: {
          fillStyle: "transparent", // Make the wall transparent
        },
      });

      Composite.add(world, [leftWall, rightWall, bottomWall]);

      // Use all images in order
      const allImages = [...this.images];

      // Define the new size for the objects
      const objectWidth = 40; // Width of the objects
      const objectHeight = 40; // Height of the objects

      // Add objects randomly
      allImages.forEach((texture) => {
        // Generate random positions above the canvas
        const x = Math.random() * (width - objectWidth * 0.7) + objectWidth / 2; // Random horizontal position
        const y = Math.random() * -500; // Random vertical position above the canvas

        const body = Bodies.rectangle(x, y, objectWidth, objectHeight, {
          restitution: 0.6, // Bounciness
          friction: 0.2, // Friction
          render: {
            sprite: {
              texture: texture, // Use the current image
              xScale: 0.7, // Scale the image to match the new size
              yScale: 0.7,
            },
          },
        });

        // Add the body to the world
        Composite.add(world, body);
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
          stiffness: 0.2, // How "stiff" the dragging is
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
