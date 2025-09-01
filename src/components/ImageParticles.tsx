// src/components/AnimatedImageParticles.js

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

const AnimatedImageParticles = () => {
  const [init, setInit] = useState(false);

  // This should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles container loaded", container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#0d1117", // A dark, clean background
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "bubble", // Makes particles grow on hover
          },
        },
        modes: {
          bubble: {
            distance: 200,
            duration: 2,
            opacity: 1,
            size: 30, // The size particles will grow to
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.1, // Subtle links
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce", // Particles bounce off the edges
          },
          random: true, // Random direction
          speed: 1.5, // A gentle speed
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80, // Adjust the number of particles
        },
        opacity: {
          value: 0.7, // Slightly transparent particles
        },
        shape: {
          type: "image",
          image: {
            src: "/favicon.png", // Path to your image in the public folder
            width: 32,
            height: 32,
          },
        },
        size: {
          value: { min: 8, max: 16 }, // Particles will have a random size in this range
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
    );
  }

  return <></>;
};

export default AnimatedImageParticles;