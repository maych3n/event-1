// Function to toggle the sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Function to handle the fixed button click
function buttonClicked() {
    alert('Button clicked!');
}

// VR code
AFRAME.registerComponent('custom-joystick-controls', {
    init: function () {
      this.cameraRig = document.getElementById('rig');
      this.leftJoystickY = 0;
      this.rightJoystickX = 0;
      this.rightJoystickY = 0;
  
      // Left Controller (Y-Axis Flying)
      this.el.sceneEl.addEventListener('axismove', (event) => {
        if (event.target.components['oculus-touch-controls']?.data.hand === 'left') {
          this.leftJoystickY = event.detail.axis[1]; // Up/Down on Y-Axis
        }
      });
  
      // Right Controller (X and Z Movement)
      this.el.sceneEl.addEventListener('axismove', (event) => {
        if (event.target.components['oculus-touch-controls']?.data.hand === 'right') {
          this.rightJoystickX = event.detail.axis[0]; // Left/Right on X-Axis
          this.rightJoystickY = event.detail.axis[1]; // Forward/Backward on Z-Axis
        }
      });
    },
  
    tick: function (time, timeDelta) {
      const speed = 0.05; // Adjust for faster/slower movement
      const position = this.cameraRig.getAttribute('position');
  
      // Adjust the Y-axis using the left joystick
      position.y += this.leftJoystickY * speed;
  
      // Adjust X and Z axis using the right joystick
      position.x += this.rightJoystickX * speed;
      position.z += this.rightJoystickY * speed;
  
      this.cameraRig.setAttribute('position', position);
    }
  });
  