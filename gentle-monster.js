AFRAME.registerComponent("animate-camera", {
    init: function () {
      const cameraRig = document.querySelector("#cameraRig");
  
      setTimeout(() => {
        // Animate Position
        cameraRig.setAttribute("animation", {
          property: "position",
          from: "0 8 40",
          to: "-0.35 0.5 2.5",
          dur: 2500,
          easing: "easeInOutQuad"
        });
  
        // Animate Rotation (Y-axis: 0 → 10 degrees)
        cameraRig.setAttribute("animation__rotation", {
          property: "rotation",
          from: "-5 0 0",
          to: "10 0 0",
          dur: 2500,
          easing: "easeInOutQuad"
        });
  
        // Wait for animation to finish, then enable movement (both desktop and VR)
        setTimeout(() => {
          cameraRig.removeAttribute("animation");
          cameraRig.removeAttribute("animation__rotation");
  
          // Enable both smooth locomotion for VR and WASD for Desktop
          cameraRig.setAttribute("universal-controls", "");
          cameraRig.setAttribute("movement-controls", "speed: 0.1;");
          cameraRig.setAttribute("wasd-controls", "fly: true; acceleration: 5;");
        }, 2500); // Matches animation duration
      }, 1500); // Pause before animation starts
    }
  });
  
  // Attach the component to the camera rig
  document.querySelector("#cameraRig").setAttribute("animate-camera", "");
  