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
      required: true,
    },
    images: {
      type: Array,
      required: true,
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
          width: width,
          height: height,
          wireframes: false,
          background: "transparent",
        },
      });

      Render.run(render);

      const runner = Runner.create();
      Runner.run(runner, engine);

      const leftWall = Bodies.rectangle(280, height / 1.2, 50, height, {
        isStatic: true,
        angle: Math.atan2(height / 2 - 0, width / 3 - height * 2),
        render: {
          fillStyle: "transparent",
        },
      });

      const rightWall = Bodies.rectangle(
        width - 280,
        height / 1.2,
        50,
        height,
        {
          isStatic: true,
          angle: Math.atan2(0 - height / 2, width / 3 - height * 2),
          render: {
            fillStyle: "transparent",
          },
        }
      );

      const bottomWall = Bodies.rectangle(width / 2, height, width / 2, 100, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      });

      Composite.add(world, [leftWall, rightWall, bottomWall]);

      const allImages = [...this.images];

      const objectWidth = 200;
      const objectHeight = 100;

      // Add objects randomly
      allImages.forEach((texture) => {
        // Generate random positions above the canvas
        const x = Math.random() * (width - objectWidth * 0.7) + objectWidth / 2;
        const y = Math.random() * -500;

        const body = Bodies.rectangle(x, y, objectWidth, objectHeight, {
          restitution: 0.6, // Bounciness
          friction: 0.2, // Friction
          render: {
            sprite: {
              texture: texture, // Use the current image
              xScale: 0.7,
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
  position: relative;
}
</style>
